import React from "react";
import { Field, Control } from "react-bulma-components/lib/components/form";
import Button from "react-bulma-components/lib/components/button";
import Columns from "react-bulma-components/lib/components/columns";
import Container from "react-bulma-components/lib/components/container";
import Section from "react-bulma-components/lib/components/section";
import Modal from "../../../components/Modal/Modal";
import Separator from "../../../components/Separator/Seperator";
import Input from "../../../components/Input/Input";
import Logo from "../../../components/Logo/Logo";
import "./Login.scss";
import { Link } from "react-router-dom";
import { setIsLogin, set } from "../../../common/GlobalVars";
import { login } from "../../../apis/meed";
import uuidv4 from "uuid/v4";

class Login extends React.Component {
	state = {
		email: "testc1@yopmail.com",
		password: "o^V71Kai",
		modalState: false,
		modalTitle: "",
		modalMessage: "",
		loader: ""
	};

	/****** Modal work ******/
	toggleModal = this.toggleModal.bind(this);
	toggleModal() {
		this.setState((prev, props) => {
			const newState = !prev.modalState;

			return { modalState: newState };
		});
	}
	/****** Modal work End ******/

	handleChange = event => {
		this.setState({ [event.target.name]: event.target.value });
	};

	handleSubmit = event => {
		event.preventDefault();
		if (this.isFormValid(this.state)) {
			try {
				this.login(this.state);
			} catch (err) {
				console.log(err);
			}
		} else {
			this.setState({
				modalTitle: "Error",
				modalMessage: "Enter Valid Email/Password"
			});
			this.toggleModal();
		}
	};

	login = async ({ email, password }) => {
		const params = {
			email: email,
			password: password
		};
		set("deviceId", await uuidv4());
		const data = await login(params);
		if (data.success) {
			const { user } = data;
			set("userId", user);
			setIsLogin(true);
			this.props.history.push("/");
		} else {
			this.setState({
				modalTitle: "Error",
				modalMessage: data.error[0].message
			});
			this.toggleModal();
			this.setState({ loader: " " });
		}
	};

	isFormValid = ({ email, password }) => email && password;

	render() {
		const { email, password } = this.state;

		return (
			<div className="authBody">
				{this.state.loader}
				<Section >
					<Container fluid className="auth_container">
						<Logo meed_logo={"meed-logo1"} />
					</Container>
				</Section>

				<form onSubmit={this.handleSubmit}>
					<div>
						<Section>
							<Container fluid>
								<Columns>
									<Columns.Column>
										<p className="authHeader">
											Welcome to the Meed Corporate Member Dashboard
                    </p>
										<Separator />
									</Columns.Column>
								</Columns>
								<Columns>
									<Columns.Column size={6} offset={3}>
										<Columns>
											<Columns.Column size={6}>
												<Field>
													<Control>
														<Input
															name="email"
															change={this.handleChange}
															data={email}
															type="email"
															text="Email"
														/>
													</Control>
												</Field>
											</Columns.Column>
											<Columns.Column size={6}>
												<Field>
													<Control>
														<Input
															name="password"
															change={this.handleChange}
															data={password}
															type="password"
															text="Password"
														/>
													</Control>
												</Field>
											</Columns.Column>
										</Columns>

										<Columns>
											<Columns.Column size={9}>
												<div className="forgotPassword">
													Forgot <Link to="/forgot-password">Password</Link> ?
                        </div>
											</Columns.Column>
											<Columns.Column size={3} >
												<Button className="authBtn">LOGIN</Button>
											</Columns.Column>
										</Columns>
									</Columns.Column>
								</Columns>
								<Columns>
									<Columns.Column>
										<p className="joinNow">
											Don't have a Corporate Account? <Link to="/register">JOIN NOW!</Link>
										</p>
									</Columns.Column>
								</Columns>
							</Container>
						</Section>
					</div>
				</form>
				<Modal
					closeModal={this.toggleModal}
					modalState={this.state.modalState}
					title={this.state.modalTitle}
				>
					<p>{this.state.modalMessage}</p>
				</Modal>
			</div>
		);
	}
}

export default Login;
