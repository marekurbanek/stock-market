import React, { Component } from 'react';
import { connect } from 'react-redux';
import * as actions from '../../actions/index';
import { Redirect } from 'react-router-dom';
import Websocket from 'react-websocket';
import { Grid, Row, Col } from 'react-flexbox-grid';
import StockMarket from './StockMarket/StockMarket';
import MyWallet from './MyWallet/MyWallet';


import FusionCharts from 'fusioncharts';
import Charts from 'fusioncharts/fusioncharts.charts';
import ReactFC from 'react-fusioncharts';

class Market extends Component {
    componentWillMount() {
        //Check user authentication, if not authenticated - redirect
        this.props.checkIfUserIsAuthenticated()
    }

    render() {
        //Generate chart if user price history avaliable
        let chart = null
        if (this.props.priceHistory) {

            Charts(FusionCharts);
            const myDataSource = {
                chart: {
                    caption: 'Stock prices',
                    numberPrefix: 'PLN',
                    setAdaptiveYMin: true,
                    showValues: false
                },
                data: this.props.priceHistory
            };

            const chartConfigs = {
                type: 'line',
                width: 600,
                height: 400,
                dataFormat: 'json',
                dataSource: myDataSource,
            };

            chart = <ReactFC {...chartConfigs} />
        }
        //Redirect to login if user is not authenticated
        let redirectAuth = null;
        if (!this.props.authenticated) {
            redirectAuth = <Redirect to="/login" />
        }

        return (
            <Grid>
                <Row>
                    <Col sm={6}>
                        <StockMarket stockData={this.props.stockData} />
                    </Col>
                    <Col sm={6}>
                        <MyWallet />
                    </Col>
                </Row>
                <Row>
                    <Col sm={6}>
                        {chart}
                    </Col>
                </Row>
                {redirectAuth}
                <Websocket url='ws://webtask.future-processing.com:8068/ws/stocks?format=json'
                    onMessage={this.props.setStockPrices} />
            </Grid>
        )
    }
}

const mapStateToProps = state => {
    return {
        authenticated: state.auth.authenticated,
        stockData: state.market.stockData,
        priceHistory: state.market.priceHistory
    }
}
const mapDispatchToProps = dispatch => {
    return {
        checkIfUserIsAuthenticated: () => dispatch(actions.checkAuthentication()),
        setStockPrices: (stockData) => dispatch(actions.setStockPrices(stockData)),
        getPriceHistory: () => dispatch(actions.getPriceHistory())
    }
}
export default connect(mapStateToProps, mapDispatchToProps)(Market);