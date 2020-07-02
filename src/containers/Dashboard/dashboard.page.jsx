import React from 'react';
import Heading from 'react-bulma-components/lib/components/heading';
import Section from 'react-bulma-components/lib/components/section';
import Container from 'react-bulma-components/lib/components/container';
import Level from 'react-bulma-components/lib/components/level';
import Tile from 'react-bulma-components/lib/components/tile';
import Dropdown from 'react-bulma-components/lib/components/dropdown';
import MeedLoader from '../../components/MeedLoader/MeedLoader';
import Header from '../../components/Header/Header';
import Bar from '../../components/Charts/Bar/Bar';
import Line from '../../components/Charts/Line/Line';
import Card from '../../components/Card/Card';
import { clearStorage, getUserId } from '../../common/GlobalVars';
import { logout, dashBoardSummary, dashBoardHistoricalData } from '../../apis/meed';
import './dashboard.page.scss';

import ErrorBoundary from '../../hoc/error';
import { Columns } from 'react-bulma-components';
import moment from 'moment';

class Dashboard extends React.Component {
  state = {
    dropdownOptions: [{ text: 'Rolling 12 Months', value: 1 }],
    selectedOption: { text: 'Rolling 12 Months', value: 1 },
    thisMonthActiveUser: 0,
    totalActiveUser: 0,
    thisMonthMeedShare: 0,
    totalMeedShare: 0,
    userGraphData: [],
    activeuserGraphData: [],
    incomeGraphData: [],
    xaxis: [],
    totalNewUserNumber: 0,
    totalActiveUserNumber: 0,
    totalMeedShareNumber: 0,
    applicationGraph: false,
    userGraph: false,
    incomeGraph: false,
    loader: '',
    applicationGraphBodyCss: 'has-card-opacity has-background-salmon has-rounded-top-corners has-font-white',
    userGraphBodyCss: 'has-card-opacity has-background-blue-light has-rounded-top-corners has-font-white',
    incomeGraphBodyCss: 'has-card-opacity has-background-green-brighter has-rounded-top-corners has-font-white',
    applicationGraphFooterCss: 'has-card-opacity has-bottom-border has-background-salmon has-rounded-bottom-corners is-bottom-color-box',
    userGraphFooterCss: 'has-card-opacity has-bottom-border has-background-blue-light has-rounded-bottom-corners is-bottom-color-box',
    incomeGraphFooterCss: 'has-card-opacity has-bottom-border has-background-green-brighter has-rounded-bottom-corners is-bottom-color-box',
    graphColor: ['#FF925D'],
    series: [{ name: ' ', data: [] }],
    graphType: 'null',
    legend: true,
  };

  componentDidMount() {
    try {
      this.dashBoardData();
    } catch (err) {
      console.log(err);
    }
  }

  monthName = (mon) => {
    return ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'][mon - 1];
  };

