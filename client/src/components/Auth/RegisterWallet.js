import React, { Component } from 'react';

import Wrap from '../hoc/Wrap';

import TextField from 'material-ui/TextField';
import RaisedButton from 'material-ui/RaisedButton';


class Register extends Component {
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
        negativeNumberError: false
    }

    inputChanged = (event, newVal, index) => {
        let newState = {
            ...this.state
        }
        newState.inputs[index].value = newVal
        this.setState({ inputs: newState.inputs })

        //Check for negative input
        if (newVal < 0) {
            this.setState({ negativeNumberError: true })
        } else {
            this.setState({ negativeNumberError: false })
        }
    }



    render() {
        let errorMsg = null
        if(this.state.negativeNumberError){
            errorMsg = <p style={{color: 'red'}}>Inputs can't be negative!</p>
        }
        let inputArray = this.state.inputs.map((input, index) => {
            return (
                <Wrap key={input.name}>
                    <TextField
                        floatingLabelText={input.name}
                        type='number'
                        value={input.value}
                        onChange={(event, newValue) => this.inputChanged(event, newValue, index)}
                    /><br />
                </Wrap>
            )
        })

        return (
            <Wrap>
                {errorMsg}
                {inputArray}
                < RaisedButton
                    onClick={() => this.props.tryRegister(this.props.login, this.props.password, this.state.inputs)
                    }
                    label="Register"
                    primary={true}
                    style={{ marginTop: '25px' }}
                    disabled={this.state.negativeNumberError} />
            </Wrap>
        )
    }
}

export default Register;