import React from 'react';
import Paper from 'material-ui/Paper';
import Stock from './Stock/Stock';

import { Row, Col } from 'react-flexbox-grid';

const StockMarket = (props) => {

    let lastUpdate = null
    let allStocks = null
    //Generate all stocks if props received
    if (props.stockData) {
        let date = new Date(props.stockData.PublicationDate).toLocaleString()
        lastUpdate = <p>Last update: {date}</p>

        allStocks = props.stockData.Items.map(stock => {
            return (
                <Stock
                    key={stock.Code}
                    name={stock.Name}
                    shortcut={stock.Code}
                    unit={stock.Unit}
                    price={stock.Price}
                    date={date}
                />
            )
        })
    }

    return (
        <Paper zDepth={3} className="text-center" style={{ padding: '6px', marginTop: '15px' }}>
            <h2>Stock market</h2>
            {lastUpdate}
            <Row style={{ border: '2px solid #cecece', backgroundColor: '#f4f4f4'}} >
                <Col xs={4} style={{ borderRight: '2px solid #cecece', padding: '15px 0'  }}>
                    Company
                </Col>
                <Col xs={4} style={{ borderRight: '2px solid #cecece', padding: '15px 0'  }} >
                    Value
                </Col>
                <Col xs={4} style={{ borderRight: '2px solid #cecece', padding: '15px 0'  }}>
                    Actions
                </Col>
            </Row>
            {allStocks}
        </Paper>
    )

}

export default StockMarket;