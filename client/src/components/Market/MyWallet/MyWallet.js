import React, { Component } from 'react';
import * as actions from '../../../actions/index';
import { connect } from 'react-redux';
import Paper from 'material-ui/Paper';
import { Row, Col } from 'react-flexbox-grid';
import WalletItem from './WalletItem';

class MyWallet extends Component {
    componentDidMount() {
        //Call api and get wallet data for specific user
        this.props.getWalletData();
    }

    //Function to find proper stock object
    compareNames = (walletName, stockName) => {
        return walletName === stockName
    }

    render() {
        let walletItems = null
        let avaliableMoney = null
        if (this.props.walletData && this.props.stockData) {
            let date = new Date(this.props.stockData.PublicationDate).toLocaleString()
            avaliableMoney = this.props.walletData[0].amount
            
            walletItems = this.props.walletData.map(walletItem => {
                if (walletItem.name === 'PLN') {
                    return null
                }
                //Find proper stock and assign values to the wallet item 
                let stockName = this.props.stockData.Items.find((currentObj) => {
                    return this.compareNames(walletItem.name, currentObj.Code)
                })
                return (
                    <WalletItem
                        key={walletItem.name}
                        shortcut={walletItem.name}
                        name={stockName.Name}
                        price={stockName.Price}
                        date={date}
                        basicUnit={stockName.Unit}
                        amount={walletItem.amount}
                    />
                )
            })
        }

        return (
            <Paper className="text-center" style={{ padding: '6px', marginTop: '15px' }} zDepth={3}>
                <h2>My wallet</h2>
                <Row style={{ border: '2px solid #cecece', backgroundColor: '#f4f4f4' }}>
                    <Col xs={2} style={{ borderRight: '2px solid #cecece', padding: '15px 0' }}>
                        Company
                    </Col>
                    <Col xs={2} style={{ borderRight: '2px solid #cecece', padding: '15px 0' }}>
                        Unit Price
                    </Col>
                    <Col xs={2} style={{ borderRight: '2px solid #cecece', padding: '15px 0' }}>
                        Amount
                    </Col>
                    <Col xs={3} style={{ borderRight: '2px solid #cecece', padding: '15px 0' }}>
                        Value
                    </Col>
                    <Col xs={3} style={{ borderRight: '2px solid #cecece', padding: '15px 0' }}>
                        Actions
                    </Col>
                </Row>
                {walletItems}
                <hr />
                <strong>Avaliable money: {avaliableMoney ? avaliableMoney.toFixed(2) : null} PLN</strong>
            </Paper>
        )
    }
}

const mapStateToProps = state => {
    return {
        walletData: state.market.walletData,
        stockData: state.market.stockData
    }
}

const mapDispatchToProps = dispatch => {
    return {
        getWalletData: () => dispatch(actions.getWalletData())
    }
}
export default connect(mapStateToProps, mapDispatchToProps)(MyWallet);