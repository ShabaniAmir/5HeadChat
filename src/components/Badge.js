import React, { Component } from 'react'

export default class Badge extends Component {
    render() {
        const style={
            backgroundColor:'#686882',
            display:'inline',
            fontSize:12,
            padding:7,
            marginLeft:5,
            borderRadius:100
        }
        return (
            <div style={style}>
                {this.props.children}
            </div>
        )
    }
}
