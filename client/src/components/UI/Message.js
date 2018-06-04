import React, { Component } from 'react';
import { connect } from 'react-redux';

class Message extends Component {

    render() {
        let style={
            backgroundColor: '#2ecc71' 
        }
        if(this.props.msg){
            if (this.props.msg.error){
                style={ backgroundColor: '#e74c3c'}
            }
            return (
                <div className="msg" style={style}>
                    <p>{this.props.msg.content}</p> 
                </div>
            )
        } else{
            return null
        }
    }
}

const mapStateToProps = state => {
    return {
        msg: state.market.msg
    }
}


export default connect(mapStateToProps, null)(Message);