import React, { Component } from 'react';
import { Row, Col } from 'react-flexbox-grid';
import { connect } from 'react-redux';
import RaisedButton from 'material-ui/RaisedButton';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import BuyWindow from './BuyWindow';
import * as actions from '../../../../actions/index';

import ChartIcon from 'material-ui/svg-icons/editor/show-chart';
import IconButton from 'material-ui/IconButton';


class Stock extends Component {

    state = {
        isBuying: false,
        units: '',
        open: false,
        disableBuyBtn: false,
        incorrectNumberError: false
    }

    //Handle modals
    openBuyWindow = () => {
        this.setState({ isBuying: true })
    }
    closeBuyWindow = () => {
        this.setState({ isBuying: false })
    }
    handleOpen = () => {
        this.setState({ open: true });
    };
    handleClose = () => {
        this.setState({ open: false });
    };

    //Buy stocks and close modals
    buyStock = () => {
        this.props.buyStock(this.props.shortcut, this.state.units, this.props.unit)
        this.handleClose()
        this.closeBuyWindow()
    }

    //Unit changed handler
    onUnitsChange = (event, newVal) => {
        this.setState({ units: newVal })
        //Check if user has enough money
        if (this.props.walletData) {
            if ((newVal * this.props.price) > this.props.walletData[0].amount) {
                this.setState({ disableBuyBtn: true })
            } else {
                this.setState({ disableBuyBtn: false })
            }
        }
        //Check for incorrect number
        if (newVal < 0) {
            this.setState({ incorrectNumberError: true, disableBuyBtn: true })
        } else {
            this.setState({ incorrectNumberError: false })
        }
    }


    render() {
        //Actions for modal component
        const buyWindowActions = [
            <FlatButton
                label="Cancel"
                primary={true}
                onClick={this.closeBuyWindow}
            />,
            <FlatButton
                label="Submit"
                primary={true}
                onClick={this.handleOpen}
                disabled={this.state.disableBuyBtn}
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
                onClick={this.buyStock}
            />,
        ];
        //Modal title
        const buyWindowTitle = (<h1>Do you want to buy {this.props.name} stocks?</h1>)

        return (
            <Row style={{ border: '2px solid #cecece' }}>
                <Col xs={4} style={{ lineHeight: '36px', padding: '10px 0px', verticalAlign: 'middle', borderRight: '2px solid #cecece' }}>
                    {this.props.shortcut}
                </Col>
                <Col xs={4} style={{ lineHeight: '36px', padding: '10px 0px', verticalAlign: 'middle', borderRight: '2px solid #cecece' }}>
                    {this.props.price.toFixed(2)}
                </Col>
                <Col xs={4} style={{ lineHeight: '36px', padding: '10px 0px', verticalAlign: 'middle', borderRight: '2px solid #cecece' }}>
                    <RaisedButton label="Buy" primary={true} onClick={this.openBuyWindow} />
                    <IconButton onClick={() => this.props.getPriceHistory(this.props.shortcut)} tooltip="Generate chart">
                        <ChartIcon />
                    </IconButton>
                </Col>
                <Dialog
                    title={buyWindowTitle}
                    actions={buyWindowActions}
                    modal={false}
                    open={this.state.isBuying}
                    onRequestClose={this.closeBuyWindow}
                >
                    <BuyWindow
                        name={this.props.name}
                        shortcut={this.props.shortcut}
                        price={this.props.price}
                        date={this.props.date}
                        basicUnit={this.props.unit}
                        units={this.state.units}
                        onUnitsChange={this.onUnitsChange}
                        avaliableMoney={this.props.walletData ? this.props.walletData[0].amount : null}
                        disableBuyBtn={this.state.disableBuyBtn}
                        incorrectNumberError={this.state.incorrectNumberError}
                    />
                </Dialog>
                <Dialog
                    title={buyWindowTitle}
                    actions={actions}
                    modal={true}
                    open={this.state.open}
                >
                    Are you sure you want to buy {this.props.unit * this.state.units} {this.props.name} stocks?<br />
                </Dialog>

            </Row >
        )
    }

}

const mapStateToProps = (state, ownProps) => {
    return {
        walletData: state.market.walletData
    }
}

const mapDispatchToProps = dispatch => {
    return {
        buyStock: (stockName, amount, basicUnit) => dispatch(actions.buyStock(stockName, amount, basicUnit)),
        getPriceHistory: (stockName) => dispatch(actions.getPriceHistory(stockName))
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Stock);