import React, { Component } from 'react'
import {
    Paper
} from '@material-ui/core'

export default class Stats extends Component {
    render() {
        const paper = {
            color: "white",
            padding: 10,
            minWidth: 300,
            // border: "1px solid #2e2e46",
            fontSize: 16,
            backgroundColor: "#292839",
            maxWidth: "250px",
            color: "#ccc",
            overflowY: "hidden",
            overflowX: "hidden",
            position: 'relative',
            fontWeight: 'bold',
            borderRadius: 10,
            flex: 1,
            textAlign:'center',
            marginBottom:10,
            display:'flex',
            // height:'90%',
            justifyContent:'center',
            flexDirection:'column',
            height:'200px' 
        }
        return (
            <div style={{
                display:'flex',
                justifyContent:'center',
                
            }}>
            {/* <h2 style={{color:'#ccc'}}>Chats/Minute</h2> */}
            <Paper elevation={1} style={paper}>
                <span style={{fontSize:32, padding:10}}>{this.props.children}</span> <span style={{fontWeight:'normal'}}>{this.props.unit}</span>
            </Paper>
            </div>
        )
    }
}