  historicalDataLoad = (lastYearActiveUserData, historicalData) => {
    let newUserData = new Array(12).fill(null);
    let activeUserData = new Array(12).fill(null);
    let meedShareData = new Array(12).fill(null);
    let xaxisList = new Array(12).fill(null);
    let tempActiveUser = 0;
    let month = 0;
    let year = 0;
    let j = 0;
    let totalNewUserNumberData = 0;
    let totalActiveUserNumberData = 0;
    let totalMeedShareNumberData = 0;

    if (this.state.selectedOption.value === 1) {
      let startDate = moment.utc().subtract(1, 'years').startOf('month').format('YYYY/MM/DD');
      month = moment(startDate).format('M');
      year = moment(startDate).format('YY');

      for (let i = 0; i < 12; i++) {
        if (month > 12) {
          month = 1;
          year = parseInt(year) + 1;
        }
        xaxisList[i] = this.monthName(month) + ' ' + year;
        if (historicalData.length) {
          if (historicalData[j]) {
            if (parseInt(historicalData[j].month) === parseInt(month)) {
              if (j === 0) {
                tempActiveUser = lastYearActiveUserData;
              }
              let hData = historicalData[j].user ? historicalData[j].user : 0;
              tempActiveUser = tempActiveUser + hData;

              newUserData[i] = historicalData[j].user ? historicalData[j].user : null;
              activeUserData[i] = tempActiveUser ? tempActiveUser : null;
              meedShareData[i] = historicalData[j].income ? historicalData[j].income.toFixed(2) : null;
              totalNewUserNumberData = totalNewUserNumberData + (historicalData[j].user ? historicalData[j].user : 0);
              totalMeedShareNumberData = totalMeedShareNumberData + (historicalData[j].income ? historicalData[j].income.toFixed(2) : 0.0);
              j++;
            }
          }
        }
        month++;
      }
    } else {
      for (let i = 0; i < 12; i++) {
        xaxisList[i] = this.monthName(i + 1) + ' ' + this.state.selectedOption.value.toString().substr(-2);
        if (historicalData.length) {
          if (historicalData[i]) {
            if (i === 0) {
              tempActiveUser = lastYearActiveUserData;
            }
            let hData = historicalData[i].user ? historicalData[j].user : 0;
            tempActiveUser = tempActiveUser + hData;

            newUserData[historicalData[i].month - 1] = historicalData[i].user ? historicalData[i].user : null;
            activeUserData[historicalData[i].month - 1] = tempActiveUser ? tempActiveUser : null;
            meedShareData[historicalData[i].month - 1] = historicalData[i].income ? historicalData[i].income.toFixed(2) : null;
            totalNewUserNumberData = totalNewUserNumberData + (historicalData[i].user ? historicalData[i].user : 0);
            totalMeedShareNumberData = totalMeedShareNumberData + (historicalData[i].income ? historicalData[i].income.toFixed(2) : 0.0);
          }
        }
      }
    }

    totalActiveUserNumberData = lastYearActiveUserData + totalNewUserNumberData;
    totalMeedShareNumberData = parseFloat(totalMeedShareNumberData).toFixed(2);
    this.setState({
      userGraphData: newUserData,
      activeUserGraphData: activeUserData,
      incomeGraphData: meedShareData,
      xaxis: xaxisList,
      totalActiveUserNumber: totalActiveUserNumberData,
      totalNewUserNumber: totalNewUserNumberData,
      totalMeedShareNumber: totalMeedShareNumberData,
    });
  };

  dashBoardData = async () => {
    this.setState({ loader: <MeedLoader /> });
    try {
      const { data: summaryData, success: summarySuccess } = await dashBoardSummary();
      const { lastYearActiveUserData, historicalData, success: historicalSuccess } = await dashBoardHistoricalData(true, null);
      if (historicalSuccess) {
        this.historicalDataLoad(lastYearActiveUserData, historicalData);
      }
      if (summarySuccess) {
        this.setState({
          thisMonthActiveUser: summaryData.activeUser,
          totalActiveUser: summaryData.totalActiveUser,
          thisMonthMeedShare: summaryData.lastMonthIncome.toFixed(2),
          totalMeedShare: summaryData.totalIncome.toFixed(2),
          dropdownOptions: [...this.state.dropdownOptions, ...summaryData.years],
        });
      }

      this.setState({ loader: '' });
    } catch (error) {
      this.setState({ loader: '' });
      console.log(error);
    }
  };

