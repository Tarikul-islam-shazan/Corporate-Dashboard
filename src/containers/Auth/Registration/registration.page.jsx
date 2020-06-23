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
import SuccessMessage from "../../../components/Modal/SuccessModalMessage";
import "./registration.scss";
import { Link } from "react-router-dom";
import { signUp } from "../../../apis/meed";
import ErrorBoundary from "../../../hoc/errorBoundary";

class Registration extends React.Component {
  state = {
    email: "",
    password: "",
    repeatPassword: "",
    companyName: "",
    modalState: false,
    modalTitle: "",
    modalMessage: "",
    loader: "",
    backdrop: true,
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

  handleChange = (event) => {
    this.setState({ [event.target.name]: event.target.value });
  };

  handleSubmit = (event) => {
    event.preventDefault();
    if (this.isFormValid(this.state)) {
      try {
        this.register(this.state);
      } catch (err) {
        console.log(err);
      }
    } else {
      this.setState({
        modalTitle: "Error ",
        modalMessage: "Information Invalid",
      });
      this.toggleModal();
    }
  };

  register = async ({ email, companyName, password, repeatPassword }) => {
    const params = {
      email: email,
      companyName: companyName,
      password: password,
      repeatPassword: repeatPassword,
    };
    const data = await signUp(params);
    if (data) {
      if (data.success) {
        this.setState({
          modalTitle: "Info!",
          backdrop: false,
          modalMessage: (
            <SuccessMessage message="An email has been sent to the User with a verification code" link="/verification" payload={data.data} />
          ),
        });
        this.toggleModal();
        this.setState({ loader: " " });
      } else {
        this.setState({
          modalTitle: "Error",
          modalMessage: data.error[0].message,
        });
        this.toggleModal();
        this.setState({ loader: " " });
      }
    } else {
      this.setState({
        modalTitle: "Error",
        modalMessage: "Internal Error Occured!!",
      });
      this.toggleModal();
    }
  };

  isFormValid = ({ email, companyName, password, repeatPassword }) => email.trim() && companyName.trim() && password.trim() && repeatPassword.trim();

  render() {
    const { email, password, companyName, repeatPassword } = this.state;

    return (
      <ErrorBoundary>
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
                              <Input name="email" change={this.handleChange} data={email} type="email" text="EMAIL" />
                            </Control>
                          </Field>
                        </Columns.Column>
                        <Columns.Column size={6}>
                          <Field>
                            <Control>
                              <Input name="companyName" change={this.handleChange} data={companyName} type="text" text="COMPANY NAME" />
                            </Control>
                          </Field>
                        </Columns.Column>
                      </Columns>

                      <Columns>
                        <Columns.Column size={6}>
                          <Field>
                            <Control>
                              <Input name="password" change={this.handleChange} data={password} type="password" text="Password" />
                            </Control>
                          </Field>
                        </Columns.Column>
                        <Columns.Column size={6}>
                          <Field>
                            <Control>
                              <Input name="repeatPassword" change={this.handleChange} data={repeatPassword} type="password" text="REPEAT PASSWORD" />
                            </Control>
                          </Field>
                        </Columns.Column>
                      </Columns>

                      <Columns>
                        <Columns.Column offset={9} size={3}>
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
          <Modal closeModal={this.toggleModal} modalState={this.state.modalState} title={this.state.modalTitle} backdrop={this.state.backdrop}>
            <p>{this.state.modalMessage}</p>
          </Modal>
        </div>
      </ErrorBoundary>
    );
  }
}

export default Registration;
