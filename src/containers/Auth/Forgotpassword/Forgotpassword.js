import React from "react";
import { Field, Control } from "react-bulma-components/lib/components/form";
import Button from "react-bulma-components/lib/components/button";
import Columns from "react-bulma-components/lib/components/columns";
import Container from "react-bulma-components/lib/components/container";
import Section from "react-bulma-components/lib/components/section";
import Separator from "../../../components/Separator/Seperator";
import Input from "../../../components/Input/Input";
import Logo from "../../../components/Logo/Logo";
import "./Forgotpassword.scss";
import { forgotPassword } from "../../../apis/meed";

class Forgotpassword extends React.Component {
    state = {
        email: "testc1@yopmail.com",
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
            this.forgotPassword(this.state);
          } catch (err) {
            console.log(err);
          }
        } else {
          
          
        }
      };
    
      forgotPassword = async ({email}) => {
        const params = {
          email: email,
        };
        const data = await forgotPassword(params);
        if (data.success) {
          this.props.history.push("/login");
        } else {
          this.setState({ modalTitle: 'Error', modalMessage: data.error[0].message })
          this.toggleModal();
          this.setState({loader: " " })
        }
      };
    
      isFormValid = ({ email }) => email;

    render() {
        const { email } = this.state;

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
                                        <p className="authHeader">
                                            Forgot Password
                    </p>
                                        <Separator />
                                    </Columns.Column>
                                </Columns>
                                <Columns>
                                    <Columns.Column size={4} offset={4}>
                                        <Columns>
                                            <Columns.Column offset={1} size={10}>
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
                                        </Columns>
                                        <Columns>
                                            <Columns.Column size={4} offset={4}>
                                                <Button className="authBtn">SUBMIT</Button>
                                            </Columns.Column>
                                        </Columns>
                                    </Columns.Column>
                                </Columns>
                            </Container>
                        </Section>
                    </div>
                </form>
            </div>
        );
    }
}

export default Forgotpassword;