  application_user_graph = async () => {
    if (this.state.applicationGraph && this.state.userGraph) {
      this.setState({
        series: [
          {
            name: 'Active User',
            data: this.state.activeUserGraphData,
          },
          {
            name: 'New Users',
            data: this.state.userGraphData,
          },
        ],
        graphType: 'line',
        legend: true,
        graphColor: ['#53C9FF', '#FF925D'],
        applicationGraphBodyCss: 'has-background-salmon has-rounded-top-corners has-font-white',
        applicationGraphFooterCss: 'has-bottom-border has-background-salmon has-rounded-bottom-corners is-bottom-color-box',
        userGraphBodyCss: 'has-background-blue-light has-rounded-top-corners has-font-white',
        userGraphFooterCss: 'has-bottom-border has-background-blue-light has-rounded-bottom-corners is-bottom-color-box',
      });
    } else if (this.state.applicationGraph) {
      this.setState({
        series: [
          {
            name: ' ',
            data: [],
          },
          {
            name: 'New Users',
            data: this.state.userGraphData,
          },
        ],
        graphType: 'line',
        legend: true,
        graphColor: ['#FF925D'],
        applicationGraphBodyCss: 'has-background-salmon has-rounded-top-corners has-font-white',
        applicationGraphFooterCss: 'has-bottom-border has-background-salmon has-rounded-bottom-corners is-bottom-color-box',
        userGraphBodyCss: 'has-card-opacity has-background-blue-light has-rounded-top-corners has-font-white',
        userGraphFooterCss: 'has-card-opacity has-bottom-border has-background-blue-light has-rounded-bottom-corners is-bottom-color-box',
        incomeGraphBodyCss: 'has-card-opacity has-background-green-brighter has-rounded-top-corners has-font-white',
        incomeGraphFooterCss: 'has-card-opacity has-bottom-border has-background-green-brighter has-rounded-bottom-corners is-bottom-color-box',
      });
    } else if (this.state.userGraph) {
      this.setState({
        series: [
          {
            name: 'Active User',
            data: this.state.activeUserGraphData,
          },
          {
            name: '',
            data: [],
          },
        ],
        graphType: 'line',
        legend: true,
        graphColor: ['#53C9FF'],
        userGraphBodyCss: 'has-background-blue-light has-rounded-top-corners has-font-white',
        userGraphFooterCss: 'has-bottom-border has-background-blue-light has-rounded-bottom-corners is-bottom-color-box',
        applicationGraphBodyCss: 'has-card-opacity has-background-salmon has-rounded-top-corners has-font-white',
        applicationGraphFooterCss: 'has-card-opacity has-bottom-border has-background-salmon has-rounded-bottom-corners is-bottom-color-box',
        incomeGraphBodyCss: 'has-card-opacity has-background-green-brighter has-rounded-top-corners has-font-white',
        incomeGraphFooterCss: 'has-card-opacity has-bottom-border has-background-green-brighter has-rounded-bottom-corners is-bottom-color-box',
      });
    } else {
      this.setState({
        series: [
          {
            name: ' ',
            data: new Array(12).fill(null),
          },
        ],
        graphType: 'null',
        legend: false,
        graphColor: ['#53C9FF'],
        applicationGraphBodyCss: 'has-card-opacity has-background-salmon has-rounded-top-corners has-font-white',
        applicationGraphFooterCss: 'has-card-opacity has-bottom-border has-background-salmon has-rounded-bottom-corners is-bottom-color-box',
        userGraphBodyCss: 'has-card-opacity has-background-blue-light has-rounded-top-corners has-font-white',
        userGraphFooterCss: 'has-card-opacity has-bottom-border has-background-blue-light has-rounded-bottom-corners is-bottom-color-box',
        incomeGraphBodyCss: 'has-card-opacity has-background-green-brighter has-rounded-top-corners has-font-white',
        incomeGraphFooterCss: 'has-card-opacity has-bottom-border has-background-green-brighter has-rounded-bottom-corners is-bottom-color-box',
      });
    }
  };

  income_graph = () => {
    if (this.state.incomeGraph) {
      this.setState({
        series: [
          {
            name: 'MeedShare Income',
            data: this.state.incomeGraphData,
          },
        ],
        graphType: 'bar',
        legend: true,
        graphColor: ['#1DD090'],
        applicationGraphBodyCss: 'has-card-opacity has-background-salmon has-rounded-top-corners has-font-white',
        applicationGraphFooterCss: 'has-card-opacity has-bottom-border has-background-salmon has-rounded-bottom-corners is-bottom-color-box',
        userGraphBodyCss: 'has-card-opacity has-card-opacity has-background-blue-light has-rounded-top-corners has-font-white',
        userGraphFooterCss:
          'has-card-opacity has-card-opacity has-bottom-border has-background-blue-light has-rounded-bottom-corners is-bottom-color-box',
        incomeGraphBodyCss: 'has-background-green-brighter has-rounded-top-corners has-font-white',
        incomeGraphFooterCss: 'has-bottom-border has-background-green-brighter has-rounded-bottom-corners is-bottom-color-box',
      });
    } else {
      this.setState({
        series: [
          {
            name: ' ',
            data: new Array(12).fill(null),
          },
        ],
        graphType: 'null',
        legend: false,
        graphColor: ['#1DD090'],
        applicationGraphBodyCss: 'has-card-opacity has-background-salmon has-rounded-top-corners has-font-white',
        applicationGraphFooterCss: 'has-card-opacity has-bottom-border has-background-salmon has-rounded-bottom-corners is-bottom-color-box',
        userGraphBodyCss: 'has-card-opacity has-background-blue-light has-rounded-top-corners has-font-white',
        userGraphFooterCss: 'has-card-opacity has-bottom-border has-background-blue-light has-rounded-bottom-corners is-bottom-color-box',
        incomeGraphBodyCss: 'has-card-opacity has-background-green-brighter has-rounded-top-corners has-font-white',
        incomeGraphFooterCss: 'has-card-opacity has-bottom-border has-background-green-brighter has-rounded-bottom-corners is-bottom-color-box',
      });
    }
  };

