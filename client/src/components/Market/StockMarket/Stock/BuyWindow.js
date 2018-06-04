import React from 'react';
import { Row } from 'react-flexbox-grid';
import TextField from 'material-ui/TextField';
import Wrap from '../../../hoc/Wrap';

const BuyWindow = (props) => {
    let summary =
        <Wrap>
            <p>
                Summary: <br />
                Buy {props.basicUnit * props.units} units.
                Total cost: {(props.units * props.price).toFixed(2)} PLN.
                You have {props.avaliableMoney.toFixed(2)}.<br />
                After transaction you'll have {(props.avaliableMoney - (props.units * props.price)).toFixed(2)}
            </p>
        </Wrap>

    //Error handler
    if (props.disableBuyBtn && props.incorrectNumberError === false) {
        summary = <p style={{ color: 'red' }}>You don`t have enought money!</p>
    } else if (props.incorrectNumberError && props.disableBuyBtn) {
        summary = <p style={{ color: 'red' }}>Amount to buy can't be negative!</p>
    }
    return (
        <Wrap>
            <Row className="text-center">
                Current price: {props.price}, updated: {props.date}.<br />
            </Row>
            <Row className="text-center">
                <h3>How many unit sets do you want to buy?</h3>
            </Row>
            <Row className="text-center">
                <TextField
                    floatingLabelText='Units'
                    type='number'
                    value={props.units}
                    onChange={(event, newValue) => props.onUnitsChange(event, newValue)}
                />
                <br />
            </Row>
            <Row className="text-center">
                {summary}
            </Row>

        </Wrap>
    )
}

export default BuyWindow