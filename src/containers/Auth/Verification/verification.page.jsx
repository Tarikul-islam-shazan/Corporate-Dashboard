import React from 'react';
import { Field, Control } from 'react-bulma-components/lib/components/form';
import Button from 'react-bulma-components/lib/components/button';
import Columns from 'react-bulma-components/lib/components/columns';
import Container from 'react-bulma-components/lib/components/container';
import Section from 'react-bulma-components/lib/components/section';
import Modal from '../../../components/Modal/Modal';
import Separator from '../../../components/Separator/Seperator';
import Input from '../../../components/Input/Input';
import Logo from '../../../components/Logo/Logo';
import './verification.page.scss';
import ErrorBoundary from '../../../hoc/error';
import SuccessMessage from '../../../components/Modal/SuccessModalMessage';
import { verification } from '../../../apis/meed';

class Verification extends React.Component {
  state = {
    email: '',
    verificationCode: '',
    modalState: false,
    modalTitle: '',
    modalMessage: '',
    loader: '',
    backdrop: true,
  };

  componentDidMount() {
    this.setEmail();
  }

  setEmail = async () => {
    const email = this.props.location.state.userEmail;
    await this.setState({
      email: email,
    });
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
        this.checkVerificationCode(this.state);
      } catch (err) {
        console.log(err);
      }
    } else {
    }
  };

  checkVerificationCode = async ({ email, verificationCode }) => {
    const params = {
      email,
      verificationCode,
    };
    const data = await verification(params);
    if (data) {
      if (data.success) {
        this.setState({
          modalTitle: 'Congratulation!',
          backdrop: false,
          modalMessage: <SuccessMessage message='You successfully completed the registration process' link='/login' />,
        });
        this.toggleModal();
        this.setState({ loader: ' ' });
      } else {
        this.setState({
          modalTitle: 'Error',
          modalMessage: data.error[0].message,
        });
        this.toggleModal();
        this.setState({ loader: ' ' });
      }
    } else {
      this.setState({
        modalTitle: 'Error',
        modalMessage: 'Internal Error Occured!!',
      });
      this.toggleModal();
    }
  };

  isFormValid = ({ email, verificationCode }) => email.trim() && verificationCode;

  render() {
    const { verificationCode } = this.state;
    return (
      <ErrorBoundary>
        <div className='authBody'>
          {this.state.loader}
          <Section>
            <Container fluid className='auth_container'>
              <Logo meed_logo={'meed-logo1'} />
            </Container>
          </Section>

          <form onSubmit={this.handleSubmit}>
            <div>
              <Section>
                <Container fluid>
                  <Columns>
                    <Columns.Column>
                      <p className='authHeader'>Verification</p>
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
                                name='verificationCode'
                                change={this.handleChange}
                                data={verificationCode}
                                type='tel'
                                text='Verification code'
                                minLength='6'
                                maxLength='6'
                              />
                            </Control>
                          </Field>
                        </Columns.Column>
                      </Columns>
                      <Columns>
                        <Columns.Column size={4} offset={4}>
                          <Button className='authBtn'>SUBMIT</Button>
                        </Columns.Column>
                      </Columns>
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

export default Verification;
