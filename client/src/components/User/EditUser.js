import React, { Component } from 'react';
import { connect } from 'react-redux';
import * as actions from '../../actions/index'
import Wrap from '../hoc/Wrap'

import { Grid, Row, Col } from 'react-flexbox-grid';
import TextField from 'material-ui/TextField';
import Paper from 'material-ui/Paper';
import RaisedButton from 'material-ui/RaisedButton';

class EditUser extends Component {
    state = {
        inputs: [
            {
                name: 'PLN Amount',
                value: 0
            },
            {
                name: 'Future Processing',
                value: 0
            },
            {
                name: 'FP Lab',
                value: 0
            },
            {
                name: 'Progress Bar',
                value: 0
            },
            {
                name: 'FP Coin',
                value: 0
            },
            {
                name: 'FP Adventure',
                value: 0
            },
            {
                name: 'Deadline 24',
                value: 0
            }
        ],
        inputsUpdated: false,
        incorrectNumberError: false
    }

    componentDidMount() {
        this.setState({ inputsUpdated: false })
        this.props.getWalletData()
    }

    inputChanged = (event, newVal, index) => {
        let newState = {
            ...this.state
        }
        newState.inputs[index].value = newVal
        this.setState({ inputs: newState.inputs })

        //Check for incorrect number
        if (newVal < 0) {
            this.setState({ incorrectNumberError: true })
        } else {
            this.setState({ incorrectNumberError: false })
        }
    }

    setStateAfterGettingData = (walletData) => {
        walletData.forEach((walletItem, index) => {
            let newState = { ...this.state }
            newState.inputs[index].value = walletItem.amount
            this.setState({ inputs: newState.inputs, inputsUpdated: true })
        })
    }

    goHome = () => {
        this.props.history.push('/market')
    }

    saveChanges = () => {
        this.props.saveChanges(this.state.inputs)
        this.goHome()
    }

    render() {
        let numberError = null
        if (this.props.walletData && this.state.inputsUpdated === false) {
            this.setStateAfterGettingData(this.props.walletData)
        }
        if (this.state.incorrectNumberError) {
            numberError = <p style={{ color: 'red', fontSize: '120%'}}>Amounts can't be negative!</p>
        }

        let allInputs = null
        if (this.state.inputsUpdated) {
            allInputs = this.state.inputs.map((walletItem, index) => {
                return (
                    <Wrap key={walletItem.name}>
                        <TextField
                            floatingLabelText={walletItem.name}
                            type='number'
                            value={walletItem.value}
                            onChange={(event, newValue) => this.inputChanged(event, newValue, index)}
                        /><br />
                    </Wrap>
                )
            })
        }
        return (
            <Grid>
                <Row>
                    <Col md={6} mdOffset={3}>
                        <Paper zDepth={4} style={{ padding: '25px', paddingBottom: '50px', marginTop: '35px' }}>
                            <h2 className="text-center">Edit user</h2>
                            {numberError}
                            {allInputs}
                            <RaisedButton onClick={this.goHome} label="Back" secondary={true} style={{ float: 'left' }} />
                            <RaisedButton
                                disabled={this.state.incorrectNumberError}
                                onClick={this.saveChanges}
                                label="Save changes"
                                primary={true}
                                style={{ float: 'right' }} />
                        </Paper>
                    </Col>
                </Row>
            </Grid>
        )
    }
}

const mapStateToProps = state => {
    return {
        walletData: state.market.walletData,
    }
}

const mapDispatchToProps = dispatch => {
    return {
        getWalletData: () => dispatch(actions.getWalletData()),
        saveChanges: (walletData) => dispatch(actions.saveUserChanges(walletData))
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(EditUser)