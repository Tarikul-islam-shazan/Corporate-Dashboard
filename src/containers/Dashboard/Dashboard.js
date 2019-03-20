import React from "react";

import Heading from "react-bulma-components/lib/components/heading";
import Section from "react-bulma-components/lib/components/section";
import Container from "react-bulma-components/lib/components/container";
// import Navbar from "react-bulma-components/lib/components/navbar";
import Level from "react-bulma-components/lib/components/level";
import Tile from "react-bulma-components/lib/components/tile";
import Meedloader from "../../components/Meedloader/Meedloader";
import Switch from "../../components/Switch/Switch";
import Header from "../../components/Header/Header";
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
    loader: "",
    groupSize: 1,
    month_year: "Month"
  };

  componentDidMount() {
    try {
      this.dashBoardData();
    } catch (err) {
      console.log(err);
    }
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
        activeUser: filteData[0].user
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
        activeUser: totalUser
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
          activeUser: filteData[0].user
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
                    <Tile kind="parent">
                      <Tile renderAs="article" kind="child">
                        <Tile
                          vertical
                          className="has-background-grey-qua has-rounded-top-corners"
                        >
                          <p className="subtitle is-2">
                            {this.state.bankApplication}
                          </p>
                          <p>
                            <strong>Bank Applications</strong>
                          </p>
                          <p>This {this.state.month_year}</p>
                        </Tile>
                        <Tile className="has-bottom-border has-background-blue-light has-rounded-bottom-corners is-bottom-color-box" />
                      </Tile>
                    </Tile>

                    <Tile kind="parent">
                      <Tile renderAs="article" kind="child">
                        <Tile
                          vertical
                          className="has-background-grey-qua has-rounded-top-corners"
                        >
                          <p className="subtitle is-2">
                            {this.state.activeUser}
                          </p>
                          <p>
                            <strong>Active Users</strong>
                          </p>
                          <p>This {this.state.month_year}</p>
                        </Tile>
                        <Tile className="has-bottom-border has-background-blue-light has-rounded-bottom-corners is-bottom-color-box" />
                      </Tile>
                    </Tile>
                  </Tile>

                  <Tile className="is-tile-row">
                    <Tile kind="parent">
                      <Tile renderAs="article" kind="child">
                        <Tile
                          vertical
                          className="has-background-grey-qua has-rounded-top-corners"
                        >
                          <p className="subtitle is-2">$516.26</p>
                          <p>
                            <strong>SocialBoost Income</strong>
                          </p>
                          <p>This {this.state.month_year}</p>
                        </Tile>
                        <Tile className="has-bottom-border has-background-green-bright has-rounded-bottom-corners is-bottom-color-box" />
                      </Tile>
                    </Tile>

                    <Tile kind="parent">
                      <Tile renderAs="article" kind="child">
                        <Tile
                          vertical
                          className="has-background-grey-qua has-rounded-top-corners"
                        >
                          <p className="subtitle is-2">2</p>
                          <p>
                            <strong>Shares Ranking</strong>
                          </p>
                          <p>This {this.state.month_year}</p>
                        </Tile>
                        <Tile className="has-bottom-border has-background-salmon has-rounded-bottom-corners is-bottom-color-box" />
                      </Tile>
                    </Tile>
                  </Tile>
                </Tile>

                <Tile kind="parent" vertical>
                  <Tile
                    renderAs="article"
                    kind="child"
                    className="is-circle has-tile-text-centered"
                  >
                    <Tile>
                      <Tile vertical>
                        <Heading subtitle className="is-display">
                          3%
                        </Heading>
                        <p>
                          <strong>Shares Ranking</strong>
                        </p>
                        <p>This {this.state.month_year}</p>
                      </Tile>
                    </Tile>
                  </Tile>

                  <Tile
                    renderAs="article"
                    kind="child"
                    className="has-tile-text-centered"
                  >
                    <Heading subtitle size={4}>
                      Total Shares: 2,100
                    </Heading>
                  </Tile>
                </Tile>

                <Tile kind="parent" vertical>
                  <Tile
                    renderAs="article"
                    kind="child"
                    className="is-circle has-tile-text-centered"
                  >
                    <Tile>
                      <Tile vertical>
                        <Heading subtitle className="is-display">
                          6%
                        </Heading>
                        <p>
                          <strong>Shares Ranking</strong>
                        </p>
                        <p>This {this.state.month_year}</p>
                      </Tile>
                    </Tile>
                  </Tile>

                  <Tile
                    renderAs="article"
                    kind="child"
                    className="has-tile-text-centered"
                  >
                    <Heading subtitle size={4}>
                      Total Corporate Shares: 1,050
                    </Heading>
                  </Tile>
                </Tile>
              </Tile>
            </Container>
          </Section>
        </React.Fragment>
      </div>
    );
  }
}

export default Dashboard;
