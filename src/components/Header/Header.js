import React from "react";

import Heading from "react-bulma-components/lib/components/heading";
import Section from "react-bulma-components/lib/components/section";
import Container from "react-bulma-components/lib/components/container";
import Navbar from "react-bulma-components/lib/components/navbar";
import Button from "react-bulma-components/lib/components/button";
import './Header.scss';

import   Logo  from "../../components/Logo/Logo";

class Header extends React.Component {
  state = {
    signedIn: true,
    open: "true"
  };

  handleLogout = () => {
    this.props.userLogoutHandler();
  };

  render() {
    const open = this.state.open;
    return (
      <React.Fragment>
        <Section className="has-background-primary">
          <Container fluid>
            <Navbar color="primary" active="{open}" >
              <Navbar.Brand>
                <Navbar.Item renderAs="a" href="#">
                  <Logo meed_logo={"meed-logo"} />
                </Navbar.Item>
                {/* <Navbar.Burger
                  active={open}
                  onClick={() =>
                    this.setState({ open: !open })
                  }
                /> */}
              </Navbar.Brand>
              <Navbar.Menu active={open}>
                <Navbar.Container>
                  <Navbar.Item renderAs="div">
                    <Heading size={1} className="is-uppercase has-text-white">
                      Corporate Member Dashboard
                </Heading>
                  </Navbar.Item>
                </Navbar.Container>
                <Navbar.Container position="end">
                  <Navbar.Item>
                    <Button     className='Header__logoutBtn' onClick={this.handleLogout}>Logout</Button>
                  </Navbar.Item>
                </Navbar.Container>
              </Navbar.Menu>
            </Navbar>
          </Container>
        </Section>

        <Section className="has-background-light">
          <Container fluid>
            <Heading size={2} className="has-text-primary">
              Joe Cooper Auto Group
            </Heading>
            <Heading
              subtitle
              size={6}
              className="has-text-primary has-averta-bold-font"
            >
              Program active Since March 25, 2019
            </Heading>
          </Container>
        </Section>
      </React.Fragment>
    );
  }
}

export default Header;
