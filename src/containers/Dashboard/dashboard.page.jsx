import React from "react";
import Heading from "react-bulma-components/lib/components/heading";
import Section from "react-bulma-components/lib/components/section";
import Container from "react-bulma-components/lib/components/container";
import Level from "react-bulma-components/lib/components/level";
import Tile from "react-bulma-components/lib/components/tile";
import Dropdown from "react-bulma-components/lib/components/dropdown";
import MeedLoader from "../../components/MeedLoader/MeedLoader";
import Header from "../../components/Header/Header";
import Bar from "../../components/Charts/Bar/Bar";
import Line from "../../components/Charts/Line/Line";
import Card from "../../components/Card/Card";
import { clearStorage, setDashboardData, getDashboardData, getUserId } from "../../common/GlobalVars";
import { logout, dashBoard } from "../../apis/meed";
import "./dashboard.scss";
import ErrorBoundary from "../../hoc/ErrorBoundary";
import { Columns } from "react-bulma-components";
import moment from "moment";

class Dashboard extends React.Component {
  state = {
    dropdownOptions: [
      { text: "Rolling 12 Months", value: 1 },
      { text: "2019", value: 2019 },
    ],
    selectedOption: { text: "Rolling 12 Months", value: 1 },
    bankApplication: 0,
    bankApplication2: 0,
    activeUser: 0,
    activeUser2: 0,
    socialBoostIncome: 0,
    socialBoostIncome2: 0,
    totalShare: 0,
    totalcShare: 0,
    share: 0,
    corporateShare: 0,
    loader: "",
    groupSize_employee_total: 1,
    month_year: "Month",
    month_year3: "Month",
    applicationGraphData: [],
    userGraphData: [],
    incomeGraphData: [],
    applicationGraph: false,
    userGraph: false,
    incomeGraph: false,
    applicationGraphBodyCss: "has-card-opacity has-background-salmon has-rounded-top-corners has-font-white",
    userGraphBodyCss: "has-card-opacity has-background-blue-light has-rounded-top-corners has-font-white",
    incomeGraphBodyCss: "has-card-opacity has-background-green-brighter has-rounded-top-corners has-font-white",
    applicationGraphFooterCss: "has-card-opacity has-bottom-border has-background-salmon has-rounded-bottom-corners is-bottom-color-box",
    userGraphFooterCss: "has-card-opacity has-bottom-border has-background-blue-light has-rounded-bottom-corners is-bottom-color-box",
    incomeGraphFooterCss: "has-card-opacity has-bottom-border has-background-green-brighter has-rounded-bottom-corners is-bottom-color-box",
    graphColor: ["#FF925D"],
    series: [{ name: " ", data: [] }],
    graphType: "bar",
    legend: true,
  };

  componentDidMount() {
    try {
      this.dashBoardData();
    } catch (err) {
      console.log(err);
    }
  }

  dashBoardData = async () => {
    this.setState({ loader: <MeedLoader /> });
    try {
      const data = await dashBoard();
      if (data.success) {
        setDashboardData(data.data.statusHistory);
        const hisData = JSON.parse(getDashboardData());

        let filteData = hisData.filter((data) => {
          if (data.year === new Date().getFullYear() && data.month === new Date().getMonth() + 1 && data.country === "USA") return true;
          return "";
        });
        if (!filteData.length) {
          filteData = [
            {
              application: 0,
              country: 0,
              income: 0,
              userInviter: 0,
              month: 0,
              requests: 0,
              user: 0,
              year: 0,
            },
          ];
        }
        let inviter = filteData[0].userInviter ? filteData[0].userInviter : 0;
        let totalShare = filteData[0].totalShare ? filteData[0].totalShare : 0;
        let totalCorporateShare = filteData[0].totalCorporateShare ? filteData[0].totalCorporateShare : 0;

        let userShare = totalShare !== 0 ? (inviter * 100) / totalShare : 0;
        let userCorporateShare = totalCorporateShare !== 0 ? (inviter * 100) / totalCorporateShare : 0;

        let applicationData = new Array(12).fill(null);
        let userData = new Array(12).fill(null);
        let incomeData = new Array(12).fill(null);

        for (let i = 0; i < 12; i++) {
          if (filteData.length) {
            if (filteData[i]) {
              applicationData[filteData[i].month - 1] = filteData[i].application ? filteData[i].application : null;
              userData[filteData[i].month - 1] = filteData[i].user ? filteData[i].user : null;
              incomeData[filteData[i].month - 1] = filteData[i].income ? filteData[i].income.toFixed(2) : null;
            }
          }
        }

        this.setState({
          bankApplication: filteData[0].application ? filteData[0].application : 0,
          activeUser: filteData[0].user ? filteData[0].user : 0,
          socialBoostIncome: filteData[0].income ? filteData[0].income.toFixed(2) : 0,
          totalShare: filteData[0].totalShare ? filteData[0].totalShare : 0,
          totalcShare: filteData[0].totalCorporateShare ? filteData[0].totalCorporateShare : 0,
          share: userShare.toFixed(2),
          corporateShare: userCorporateShare.toFixed(2),
          applicationGraphData: applicationData,
          userGraphData: userData,
          incomeGraphData: incomeData,
          bankApplication2: filteData[0].application ? filteData[0].application : 0,
          activeUser2: filteData[0].user ? filteData[0].user : 0,
          socialBoostIncome2: filteData[0].income ? filteData[0].income.toFixed(2) : 0,
        });
        this.setState({ loader: "" });
      } else {
      }
    } catch (error) {
      console.log(error);
    }
  };

