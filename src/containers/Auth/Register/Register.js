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
import "./Register.scss";
import { Link } from "react-router-dom";
import { signUp } from "../../../apis/meed";

class Register extends React.Component {
	state = {
		email: "",
		password: "",
		repeatPassword: "",
		companyName: "",
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
			console.log("isFormValid");
			try {
				this.register(this.state);
			} catch (err) {
				console.log(err);
			}
		} else {
			console.log("Not isFormValid");
			this.setState({
				modalTitle: "Error ",
				modalMessage: "Information Invalid"
			});
			this.toggleModal();
		}
	};

	register = async ({ email, companyName, password, repeatPassword }) => {
		const params = {
			email: email,
			companyName: companyName,
			password: password,
			repeatPassword: repeatPassword
		};
		const data = await signUp(params);
		if (data.success) {
			this.props.history.push("/login");
		} else {
			this.setState({
				modalTitle: "Error",
				modalMessage: data.error[0].message
			});
			this.toggleModal();
			this.setState({ loader: " " });
		}
	};

	isFormValid = ({ email, companyName, password, repeatPassword }) =>
		email &&
		companyName &&
		password &&
		repeatPassword &&
		password === repeatPassword;

	render() {
		const { email, password, companyName, repeatPassword } = this.state;

		return (
			<div className="authBody">
				{this.state.loader}
				<Section>
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
										<p className="authHeader">Register Your Account</p>
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
															text="EMAIL"
														/>
													</Control>
												</Field>
											</Columns.Column>
											<Columns.Column size={6}>
												<Field>
													<Control>
														<Input
															name="companyName"
															change={this.handleChange}
															data={companyName}
															type="text"
															text="COMPANY NAME"
														/>
													</Control>
												</Field>
											</Columns.Column>
										</Columns>

										<Columns>
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
											<Columns.Column size={6}>
												<Field>
													<Control>
														<Input
															name="repeatPassword"
															change={this.handleChange}
															data={repeatPassword}
															type="password"
															text="REPEAT PASSWORD"
														/>
													</Control>
												</Field>
											</Columns.Column>
										</Columns>

										<Columns>

											<Columns.Column offset={9} size={3} >
												<Button className="authBtn">SUBMIT</Button>
											</Columns.Column>
										</Columns>
									</Columns.Column>
								</Columns>
								<Columns>
									<Columns.Column>
										<p className="joinNow">
											Already have a Corporate Account? <Link to="/login">LOGIN</Link>
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

export default Register;
