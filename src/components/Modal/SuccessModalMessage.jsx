import React from "react";
import { Link } from "react-router-dom";
import Button from "react-bulma-components/lib/components/button";
import "./Modal.scss";
const SuccessMessage = props => {
	return (
		<React.Fragment>
			<React.Fragment>{props.message}</React.Fragment>
			<React.Fragment>
				<Button className="successModalBtn" to="/login" renderAs={Link}>
					OK
        </Button>
			</React.Fragment>
		</React.Fragment>
	);
};

export default SuccessMessage;
