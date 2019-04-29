import React from "react";

import Heading from "react-bulma-components/lib/components/heading";
import Section from "react-bulma-components/lib/components/section";
import Container from "react-bulma-components/lib/components/container";
import Navbar from "react-bulma-components/lib/components/navbar";
import Button from "react-bulma-components/lib/components/button";
import './Header.scss';
import { get } from "../../common/GlobalVars";

import Logo from "../Logo/Logo";

class Header extends React.Component {
	state = {
		signedIn: true,
		open: "true"
	};

	handleLogout = () => {
		this.props.userLogoutHandler();
	};

	render() {
		let date = new Date(get('createdDate'));
		const monthNames = ["January", "February", "March", "April", "May", "June",
			"July", "August", "September", "October", "November", "December"
		];

		return (
			<React.Fragment>
				<Section className="has-background-primary header_section-padding">
					<Container fluid className="header_container">
						<Navbar color="primary"  >{/* active={open} */}
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
							{/* <Navbar.Menu active={open}> */}
							<Navbar.Container position="end">
								<Navbar.Item renderAs="div" >
									<Heading size={2} className="is-uppercase has-text-white ">
										Corporate Member Dashboard
                </Heading>
								</Navbar.Item>
							</Navbar.Container>
							<Navbar.Container position="end">
								<Navbar.Item>
									<Button className='Header__logoutBtn' onClick={this.handleLogout}>Logout</Button>
								</Navbar.Item>
							</Navbar.Container>
							{/* </Navbar.Menu> */}
						</Navbar>
					</Container>
				</Section>

				<Section className="has-background-light header_section-padding2">
					<Container fluid className="header_container">
						<Heading size={2} className="has-text-primary">
							{get('companyName')}
						</Heading>
						<Heading
							subtitle
							size={6}
							className="has-text-primary has-averta-bold-font"
						>
							Program active Since {monthNames[date.getMonth()]} {date.getDate()}, {date.getFullYear()}
						</Heading>
					</Container>
				</Section>
			</React.Fragment>
		);
	}
}

export default Header;