  graphSeries = async () => {
    if (this.state.applicationGraph && this.state.userGraph) {
      this.setState({
        series: [
          {
            name: "New Users",
            data: this.state.applicationGraphData,
          },
          {
            name: "Active User",
            data: this.state.userGraphData,
          },
        ],
      });
    } else if (this.state.applicationGraph) {
      await this.setState({
        series: [
          {
            name: "New Users",
            data: this.state.applicationGraphData,
          },
          {
            name: "",
            data: [],
          },
        ],
      });
    } else if (this.state.userGraph) {
      this.setState({
        series: [
          {
            name: "",
            data: [],
          },
          {
            name: "Active User",
            data: this.state.userGraphData,
          },
        ],
      });
    } else if (this.state.incomeGraph) {
      this.setState({
        series: [
          {
            name: "MeedShare Income",
            data: this.state.incomeGraphData,
          },
        ],
      });
    } else {
      this.setState({
        series: [
          {
            name: " ",
            data: new Array(12).fill(null),
          },
        ],
      });
    }
  };

  application_user_graph = async () => {
    if (this.state.applicationGraph && this.state.userGraph) {
      this.setState({
        series: [
          {
            name: "New Users",
            data: this.state.applicationGraphData,
          },
          {
            name: "Active User",
            data: this.state.userGraphData,
          },
        ],
        graphType: "line",
        legend: true,
        graphColor: ["#FF925D", "#53C9FF"],
        applicationGraphBodyCss: "has-background-salmon has-rounded-top-corners has-font-white",
        applicationGraphFooterCss: "has-bottom-border has-background-salmon has-rounded-bottom-corners is-bottom-color-box",
        userGraphBodyCss: "has-background-blue-light has-rounded-top-corners has-font-white",
        userGraphFooterCss: "has-bottom-border has-background-blue-light has-rounded-bottom-corners is-bottom-color-box",
      });
    } else if (this.state.applicationGraph) {
      this.setState({
        series: [
          {
            name: "New Users",
            data: this.state.applicationGraphData,
          },
          {
            name: " ",
            data: [],
          },
        ],
        graphType: "line",
        legend: true,
        graphColor: ["#FF925D"],
        applicationGraphBodyCss: "has-background-salmon has-rounded-top-corners has-font-white",
        applicationGraphFooterCss: "has-bottom-border has-background-salmon has-rounded-bottom-corners is-bottom-color-box",
        userGraphBodyCss: "has-card-opacity has-background-blue-light has-rounded-top-corners has-font-white",
        userGraphFooterCss: "has-card-opacity has-bottom-border has-background-blue-light has-rounded-bottom-corners is-bottom-color-box",
        incomeGraphBodyCss: "has-card-opacity has-background-green-brighter has-rounded-top-corners has-font-white",
        incomeGraphFooterCss: "has-card-opacity has-bottom-border has-background-green-brighter has-rounded-bottom-corners is-bottom-color-box",
      });
    } else if (this.state.userGraph) {
      this.setState({
        series: [
          {
            name: "",
            data: [],
          },
          {
            name: "Active User",
            data: this.state.userGraphData,
          },
        ],
        graphType: "line",
        legend: true,
        graphColor: ["#53C9FF"],
        userGraphBodyCss: "has-background-blue-light has-rounded-top-corners has-font-white",
        userGraphFooterCss: "has-bottom-border has-background-blue-light has-rounded-bottom-corners is-bottom-color-box",
        applicationGraphBodyCss: "has-card-opacity has-background-salmon has-rounded-top-corners has-font-white",
        applicationGraphFooterCss: "has-card-opacity has-bottom-border has-background-salmon has-rounded-bottom-corners is-bottom-color-box",
        incomeGraphBodyCss: "has-card-opacity has-background-green-brighter has-rounded-top-corners has-font-white",
        incomeGraphFooterCss: "has-card-opacity has-bottom-border has-background-green-brighter has-rounded-bottom-corners is-bottom-color-box",
      });
    } else {
      this.setState({
        series: [
          {
            name: " ",
            data: new Array(12).fill(null),
          },
        ],
        graphType: "bar",
        legend: false,
        graphColor: ["#53C9FF"],
        applicationGraphBodyCss: "has-card-opacity has-background-salmon has-rounded-top-corners has-font-white",
        applicationGraphFooterCss: "has-card-opacity has-bottom-border has-background-salmon has-rounded-bottom-corners is-bottom-color-box",
        userGraphBodyCss: "has-card-opacity has-background-blue-light has-rounded-top-corners has-font-white",
        userGraphFooterCss: "has-card-opacity has-bottom-border has-background-blue-light has-rounded-bottom-corners is-bottom-color-box",
        incomeGraphBodyCss: "has-card-opacity has-background-green-brighter has-rounded-top-corners has-font-white",
        incomeGraphFooterCss: "has-card-opacity has-bottom-border has-background-green-brighter has-rounded-bottom-corners is-bottom-color-box",
      });
    }
  };

