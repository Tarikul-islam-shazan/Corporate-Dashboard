import React from "react";

import Heading from "react-bulma-components/lib/components/heading";
import Section from "react-bulma-components/lib/components/section";
import Container from "react-bulma-components/lib/components/container";
import Level from "react-bulma-components/lib/components/level";
import Tile from "react-bulma-components/lib/components/tile";
import Meedloader from "../../components/Meedloader/Meedloader";
import Switch from "../../components/Switch/Switch";
import Header from "../../components/Header/Header";
import RadialBar from "../../components/Charts/RadialBar/RadialBar";
import Bar from "../../components/Charts/Bar/Bar";
import Line from "../../components/Charts/Line/Line";
import Card from "../../components/Card/Card";

import './Dashboard.scss';
import {
  clearStorage,
  setDashboardData,
  getDashboardData
} from "../../common/GlobalVars";
import { logout, dashBoard } from "../../apis/meed";

const groupOptions = [
  {
    displayName: "Month",
    value: 1
  },
  {
    displayName: "Year",
    value: 2
  }
];

class Dashboard extends React.Component {
  state = {
    bankApplication: 0,
    activeUser: 0,
    totalShare: 0,
    totalcShare: 0,
    loader: "",
    groupSize: 1,
    month_year: "Month",


    applicationGraph: false,
    userGraph: false,
    incomeGraph: false,
    applicationGraphBodyCss: 'has-card-opacity has-background-salmon has-rounded-top-corners has-font-white',
    userGraphBodyCss: 'has-card-opacity has-background-blue-light has-rounded-top-corners has-font-white',
    incomeGraphBodyCss: 'has-card-opacity has-background-green-brighter has-rounded-top-corners has-font-white',
    applicationGraphFooterCss: 'has-card-opacity has-bottom-border has-background-salmon has-rounded-bottom-corners is-bottom-color-box',
    userGraphFooterCss: 'has-card-opacity has-bottom-border has-background-blue-light has-rounded-bottom-corners is-bottom-color-box',
    incomeGraphFooterCss: 'has-card-opacity has-bottom-border has-background-green-brighter has-rounded-bottom-corners is-bottom-color-box',

    graphColor: "",
    series: {},
    graphType: "line"

  };

  componentDidMount() {
    try {
      this.dashBoardData();
    } catch (err) {
      console.log(err);
    }
  }

  applicationGraphClick = () => {

    if (this.state.applicationGraph) {

      this.setState({
        graphType: "line",
        applicationGraph: !this.state.applicationGraph,
        applicationGraphBodyCss: 'has-card-opacity has-background-salmon has-rounded-top-corners has-font-white',
        applicationGraphFooterCss: 'has-card-opacity has-bottom-border has-background-salmon has-rounded-bottom-corners is-bottom-color-box'
      })
    } else {
      this.setState({
        graphType: "bar",
        applicationGraph: !this.state.applicationGraph,
        applicationGraphBodyCss: ' has-background-salmon has-rounded-top-corners has-font-white',
        applicationGraphFooterCss: ' has-bottom-border has-background-salmon has-rounded-bottom-corners is-bottom-color-box'
      })
    }

  }

  userGraphClick = () => {
    alert("user Graph Click");
  }

  incomeGraphClick = () => {
    alert("income Graph Click");
  }

  monthYearToggle = value => {
    this.setState({ groupSize: value });
    this.setState({ loader: <Meedloader /> });
    let totalApplication = 0;
    let totalUser = 0;
    const hisData = JSON.parse(getDashboardData());
    if (value === 1) {
      let filteData = hisData.filter(data => {
        if (
          data.year === new Date().getFullYear() &&
          data.month === new Date().getMonth() + 1
        )
          return true;
        return "";
      });
      this.setState({
        bankApplication: filteData[0].application,
        activeUser: filteData[0].user,
        totalShare: 10,
        totalcShare: 6
      });
      this.setState({ loader: "", month_year: "Month" });
    } else if (value === 2) {
      let filteData = hisData.filter(data => {
        if (data.year === new Date().getFullYear()) return true;
        return "";
      });
      for (let i = 0; i < filteData.length; i++) {
        totalApplication += filteData[i].application;
        totalUser += filteData[i].user;
      }
      this.setState({
        bankApplication: totalApplication,
        activeUser: totalUser,
        totalShare: 30,
        totalcShare: 12
      });
      this.setState({ loader: "", month_year: "Year" });
    }
  };

