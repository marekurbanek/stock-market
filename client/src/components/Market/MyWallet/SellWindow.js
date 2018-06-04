import React from 'react';
import { Row } from 'react-flexbox-grid';
import TextField from 'material-ui/TextField';
import Wrap from '../../hoc/Wrap';

const SellWindow = (props) => {
    let summary = <p>
        Summary: <br />
        Sell {props.basicUnit * props.units} units.
            Total gain: {(props.units * props.price).toFixed(2)} PLN.
        </p>


    if (props.disableSellBtn && props.incorrectNumberError === false) {
        summary = <p style={{ color: 'red' }}>You don't have enough stock amount!</p>
    } else if (props.incorrectNumberError && props.disableSellBtn) {
        summary = <p style={{ color: 'red' }}>Amount to sell can't be negative!</p>
    }
    return (
        <Wrap>
            <Row className="text-center">
                Current price: {props.price}, updated: {props.date}.<br />
            </Row>
            <Row className="text-center">
                <h3>How many stock sets do you want to sell?</h3>
            </Row>
            <Row className="text-center">
                <TextField
                    floatingLabelText='Units'
                    type='number'
                    value={props.units}
                    onChange={(event, newValue) => props.onUnitsChange(event, newValue)}
                /><br />
            </Row>
            <Row className="text-center">
                {summary}
            </Row>

        </Wrap>
    )
}

export default SellWindow