  /** Employee Totals 3 card click events */

  applicationGraphClick = async () => {
    await this.setState({ applicationGraph: !this.state.applicationGraph });
    await this.setState({ incomeGraph: false });
    await this.application_user_graph();
  };

  userGraphClick = async () => {
    await this.setState({ userGraph: !this.state.userGraph });
    await this.setState({ incomeGraph: false });
    await this.application_user_graph();
  };

  incomeGraphClick = async () => {
    await this.setState({ incomeGraph: !this.state.incomeGraph });
    await this.setState({ applicationGraph: false });
    await this.setState({ userGraph: false });
    await this.income_graph();
  };

  /** Logout event work */
  userLogoutHandler = () => {
    this.userLogout();
  };

  userLogout = async () => {
    const data = await logout({ userId: getUserId() });
    try {
      if (data.success) {
        clearStorage();
        this.setState({ loader: <MeedLoader /> });
        this.props.history.push('/login');
      }
    } catch (error) {
      console.log(error);
    }
  };
  /** End of Logout event work */

  changeDropDown = async (event) => {
    const selected = this.state.dropdownOptions.find((option) => option.value === event);
    await this.setState({
      selectedOption: selected,
      applicationGraph: false,
      userGraph: false,
      incomeGraph: false,
    });
    let rolling = null;
    let year = null;
    if (event === 1) {
      rolling = true;
    } else {
      year = event;
    }
    await this.application_user_graph();
    await this.income_graph();
    const { lastYearActiveUserData, historicalData, success: historicalSuccess } = await dashBoardHistoricalData(rolling, year);
    if (historicalSuccess) {
      this.historicalDataLoad(lastYearActiveUserData, historicalData);
    }
  };