  dashBoardData = async () => {
    this.setState({ loader: <Meedloader /> });
    try {
      const data = await dashBoard();
      if (data.success) {
        setDashboardData(data.data.statusHistory);
        const hisData = JSON.parse(getDashboardData());

        let filteData = hisData.filter(data => {
          if (
            data.year === new Date().getFullYear() &&
            data.month === new Date().getMonth() + 1
          )
            return true;
          return "";
        });
        this.setState({
          bankApplication: filteData[0].application,
          activeUser: filteData[0].user,
          totalShare: 10,
          totalcShare: 6
        });
        this.setState({ loader: "" });
      } else {
        console.log("somethis error occured");
      }
    } catch (error) {
      console.log(error);
    }
  };

  userLogoutHandler = () => {
    this.userLogout();
  };

  userLogout = async () => {
    const data = await logout();
    try {
      if (data.success) {
        clearStorage();
        this.setState({ loader: <Meedloader /> });
        this.props.history.push("/login");
      }
    } catch (error) {
      console.log(error);
    }
  };



  render() {
    return (
      <div>
        {this.state.loader}
        <React.Fragment>
          <Header userLogoutHandler={this.userLogoutHandler} />
          <Section>
            <Container fluid>
              <Level renderAs="nav">
                <Level.Side align="left">
                  <Level.Item>
                    <Heading
                      subtitle
                      size={4}
                      className="has-text-primary has-text-weight-bold"
                    >
                      MeedShare Summary: <em>This {this.state.month_year}</em>
                    </Heading>
                  </Level.Item>
                </Level.Side>

                <Level.Side align="right">
                  <Switch
                    groupSize={this.state.groupSize}
                    groupOptions={groupOptions}
                    toggle={this.monthYearToggle}
                  />
                </Level.Side>
              </Level>
              <hr />
            </Container>
          </Section>

          <Section>
            <Container fluid>
              <Tile kind="ancestor" className="has-averta-regular-font">
                <Tile size={4} vertical>
                  <Tile className="is-tile-row">

                    <Card subtitle={"subtitle is-2"} bodyClass={"has-background-grey-qua has-rounded-top-corners"} cardData={this.state.bankApplication}
                      cardText={"Bank Applications"} monthYear={"This " + this.state.month_year}
                      footerClass={"has-bottom-border has-background-blue-light has-rounded-bottom-corners is-bottom-color-box"} />

                    <Card subtitle={"subtitle is-2"} bodyClass={"has-background-grey-qua has-rounded-top-corners"} cardData={this.state.activeUser}
                      cardText={"Active Users"} monthYear={"This " + this.state.month_year}
                      footerClass={"has-bottom-border has-background-blue-light has-rounded-bottom-corners is-bottom-color-box"} />

                  </Tile>

                  <Tile className="is-tile-row">

                    <Card subtitle={"subtitle is-2"} bodyClass={"has-background-grey-qua has-rounded-top-corners"} cardData={"$516.26"}
                      cardText={"SocialBoost Income"} monthYear={"This " + this.state.month_year}
                      footerClass={"has-bottom-border has-background-green-bright has-rounded-bottom-corners is-bottom-color-box"} />

                    <Card subtitle={"subtitle is-2"} bodyClass={"has-background-grey-qua has-rounded-top-corners"} cardData={"2"}
                      cardText={"Shares Ranking"} monthYear={"This " + this.state.month_year}
                      footerClass={"has-bottom-border has-background-salmon has-rounded-bottom-corners is-bottom-color-box"} />

                  </Tile>
                </Tile>

                <Tile kind="parent" vertical>
                  <RadialBar share={this.state.totalShare} name={"of all Shares"} title={"Total Shares"} month_year={this.state.month_year} />
                </Tile>

                <Tile kind="parent" vertical>
                  <RadialBar share={this.state.totalcShare} name={"of all Corporate Shares"} title={"Total Corporate Shares"} month_year={this.state.month_year} />
                </Tile>
              </Tile>
            </Container>
          </Section>


          <Section>
            <Container fluid>
              <Level renderAs="nav">
                <Level.Side align="left">
                  <Level.Item>
                    <Heading
                      subtitle
                      size={4}
                      className="has-text-primary has-text-weight-bold"
                    >
                      MeedExtras Summary: <em>This {this.state.month_year}</em>
                    </Heading>
                  </Level.Item>
                </Level.Side>

                <Level.Side align="right">
                  <Switch
                    groupSize={this.state.groupSize}
                    groupOptions={groupOptions}
                    toggle={this.monthYearToggle}
                  />
                </Level.Side>
              </Level>
              <hr />
            </Container>
          </Section>

          <Section>
            <Container fluid>
              <Tile kind="ancestor" className="has-averta-regular-font">
                <Tile size={8} vertical>
                  <Tile className="is-tile-row">

                    <Tile kind="parent">
                      <Level.Side align="left">
                        <Level.Item>
                          <Heading
                            subtitle
                            size={6}
                            className="has-text-primary has-text-weight-bold">Purchase <br />Discounts
                          </Heading>
                        </Level.Item>
                      </Level.Side>
                    </Tile>

                    <Card subtitle={"subtitle is-2"} bodyClass={"has-background-grey-qua has-rounded-top-corners"} cardData={"$1,054"}
                      monthYear={"Saved This" + this.state.month_year}
                      footerClass={"has-bottom-border has-background-purple has-rounded-bottom-corners is-bottom-color-box"} />

                    <Card subtitle={"subtitle is-2"} bodyClass={"has-background-grey-qua has-rounded-top-corners"} cardData={"197"}
                      monthYear={"Shares Using Extras"}
                      footerClass={"has-bottom-border has-background-purple has-rounded-bottom-corners is-bottom-color-box"} />

                    <Card subtitle={"subtitle is-2"} bodyClass={"has-background-grey-qua has-rounded-top-corners"} cardData={"264"}
                      monthYear={"Purchases Made"}
                      footerClass={"has-bottom-border has-background-purple has-rounded-bottom-corners is-bottom-color-box"} />

                  </Tile>

                  <Tile size={9} className="is-tile-row">

                    <Tile kind="parent">
                      <Level.Side align="left">
                        <Level.Item>
                          <Heading
                            subtitle
                            size={6}
                            className="has-text-primary has-text-weight-bold">Payroll <br />Savings
                          </Heading>
                        </Level.Item>
                      </Level.Side>
                    </Tile>

                    <Card subtitle={"subtitle is-2"} bodyClass={"has-background-grey-qua has-rounded-top-corners"} cardData={"$2,250"}
                      monthYear={"Saved This" + this.state.month_year}
                      footerClass={"has-bottom-border has-background-blue-light has-rounded-bottom-corners is-bottom-color-box"} />

                    <Card subtitle={"subtitle is-2"} bodyClass={"has-background-grey-qua has-rounded-top-corners"} cardData={"225"}
                      monthYear={"Emplyess Enrolled"}
                      footerClass={"has-bottom-border has-background-blue-light has-rounded-bottom-corners is-bottom-color-box"} />

                  </Tile>

                  <Tile size={9} className="is-tile-row">

                    <Tile kind="parent">
                      <Level.Side align="left">
                        <Level.Item>
                          <Heading
                            subtitle
                            size={6}
                            className="has-text-primary has-text-weight-bold">Group Term <br />Live Savings
                          </Heading>
                        </Level.Item>
                      </Level.Side>
                    </Tile>

                    <Card subtitle={"subtitle is-2"} bodyClass={"has-background-grey-qua has-rounded-top-corners"} cardData={"$450"}
                      monthYear={"Saved This" + this.state.month_year}
                      footerClass={"has-bottom-border has-background-green-brighter has-rounded-bottom-corners is-bottom-color-box"} />

                    <Card subtitle={"subtitle is-2"} bodyClass={"has-background-grey-qua has-rounded-top-corners"} cardData={"225"}
                      monthYear={"Emplyess Enrolled"}
                      footerClass={"has-bottom-border has-background-green-brighter has-rounded-bottom-corners is-bottom-color-box"} />


                  </Tile>

                  <Tile size={9} className="is-tile-row">

                    <Tile kind="parent">
                      <Level.Side align="left">
                        <Level.Item>
                          <Heading
                            subtitle
                            size={6}
                            className="has-text-primary has-text-weight-bold">Total <br />
                          </Heading>
                        </Level.Item>
                      </Level.Side>
                    </Tile>

                    <Card subtitle={"subtitle is-2 has-subtitle-white"} bodyClass={"has-background-purple has-rounded-top-corners has-font-white"} cardData={"$2,700"}
                      monthYear={"Employer Savings This" + this.state.month_year}
                      footerClass={"has-bottom-border has-background-grey-qua has-rounded-bottom-corners is-bottom-color-box"} />

                    <Card subtitle={"subtitle is-2 has-subtitle-white"} bodyClass={"has-background-purple has-rounded-top-corners has-font-white"} cardData={"$1,054"}
                      monthYear={"Employee Savings This " + this.state.month_year}
                      footerClass={"has-bottom-border has-background-grey-qua has-rounded-bottom-corners is-bottom-color-box"} />


                  </Tile>

                </Tile>
              </Tile>
            </Container>
          </Section>


          <Section>
            <Container fluid>
              <Level renderAs="nav">
                <Level.Side align="left">
                  <Level.Item>
                    <Heading
                      subtitle
                      size={4}
                      className="has-text-primary has-text-weight-bold"
                    >
                      Employee Totals: <em>This {this.state.month_year}</em>
                    </Heading>
                  </Level.Item>
                </Level.Side>

                <Level.Side align="right">
                  <Switch
                    groupSize={this.state.groupSize}
                    groupOptions={groupOptions}
                    toggle={this.monthYearToggle}
                  />
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

                    <a onClick={this.applicationGraphClick}>
                      <Card subtitle={"subtitle is-2 has-subtitle-white"} bodyClass={this.state.applicationGraphBodyCss} cardData={"230"}
                        monthYear={"Bank Application"}
                        footerClass={this.state.applicationGraphFooterCss}
                      />
                    </a>
                    <a onClick={this.userGraphClick}>
                      <Card subtitle={"subtitle is-2 has-subtitle-white"} bodyClass={this.state.userGraphBodyCss} cardData={"311"}
                        monthYear={"Active Users (Shares)"}
                        footerClass={this.state.userGraphFooterCss}
                      />
                    </a>
                    <a onClick={this.incomeGraphClick}>
                      <Card subtitle={"subtitle is-2 has-subtitle-white"} bodyClass={this.state.incomeGraphBodyCss} cardData={"$4,321"}
                        monthYear={"MeedShare Income"}
                        footerClass={this.state.incomeGraphFooterCss}
                      />
                    </a>
                  </Tile>
                </Tile>
              </Tile>
            </Container>
          </Section>

          <Section>
            <Container fluid>
              <div className="graphArea">
                {
                  this.state.graphType == "bar" ?
                    <Line graphColor={this.state.graphColor} graphType={this.state.graphType} series={this.state.series} /> :
                    <Bar graphColor={this.state.graphColor} graphType={this.state.graphType} series={this.state.series} />
                }
              </div>
            </Container>
          </Section>
        </React.Fragment>
      </div>
    );
  }
}

export default Dashboard;
