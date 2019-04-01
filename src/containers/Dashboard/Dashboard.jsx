import React from "react";
import Heading from "react-bulma-components/lib/components/heading";
import Section from "react-bulma-components/lib/components/section";
import Container from "react-bulma-components/lib/components/container";
import Level from "react-bulma-components/lib/components/level";
import Tile from "react-bulma-components/lib/components/tile";
import MeedLoader from "../../components/MeedLoader/MeedLoader";
import Switch from "../../components/Switch/Switch";
import Header from "../../components/Header/Header";
import RadialBar from "../../components/Charts/RadialBar/RadialBar";
import Bar from "../../components/Charts/Bar/Bar";
import Line from "../../components/Charts/Line/Line";
import Card from "../../components/Card/Card";
import { clearStorage, setDashboardData, getDashboardData } from "../../common/GlobalVars";
import { logout, dashBoard } from "../../apis/meed";
import './Dashboard.scss';

/****toggle work****/
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

const groupOptions_employee_total = [
	{
		displayName: "Month",
		value: 1
	},
	{
		displayName: "Year",
		value: 2
	}
];
/****End of toggle work****/

class Dashboard extends React.Component {
	state = {
		bankApplication: 0,
		bankApplication2: 0,
		activeUser: 0,
		activeUser2: 0,
		socialBoostIncome: 0,
		socialBoostIncome2: 0,
		totalShare: 0,
		totalcShare: 0,
		mShare: 0,
		mCshare: 0,
		loader: "",
		groupSize: 1,
		groupSize_employee_total: 1,
		month_year: "Month",
		month_year3: "Month",
		applicationGraphData: [],
		userGraphData: [],
		incomeGraphData: [],
		applicationGraph: false,
		userGraph: false,
		incomeGraph: false,
		applicationGraphBodyCss: 'has-card-opacity has-background-salmon has-rounded-top-corners has-font-white',
		userGraphBodyCss: 'has-card-opacity has-background-blue-light has-rounded-top-corners has-font-white',
		incomeGraphBodyCss: 'has-card-opacity has-background-green-brighter has-rounded-top-corners has-font-white',
		applicationGraphFooterCss: 'has-card-opacity has-bottom-border has-background-salmon has-rounded-bottom-corners is-bottom-color-box',
		userGraphFooterCss: 'has-card-opacity has-bottom-border has-background-blue-light has-rounded-bottom-corners is-bottom-color-box',
		incomeGraphFooterCss: 'has-card-opacity has-bottom-border has-background-green-brighter has-rounded-bottom-corners is-bottom-color-box',
		graphColor: ["#FF925D"],
		series: [{ name: ' ', data: [] }],
		graphType: "bar",
		legend: true

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

				let filteData = hisData.filter(data => {
					if (
						data.year === new Date().getFullYear() &&
						data.month === new Date().getMonth() + 1 &&
						data.country === "USA"
					)
						return true;
					return "";
				});
				if (!filteData.length) {
					filteData = [{
						application: 0,
						country: 0,
						income: 0,
						minviter: 0,
						month: 0,
						requests: 0,
						user: 0,
						year: 0
					}];
				}
				let inviter = filteData[0].minviter ? filteData[0].minviter : 0;
				let tshare = filteData[0].tshare ? filteData[0].tshare : 0;
				let tcshare = filteData[0].tcshare ? filteData[0].tcshare : 0;

				let mshare = tshare !== 0 ? ((inviter * 100) / tshare) : 0;
				let mcshare = tcshare !== 0 ? ((inviter * 100) / tcshare) : 0;

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
					totalShare: filteData[0].tshare ? filteData[0].tshare : 0,
					totalcShare: filteData[0].tcshare ? filteData[0].tcshare : 0,
					mShare: mshare.toFixed(2),
					mCshare: mcshare.toFixed(2),
					applicationGraphData: applicationData,
					userGraphData: userData,
					incomeGraphData: incomeData,
					bankApplication2: filteData[0].application ? filteData[0].application : 0,
					activeUser2: filteData[0].user ? filteData[0].user : 0,
					socialBoostIncome2: filteData[0].income ? filteData[0].income.toFixed(2) : 0,
				});
				this.setState({ loader: "" });
			} else {
				console.log("somethis error occured");
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
						name: "Bank Application",
						data: this.state.applicationGraphData
					},
					{
						name: "Active User",
						data: this.state.userGraphData
					}
				]
			});
		}
		else if (this.state.applicationGraph) {
			await this.setState({
				series: [
					{
						name: "Bank Application",
						data: this.state.applicationGraphData
					},
					{
						name: '',
						data: []
					}
				]
			})
		}
		else if (this.state.userGraph) {
			this.setState({
				series: [
					{
						name: '',
						data: []
					},
					{
						name: "Active User",
						data: this.state.userGraphData
					}
				]
			});
		}
		else if (this.state.incomeGraph) {
			this.setState({
				series: [
					{
						name: "MeedShare Income",
						data: this.state.incomeGraphData
					}
				]
			});
		}
		else {
			this.setState({
				series: [
					{
						name: " ",
						data: new Array(12).fill(null)
					}
				]
			});
		}
	}


	application_user_graph = async () => {
		if (this.state.applicationGraph && this.state.userGraph) {
			this.setState({
				series: [
					{
						name: "Bank Application",
						data: this.state.applicationGraphData
					},
					{
						name: "Active User",
						data: this.state.userGraphData
					}
				],
				graphType: "line",
				legend: true,
				graphColor: ["#FF925D", "#53C9FF"],
				applicationGraphBodyCss: "has-background-salmon has-rounded-top-corners has-font-white",
				applicationGraphFooterCss: "has-bottom-border has-background-salmon has-rounded-bottom-corners is-bottom-color-box",
				userGraphBodyCss: "has-background-blue-light has-rounded-top-corners has-font-white",
				userGraphFooterCss: "has-bottom-border has-background-blue-light has-rounded-bottom-corners is-bottom-color-box",
			})
		}
		else if (this.state.applicationGraph) {

			this.setState({
				series: [
					{
						name: "Bank Application",
						data: this.state.applicationGraphData
					},
					{
						name: " ",
						data: []
					}
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
			})
		}
		else if (this.state.userGraph) {

			this.setState({
				series: [
					{
						name: '',
						data: []
					},
					{
						name: "Active User",
						data: this.state.userGraphData
					}
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
			})
		} else {
			this.setState({
				series: [
					{
						name: " ",
						data: new Array(12).fill(null)
					}
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
			})
		}

	}

	income_graph = () => {
		if (this.state.incomeGraph) {

			this.setState({
				series: [
					{
						name: "MeedShare Income",
						data: this.state.incomeGraphData
					}
				],
				graphType: "bar",
				legend: true,
				graphColor: ["#1DD090"],
				applicationGraphBodyCss: "has-card-opacity has-background-salmon has-rounded-top-corners has-font-white",
				applicationGraphFooterCss: "has-card-opacity has-bottom-border has-background-salmon has-rounded-bottom-corners is-bottom-color-box",
				userGraphBodyCss: "has-card-opacity has-card-opacity has-background-blue-light has-rounded-top-corners has-font-white",
				userGraphFooterCss: "has-card-opacity has-card-opacity has-bottom-border has-background-blue-light has-rounded-bottom-corners is-bottom-color-box",
				incomeGraphBodyCss: "has-background-green-brighter has-rounded-top-corners has-font-white",
				incomeGraphFooterCss: "has-bottom-border has-background-green-brighter has-rounded-bottom-corners is-bottom-color-box",
			})
		} else {
			this.setState({
				series: [
					{
						name: " ",
						data: new Array(12).fill(null)
					}
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
			})
		}
	}

	/** Employee Totals 3 card click events */

	applicationGraphClick = async () => {
		await this.setState({ applicationGraph: !this.state.applicationGraph });
		await this.setState({ incomeGraph: false });
		await this.application_user_graph();
	}

	userGraphClick = async () => {
		await this.setState({ userGraph: !this.state.userGraph });
		await this.setState({ incomeGraph: false });
		await this.application_user_graph();
	}

	incomeGraphClick = async () => {
		await this.setState({ incomeGraph: !this.state.incomeGraph });
		await this.setState({ applicationGraph: false });
		await this.setState({ userGraph: false });
		await this.income_graph();
	}
	/** End of Employee Totals 3 card click events */

	/** Month to Year toggle event 1 **/

	monthYearToggle = value => {
		this.setState({ groupSize: value });
		this.setState({ loader: <MeedLoader /> });
		let totalApplication = 0;
		let totalUser = 0;
		let totalIncome = 0;
		let totalshare = 0;
		let totalcshare = 0;
		let totalInviter = 0;
		const hisData = JSON.parse(getDashboardData());
		if (value === 1) {
			let filteData = hisData.filter(data => {
				if (
					data.year === new Date().getFullYear() &&
					data.month === new Date().getMonth() + 1 &&
					data.country === "USA"
				)
					return true;
				return "";
			});

			if (!filteData.length) {
				filteData = [{
					application: 0,
					country: 0,
					income: 0,
					minviter: 0,
					month: 0,
					requests: 0,
					user: 0,
					year: 0
				}];
			}

			let inviter = filteData[0].minviter ? filteData[0].minviter : 0;
			let tshare = filteData[0].tshare ? filteData[0].tshare : 0;
			let tcshare = filteData[0].tcshare ? filteData[0].tcshare : 0;

			let mshare = tshare !== 0 ? ((inviter * 100) / tshare) : 0;
			let mcshare = tcshare !== 0 ? ((inviter * 100) / tcshare) : 0;

			this.setState({
				bankApplication: filteData[0].application ? filteData[0].application : 0,
				activeUser: filteData[0].user ? filteData[0].user : 0,
				socialBoostIncome: filteData[0].income ? filteData[0].income.toFixed(2) : 0,
				totalShare: filteData[0].tshare ? filteData[0].tshare : 0,
				totalcShare: filteData[0].tcshare ? filteData[0].tcshare : 0,
				mShare: mshare.toFixed(2),
				mCshare: mcshare.toFixed(2)
			});
			this.setState({ loader: "", month_year: "Month" });
		} else if (value === 2) {
			let filteData = hisData.filter(data => {
				if (
					data.year === new Date().getFullYear() &&
					data.country === "USA"
				) return true;
				return "";
			});

			if (!filteData.length) {
				filteData = [{
					application: 0,
					country: 0,
					income: 0,
					minviter: 0,
					month: 0,
					requests: 0,
					user: 0,
					year: 0
				}];
			}

			for (let i = 0; i < filteData.length; i++) {
				totalApplication += filteData[i].application ? filteData[i].application : 0;
				totalUser += filteData[i].user ? filteData[i].user : 0;
				totalshare += filteData[i].tshare ? filteData[i].tshare : 0;
				totalcshare += filteData[i].tcshare ? filteData[i].tcshare : 0;
				totalIncome += filteData[i].income ? filteData[i].income : 0;
				totalInviter += filteData[i].minviter ? filteData[i].minviter : 0;
			}

			let mshare = totalshare !== 0 ? ((totalInviter * 100) / totalshare) : 0;
			let mcshare = totalcshare !== 0 ? ((totalInviter * 100) / totalcshare) : 0;


			this.setState({
				bankApplication: totalApplication,
				activeUser: totalUser,
				socialBoostIncome: totalIncome.toFixed(2),
				totalShare: totalshare,
				totalCShare: totalcshare,
				mShare: mshare.toFixed(2),
				mCshare: mcshare.toFixed(2)
			});
			this.setState({ loader: "", month_year: "Year" });
		}
	};

	/** End of Month to Year toggle event 1*/
	/** Month to Year toggle event 2*/
	monthYearToggle_employee_total = async (value) => {
		let totalApplication = 0;
		let totalUser = 0;
		let totalIncome = 0;
		let applicationData = new Array(12).fill(null);
		let userData = new Array(12).fill(null);
		let incomeData = new Array(12).fill(null);
		this.setState({ groupSize_employee_total: value });
		this.setState({ loader: <MeedLoader /> });
		const hisData = JSON.parse(getDashboardData());
		if (value === 1) {
			let filteData = hisData.filter(data => {
				if (
					data.year === new Date().getFullYear() &&
					data.month === new Date().getMonth() + 1 &&
					data.country === "USA"
				)
					return true;
				return "";
			});
			if (!filteData.length) {
				filteData = [{
					application: 0,
					country: 0,
					income: 0,
					minviter: 0,
					month: 0,
					requests: 0,
					user: 0,
					year: 0
				}];
			}

			for (let i = 0; i < 12; i++) {
				if (filteData.length) {
					if (filteData[i]) {
						applicationData[filteData[i].month - 1] = filteData[i].application ? filteData[i].application : null;
						userData[filteData[i].month - 1] = filteData[i].user ? filteData[i].user : null;
						incomeData[filteData[i].month - 1] = filteData[i].income ? filteData[i].income.toFixed(2) : null;
					}
				}
				else {
					applicationData = new Array(12).fill(null);
					userData = new Array(12).fill(null);
					incomeData = new Array(12).fill(null);
				}
			}
			await this.setState({
				applicationGraphData: applicationData,
				userGraphData: userData,
				incomeGraphData: incomeData,
				bankApplication2: filteData[0].application ? filteData[0].application : 0,
				activeUser2: filteData[0].user ? filteData[0].user : 0,
				socialBoostIncome2: filteData[0].income ? filteData[0].income.toFixed(2) : 0,
			});
			this.setState({ loader: "", month_year3: "Month" });

		} else if (value === 2) {
			let filteData = hisData.filter(data => {
				if (
					data.year === new Date().getFullYear() &&
					data.country === "USA"
				) return true;
				return "";
			});

			if (!filteData.length) {
				filteData = [{
					application: 0,
					country: 0,
					income: 0,
					minviter: 0,
					month: 0,
					requests: 0,
					user: 0,
					year: 0
				}];
			}

			for (let i = 0; i < filteData.length; i++) {
				totalApplication += filteData[i].application ? filteData[i].application : 0;
				totalUser += filteData[i].user ? filteData[i].user : 0;
				totalIncome += filteData[i].income ? filteData[i].income : 0;
			}

			for (let i = 0; i < 12; i++) {

				if (filteData.length) {

					if (filteData[i]) {
						applicationData[filteData[i].month - 1] = filteData[i].application ? filteData[i].application : null;
						userData[filteData[i].month - 1] = filteData[i].user ? filteData[i].user : null;
						incomeData[filteData[i].month - 1] = filteData[i].income ? filteData[i].income.toFixed(2) : null;
					}
				}
				else {
					applicationData = new Array(12).fill(null);
					userData = new Array(12).fill(null);
					incomeData = new Array(12).fill(null);
				}
			}
			await this.setState({
				applicationGraphData: applicationData,
				userGraphData: userData,
				incomeGraphData: incomeData,
				bankApplication2: totalApplication,
				activeUser2: totalUser,
				socialBoostIncome2: totalIncome.toFixed(2),
			});
			this.setState({ loader: "", month_year3: "Year" });

		}
		await this.graphSeries();
	};

	/** End of Month to Year toggle event 2*/

	/** Logout event work */
	userLogoutHandler = () => {
		this.userLogout();
	};

	userLogout = async () => {
		const data = await logout();
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

										<Card
											subtitle={"subtitle is-2"}
											bodyClass={"has-background-grey-qua has-rounded-top-corners"}
											cardData={this.state.bankApplication}
											cardText={"Bank Applications"}
											monthYear={"This " + this.state.month_year}
											footerClass={"has-bottom-border has-background-blue-light has-rounded-bottom-corners is-bottom-color-box"}
										/>

										<Card
											subtitle={"subtitle is-2"}
											bodyClass={"has-background-grey-qua has-rounded-top-corners"}
											cardData={this.state.activeUser}
											cardText={"Active Users"}
											monthYear={"This " + this.state.month_year}
											footerClass={"has-bottom-border has-background-blue-light has-rounded-bottom-corners is-bottom-color-box"}
										/>

									</Tile>

									<Tile size={6} className="is-tile-row">

										<Card
											subtitle={"subtitle is-2"}
											bodyClass={"has-background-grey-qua has-rounded-top-corners"}
											cardData={this.state.socialBoostIncome}
											cardText={"SocialBoost Income"}
											monthYear={"This " + this.state.month_year}
											footerClass={"has-bottom-border has-background-green-bright has-rounded-bottom-corners is-bottom-color-box"}
										/>

									</Tile>
								</Tile>

								<Tile kind="parent" vertical>
									<RadialBar
										share={this.state.mShare}
										allShare={this.state.totalShare}
										name={"of all Shares"}
										title={"Total Shares"}
										month_year={this.state.month_year}
									/>
								</Tile>

								<Tile kind="parent" vertical>
									<RadialBar
										share={this.state.mCshare}
										allShare={this.state.totalcShare}
										name={"of all Corporate Shares"}
										title={"Total Corporate Shares"}
										month_year={this.state.month_year}
									/>
								</Tile>
							</Tile>
						</Container>
					</Section>

					{/*
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
          </Section> */}


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
											Employee Totals: <em>This {this.state.month_year3}</em>
										</Heading>
									</Level.Item>
								</Level.Side>

								<Level.Side align="right">
									<Switch
										groupSize={this.state.groupSize_employee_total}
										groupOptions={groupOptions_employee_total}
										toggle={this.monthYearToggle_employee_total}
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

										<div className="card-button" onClick={this.applicationGraphClick}>
											<Card
												subtitle={"subtitle is-2 has-subtitle-white"}
												bodyClass={this.state.applicationGraphBodyCss}
												cardData={this.state.bankApplication2}
												monthYear={"Bank Application"}
												footerClass={this.state.applicationGraphFooterCss}
											/>
										</div>
										<div className="card-button" onClick={this.userGraphClick}>
											<Card
												subtitle={"subtitle is-2 has-subtitle-white"}
												bodyClass={this.state.userGraphBodyCss}
												cardData={this.state.activeUser2}
												monthYear={"Active Users (Shares)"}
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
								{
									this.state.graphType === "line" ?
										<Line
											series={this.state.series}
											legend={this.state.legend}
											graphColor={this.state.graphColor}
											graphType={this.state.graphType}
										/>
										:
										<Bar
											series={this.state.series}
											graphColor={this.state.graphColor}
											graphType={this.state.graphType}
										/>
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