  render() {
    return (
      <ErrorBoundary>
        <div>
          {this.state.loader}
          <React.Fragment>
            <Header userLogoutHandler={this.userLogoutHandler} />
            <Section>
              <Container fluid>
                <Level renderAs='nav'>
                  <Level.Side align='left'>
                    <Level.Item>
                      <Heading subtitle size={4} className='has-text-primary has-text-weight-bold'>
                        MeedShare Summary
                      </Heading>
                    </Level.Item>
                  </Level.Side>
                </Level>
                <hr />
              </Container>
            </Section>
            <Section>
              <Container fluid>
                <Columns>
                  <Columns.Column size='half' offset='one-quarter'>
                    <Tile kind='ancestor' className='has-averta-regular-font'>
                      <Tile size={12} vertical>
                        <Tile className='is-tile-row'>
                          <Card
                            subtitle={'subtitle is-2'}
                            bodyClass={'has-background-grey-qua has-rounded-top-corners'}
                            cardData={this.state.thisMonthActiveUser}
                            cardText={'New Active Users'}
                            monthYear={moment().format('MMMM')}
                            footerClass={'has-bottom-border has-background-salmon has-rounded-bottom-corners is-bottom-color-box'}
                          />

                          <Card
                            subtitle={'subtitle is-2'}
                            bodyClass={'has-background-grey-qua has-rounded-top-corners'}
                            cardData={this.state.totalActiveUser}
                            cardText={'Active Users'}
                            monthYear={'Now'}
                            footerClass={'has-bottom-border has-background-blue-light has-rounded-bottom-corners is-bottom-color-box'}
                          />
                        </Tile>

                        <Tile className='is-tile-row'>
                          <Card
                            subtitle={'subtitle is-2'}
                            bodyClass={'has-background-grey-qua has-rounded-top-corners'}
                            cardData={`$${this.state.thisMonthMeedShare}`}
                            cardText={'MeedShare Income'}
                            monthYear={moment().format('MMMM')}
                            footerClass={'has-bottom-border has-background-green-bright has-rounded-bottom-corners is-bottom-color-box'}
                          />
                          <Card
                            subtitle={'subtitle is-2'}
                            bodyClass={'has-background-grey-qua has-rounded-top-corners'}
                            cardData={`$${this.state.totalMeedShare}`}
                            cardText={'MeedShare Income'}
                            monthYear={'To Date'}
                            footerClass={'has-bottom-border has-background-green-bright has-rounded-bottom-corners is-bottom-color-box'}
                          />
                        </Tile>
                      </Tile>
                    </Tile>
                  </Columns.Column>
                </Columns>
              </Container>
            </Section>

            <Section>
              <Container fluid>
                <Level renderAs='nav'>
                  <Level.Side align='left'>
                    <Level.Item>
                      <Heading subtitle size={4} className='has-text-primary has-text-weight-bold'>
                        Employee Totals: <em>{this.state.selectedOption.text}</em>
                      </Heading>
                    </Level.Item>
                  </Level.Side>

                  <Level.Side align='right'>
                    <Level.Item>
                      <Dropdown
                        value={this.state.selectedOption.value}
                        up={false}
                        onChange={(e) => this.changeDropDown(e)}
                        className='dropdown-wrapper'
                      >
                        {this.state.dropdownOptions.map((dropdownOption, i) => (
                          <Dropdown.Item key={i} value={dropdownOption.value}>
                            {dropdownOption.text}
                          </Dropdown.Item>
                        ))}
                      </Dropdown>
                    </Level.Item>
                  </Level.Side>
                </Level>
                <hr />
              </Container>
            </Section>

            <Section>
              <Container fluid>
                <Tile kind='ancestor' className='has-averta-regular-font'>
                  <Tile size={6} vertical>
                    <Tile className='is-tile-row'>
                      <div className='card-button' onClick={this.applicationGraphClick}>
                        <Card
                          subtitle={'subtitle is-2 has-subtitle-white'}
                          bodyClass={this.state.applicationGraphBodyCss}
                          cardData={this.state.totalNewUserNumber}
                          monthYear={'New Users'}
                          footerClass={this.state.applicationGraphFooterCss}
                        />
                      </div>
                      <div className='card-button' onClick={this.userGraphClick}>
                        <Card
                          subtitle={'subtitle is-2 has-subtitle-white'}
                          bodyClass={this.state.userGraphBodyCss}
                          cardData={this.state.totalActiveUserNumber}
                          monthYear={'Active Users'}
                          footerClass={this.state.userGraphFooterCss}
                        />
                      </div>
                      <div className='card-button' onClick={this.incomeGraphClick}>
                        <Card
                          subtitle={'subtitle is-2 has-subtitle-white'}
                          bodyClass={this.state.incomeGraphBodyCss}
                          cardData={`$${this.state.totalMeedShareNumber}`}
                          monthYear={'MeedShare Income'}
                          footerClass={this.state.incomeGraphFooterCss}
                        />
                      </div>
                    </Tile>
                  </Tile>
                </Tile>
              </Container>
            </Section>

            <Section>
              <Container fluid>
                <div className='graphArea'>
                  {this.state.graphType === 'line' ? (
                    <Line
                      series={this.state.series}
                      xaxis={this.state.xaxis}
                      legend={this.state.legend}
                      graphColor={this.state.graphColor}
                      graphType={this.state.graphType}
                    />
                  ) : null}
                  {this.state.graphType === 'bar' ? (
                    <Bar
                      series={this.state.series}
                      xaxis={this.state.xaxis}
                      legend={this.state.legend}
                      graphColor={this.state.graphColor}
                      graphType={this.state.graphType}
                    />
                  ) : null}
                  {this.state.graphType === 'null' ? (
                    <Bar
                      series={this.state.series}
                      xaxis={this.state.xaxis}
                      legend={this.state.legend}
                      graphColor={this.state.graphColor}
                      graphType={this.state.graphType}
                    />
                  ) : null}
                </div>
              </Container>
            </Section>
          </React.Fragment>
        </div>
      </ErrorBoundary>
    );
  }
}

export default Dashboard;
