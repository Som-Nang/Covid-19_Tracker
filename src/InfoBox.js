import React from 'react'
import { Card, CardContent, Typography } from "@material-ui/core";
import "./infoBox.css";
function InfoBox({ title, active, isRed, cases, total, ...props }) {
    return (
        <Card onClick={props.onClick} className={`infoBox ${active && "infoBox--selected"} ${isRed && "infoBox--red"}`}
        >

            <CardContent>
                {/* Title */}
                <Typography color="textSecondary" gutterBottom>
                    {title}
                </Typography>

                {/* Case Number */}
                <h2 className={`infoBox__cases  ${!isRed && "infoBox__cases--green"}`}>{cases}</h2>

                {/* total */}
                <Typography className="infoBox__total" color="textSecondary">
                    {total} Total
                </Typography>
            </CardContent>

        </Card >
    )
}

export default InfoBox