  income_graph = () => {
    if (this.state.incomeGraph) {
      this.setState({
        series: [
          {
            name: "MeedShare Income",
            data: this.state.incomeGraphData,
          },
        ],
        graphType: "bar",
        legend: true,
        graphColor: ["#1DD090"],
        applicationGraphBodyCss: "has-card-opacity has-background-salmon has-rounded-top-corners has-font-white",
        applicationGraphFooterCss: "has-card-opacity has-bottom-border has-background-salmon has-rounded-bottom-corners is-bottom-color-box",
        userGraphBodyCss: "has-card-opacity has-card-opacity has-background-blue-light has-rounded-top-corners has-font-white",
        userGraphFooterCss:
          "has-card-opacity has-card-opacity has-bottom-border has-background-blue-light has-rounded-bottom-corners is-bottom-color-box",
        incomeGraphBodyCss: "has-background-green-brighter has-rounded-top-corners has-font-white",
        incomeGraphFooterCss: "has-bottom-border has-background-green-brighter has-rounded-bottom-corners is-bottom-color-box",
      });
    } else {
      this.setState({
        series: [
          {
            name: " ",
            data: new Array(12).fill(null),
          },
        ],
        graphType: "bar",
        legend: false,
        graphColor: ["#1DD090"],
        applicationGraphBodyCss: "has-card-opacity has-background-salmon has-rounded-top-corners has-font-white",
        applicationGraphFooterCss: "has-card-opacity has-bottom-border has-background-salmon has-rounded-bottom-corners is-bottom-color-box",
        userGraphBodyCss: "has-card-opacity has-background-blue-light has-rounded-top-corners has-font-white",
        userGraphFooterCss: "has-card-opacity has-bottom-border has-background-blue-light has-rounded-bottom-corners is-bottom-color-box",
        incomeGraphBodyCss: "has-card-opacity has-background-green-brighter has-rounded-top-corners has-font-white",
        incomeGraphFooterCss: "has-card-opacity has-bottom-border has-background-green-brighter has-rounded-bottom-corners is-bottom-color-box",
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

  /** End of Month to Year toggle event 2*/

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
        this.props.history.push("/login");
      }
    } catch (error) {
      console.log(error);
    }
  };
  /** End of Logout event work */

  changeDropDown = (event) => {
    const selected = this.state.dropdownOptions.find((option) => option.value === event);
    this.setState({ selectedOption: selected });
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
                <Level renderAs="nav">
                  <Level.Side align="left">
                    <Level.Item>
                      <Heading subtitle size={4} className="has-text-primary has-text-weight-bold">
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
                  <Columns.Column size="half" offset="one-quarter">
                    <Tile kind="ancestor" className="has-averta-regular-font">
                      <Tile size={12} vertical>
                        <Tile className="is-tile-row">
                          <Card
                            subtitle={"subtitle is-2"}
                            bodyClass={"has-background-grey-qua has-rounded-top-corners"}
                            cardData={this.state.bankApplication}
                            cardText={"New Active Users"}
                            monthYear={moment().format("MMMM")}
                            footerClass={"has-bottom-border has-background-salmon has-rounded-bottom-corners is-bottom-color-box"}
                          />

                          <Card
                            subtitle={"subtitle is-2"}
                            bodyClass={"has-background-grey-qua has-rounded-top-corners"}
                            cardData={this.state.activeUser}
                            cardText={"Active Users"}
                            monthYear={"Now"}
                            footerClass={"has-bottom-border has-background-blue-light has-rounded-bottom-corners is-bottom-color-box"}
                          />
                        </Tile>

                        <Tile className="is-tile-row">
                          <Card
                            subtitle={"subtitle is-2"}
                            bodyClass={"has-background-grey-qua has-rounded-top-corners"}
                            cardData={this.state.socialBoostIncome}
                            cardText={"MeedShare Income"}
                            monthYear={moment().format("MMMM")}
                            footerClass={"has-bottom-border has-background-green-bright has-rounded-bottom-corners is-bottom-color-box"}
                          />
                          <Card
                            subtitle={"subtitle is-2"}
                            bodyClass={"has-background-grey-qua has-rounded-top-corners"}
                            cardData={this.state.socialBoostIncome}
                            cardText={"MeedShare Income"}
                            monthYear={"To Date"}
                            footerClass={"has-bottom-border has-background-green-bright has-rounded-bottom-corners is-bottom-color-box"}
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
                <Level renderAs="nav">
                  <Level.Side align="left">
                    <Level.Item>
                      <Heading subtitle size={4} className="has-text-primary has-text-weight-bold">
                        Employee Totals: <em>{this.state.selectedOption.text}</em>
                      </Heading>
                    </Level.Item>
                  </Level.Side>

                  <Level.Side align="right">
                    <Level.Item>
                      <Dropdown
                        value={this.state.selectedOption.value}
                        up={false}
                        onChange={(e) => this.changeDropDown(e)}
                        className="dropdown-wrapper"
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
                <Tile kind="ancestor" className="has-averta-regular-font">
                  <Tile size={6} vertical>
                    <Tile className="is-tile-row">
                      <div className="card-button" onClick={this.applicationGraphClick}>
                        <Card
                          subtitle={"subtitle is-2 has-subtitle-white"}
                          bodyClass={this.state.applicationGraphBodyCss}
                          cardData={this.state.bankApplication2}
                          monthYear={"New Users"}
                          footerClass={this.state.applicationGraphFooterCss}
                        />
                      </div>
                      <div className="card-button" onClick={this.userGraphClick}>
                        <Card
                          subtitle={"subtitle is-2 has-subtitle-white"}
                          bodyClass={this.state.userGraphBodyCss}
                          cardData={this.state.activeUser2}
                          monthYear={"Active Users"}
                          footerClass={this.state.userGraphFooterCss}
                        />
                      </div>
                      <div className="card-button" onClick={this.incomeGraphClick}>
                        <Card
                          subtitle={"subtitle is-2 has-subtitle-white"}
                          bodyClass={this.state.incomeGraphBodyCss}
                          cardData={this.state.socialBoostIncome2}
                          monthYear={"MeedShare Income"}
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
                <div className="graphArea">
                  {this.state.graphType === "line" ? (
                    <Line series={this.state.series} legend={this.state.legend} graphColor={this.state.graphColor} graphType={this.state.graphType} />
                  ) : (
                    <Bar series={this.state.series} graphColor={this.state.graphColor} graphType={this.state.graphType} />
                  )}
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
