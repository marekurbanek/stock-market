import React, { Component } from 'react';
import { Row, Col } from 'react-flexbox-grid';
import { connect } from 'react-redux';
import SellWindow from './SellWindow';
import RaisedButton from 'material-ui/RaisedButton';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import * as actions from '../../../actions/index';

class WalletItem extends Component {
    state = {
        isSelling: false,
        units: '',
        open: false,
        disableSellBtn: false,
        incorrectNumberError: false
    }
    //Modals handlers
    openSellWindow = () => {
        this.setState({ isSelling: true })
    }
    closeSellWindow = () => {
        this.setState({ isSelling: false })
    }
    handleOpen = () => {
        this.setState({ open: true });
    };

    handleClose = () => {
        this.setState({ open: false });
    };

    //Sell stock and close modals
    sellStock = () => {
        this.props.sellStock(this.props.shortcut, this.state.units, this.props.basicUnit)
        this.handleClose()
        this.closeSellWindow()
    }

    //Input changed handler
    onUnitsChange = (event, newVal) => {
        this.setState({ units: newVal })
        //Check if user has enough stock amount
        if (this.props.amount < (newVal * this.props.basicUnit)) {
            this.setState({ disableSellBtn: true })
        } else {
            this.setState({ disableSellBtn: false })
        }
        //Check for incorrect number
        if (newVal < 0) {
            this.setState({ incorrectNumberError: true, disableSellBtn: true })
        } else {
            this.setState({ incorrectNumberError: false })
        }
    }


    render() {
        //If user doesn't own stock return null
        if (this.props.amount === 0) {
            return null
        }
        //Modals actions
        const sellWindowActions = [
            <FlatButton
                label="Cancel"
                primary={true}
                onClick={this.closeSellWindow}
            />,
            <FlatButton
                label="Submit"
                primary={true}
                disabled={this.state.disableSellBtn}
                onClick={this.handleOpen}
            />,
        ];
        const actions = [
            <FlatButton
                label="Cancel"
                primary={true}
                onClick={this.handleClose}
            />,
            <FlatButton
                label="Submit"
                primary={true}
                onClick={this.sellStock}
            />,
        ];

        const modalTitle = (<h1>Do you want to sell {this.props.name} stocks?</h1>)


        return (
            <Row style={{ border: '2px solid #cecece' }}>
                <Col xs={2} style={{ lineHeight: '36px', padding: '10px 0px', verticalAlign: 'middle', borderRight: '2px solid #cecece' }}>
                    {this.props.shortcut}
                </Col>
                <Col xs={2} style={{ lineHeight: '36px', padding: '10px 0px', verticalAlign: 'middle', borderRight: '2px solid #cecece' }}>
                    {this.props.price.toFixed(2)}
                </Col>
                <Col xs={2} style={{ lineHeight: '36px', padding: '10px 0px', verticalAlign: 'middle', borderRight: '2px solid #cecece' }}>
                    {this.props.amount}
                </Col>
                <Col xs={3} style={{ lineHeight: '36px', padding: '10px 0px', verticalAlign: 'middle', borderRight: '2px solid #cecece' }}>
                    {((this.props.price * this.props.amount) / this.props.basicUnit).toFixed(2)}
                </Col>
                <Col xs={3} style={{ lineHeight: '36px', padding: '10px 0px', verticalAlign: 'middle', borderRight: '2px solid #cecece' }}>
                    <RaisedButton onClick={this.openSellWindow} label="Sell" secondary={true} />
                </Col>
                <Dialog
                    title={modalTitle}
                    actions={sellWindowActions}
                    modal={false}
                    open={this.state.isSelling}
                    onRequestClose={this.closeSellWindow}
                >
                    <SellWindow
                        name={this.props.name}
                        shortcut={this.props.shortcut}
                        price={this.props.price}
                        date={this.props.date}
                        basicUnit={this.props.basicUnit}
                        units={this.state.units}
                        onUnitsChange={this.onUnitsChange}
                        disableSellBtn={this.state.disableSellBtn}
                        incorrectNumberError={this.state.incorrectNumberError}
                    />
                </Dialog>
                <Dialog
                    title={modalTitle}
                    actions={actions}
                    modal={true}
                    open={this.state.open}
                >
                    Are you sure you want to sell {this.props.basicUnit * this.state.units} {this.props.name} stocks?
                </Dialog>
            </Row>
        )
    }
}

const mapDispatchToProps = dispatch => {
    return {
        sellStock: (stockName, amount, basicUnit) => dispatch(actions.sellStock(stockName, amount, basicUnit))
    }
}

export default connect(null, mapDispatchToProps)(WalletItem)