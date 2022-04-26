import { Paper } from '@material-ui/core'
import React, { Component, createRef } from 'react'
import Badge from './Badge'

export default class Chat extends Component {

    constructor() {
        super()
        this.messagesEndRef = createRef()
        this.chatWindow = createRef()
        this.scrolled = createRef()
    }

    componentDidMount() {
        this.scrollToBottom();
    }

    componentDidUpdate() {
        this.scrollToBottom();
    }

    scrollToBottom() {
        this.chatWindow.scrollTop = this.chatWindow.scrollHeight;
    }
    render() {
        const chat = {
            padding: 10,
            minWidth: 250,
            // border: "1px solid #2e2e46",
            fontSize: 14,
            backgroundColor: "#292839",
            // maxWidth: "250px",
            color: "#ccc",
            overflowY: "scroll",
            overflowX: "hidden",
            position: 'relative',
            fontWeight: 'bold',
            borderRadius: 10,
            flex: 1,
            maxWidth:'100vw',
            
        }
        const wrap = {
            wordWrap: "break-word",
        }
        let context = this.props.context
        return (
            <div style={{
                padding: 0,
                margin: 10,
                color: 'white',
                flex:1,
                ...this.props.style
            }}>
                
                <h2 style={{ padding: 10, paddingTop: 0, paddingBottom: 0 }}>{this.props.title} {/*<Badge>{this.props.counter || 'n/a'}</Badge>*/}{this.props.children}</h2>
                
                <Paper elevation={3} style={{...this.props.innerStyle, ...chat}} ref={(scrolled) => { this.chatWindow = scrolled; }} class="scrollable">
                    {/* <div style={{ position: 'absolute', backgroundColor: '#292839', width: '100%' }}>

                    </div> */}
                    <div style={{}} ref={this.chatWindow}>
                        {this.props.chat.map((msg, index) => {
                            if ((this.props.filter && this.props.filter(msg)) || !this.props.filter) {
                                return (

                                    <p class="chatMessage" key={index}
                                        onClick={() => {

                                        }}><span style={{ color: msg.color }}>{msg.name}</span>: {msg.msg}</p>
                                )
                            }
                        })}
                        <div ref={el => { this.el = el; }} ></div>
                    </div>
                </Paper>

            </div>
        )
    }
}
