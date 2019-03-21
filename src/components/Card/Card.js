import React from 'react';
import Tile from "react-bulma-components/lib/components/tile";
import './Card.scss';

const Card = (props) => {
    return (
        <Tile kind="parent" className="is-tile-space">
            <Tile renderAs="article" kind="child">
                <Tile
                    vertical
                    className={props.bodyClass}
                >
                    <p className={props.subtitle}>
                        {props.cardData}
                    </p>
                    <p>
                        <strong>{props.cardText}</strong>
                    </p>
                    {props.monthYear ? <p>{props.monthYear}</p> : " "}
                </Tile>
                {props.footerClass ? <Tile className={props.footerClass} /> : " "}
            </Tile>
        </Tile>
    );

}

export default Card;