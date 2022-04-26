import Chat from './components/Chat'
import './App.css';
import React, { Component } from 'react'
import {
  Paper,
  Button,
  TextField,
  Container,
  Link,
  Switch,
  IconButton
} from '@material-ui/core';
import ChatService from './services/ChatService'
import RandomColor from 'randomcolor'
// import StatService from './services/StatService'
// import Stats from './components/Stats'
import RefreshRoundedIcon from '@material-ui/icons/RefreshRounded';

export default class App extends Component {
  constructor() {
    super()
    this.state = {
      chat: [],
      hideEmotes: localStorage.getItem('hideEmotes') || false ,
      hideCommands: localStorage.getItem('hideCommands') || false,
      hideSymbolOnly: localStorage.getItem('hideCommands') || false,
      route: '/',
      channel: '',
      rate: 0,
      chatters: [],
      numOfSubs: 0,
      numOfMods: 0,
      chatStarted: false
    }
    this.colors = []
    // Keep history clean
    setInterval(async () => {if (this.state.chat.length > 1000) {
      const oldLength = this.state.chat.length
      const shorterChat = this.state.chat.slice(this.state.chat.length - 1000, this.state.chat.length)
      const newLength = shorterChat.length
      this.setState({...this.state, chat: shorterChat})
      console.log(`Shortened chat from ${oldLength} to ${newLength}`)
     }else{
      //  console.log('Chat length good')
     }
    }, 5000)
    //this.startChat()
    
  }

  componentDidMount(){
    if(localStorage.getItem('channel')){
      this.setState({route:'/dashboard'})
      this.setState({channel:localStorage.getItem('channel')})
      this.setState({hideEmotes: localStorage.getItem('hideEmotes')})
      this.setState({hideCommands: localStorage.getItem('hideCommands')})
    }
  }
  
  componentDidUpdate(){
    if(localStorage.getItem('channel') && !this.state.chatStarted){
      this.startChat()
      this.setState({chatStarted:true})
      //this.setState({hideEmotes: localStorage.getItem('hideEmotes')})
    }
  }
  setRate(rate){
    
  }
  // Runs when app is ready to connect to chat
  startChat() {   
    this.chatService = new ChatService(this.updateChat.bind(this), this.state)
    console.log('Connecting to chat')
    //this.statService = new StatService(this)
    //this.statService.start()
  }

  // Runs every time a new message is received. 
  updateChat(target, context, msg, self) {
    
    // Emotes
    if(context['emote-only']){
      if(this.state.hideEmotes){
        return
      }
      
    }
    //Commands
    if(msg.charAt(0) == '!'){
      if(this.state.hideCommands){
        return
      }
    }
    
    // Symbol only messages
    var lettersAndNumbers = /[a-zA-Z0-9]+/g
    if(this.state.hideSymbolOnly){
      console.log("Symbols must be hidden")
      if(!lettersAndNumbers.test(msg)){
        console.log("Message doesn't have any letters in it")
        return
      }
    }

    // if (this.state.chat.length % 100 == 0) console.log('chats: ', this.state.chat.length)

    // if(!context.color){
    //   console.log('Color is null!')
    //   if(this.colors.includes(context['display-name'])){
    //     context.color = this.colors[context['display-name']]
    //     console.log('User has already been assigned a color: ',  this.colors[context['display-name']])
    //   }else{
    //     this.colors.push({[context['display-name']] : RandomColor()})
    //     context.color = this.colors[context['display-name']]
    //     console.log('New random color assigned to user, ', this.colors[context['display-name']])
    //   } 
    // }
    //this.statService.newChat()
    //console.log(context)

    // Data Model for messages
    let chat = {
      isVip: context.badges.vip == 1,
      name: context['display-name'],
      color: context.color,
      msg: msg,
      marked: null,
      isSubscriber: context.subscriber,
      isMod: context.mod
    }

    let oldChat = this.state.chat

    
    // Update chat list
    try {
      this.setState({
        chat: [...oldChat, chat]
      })

    } catch (e) {
      console.log(e)
    }

    // console.log("# of chats ", this.state.chat.length)
  }

  // For filtering messages
  isVip(msg){
    if(msg.isVip) console.log('is vip')
    return msg.isVip
  }

  isQuestion(msg) {
    if(msg.msg.includes('?')) console.log('msg is question')
    return msg.msg.includes('?')
  }
  isSubscriber(msg) {
    return msg.isSubscriber
  }
  isMod(msg) {
    return msg.isMod
  }
  render() {
    switch (this.state.route) {
      case '/dashboard':
        return (
          <div className="App" hideScrollbars="false" style={{flexWrap:'wrap'}}>
            <Chat innerStyle={{ height: '85%',maxHeight:'85vh', minHeight:'85vh'}} chat={this.state.chat} context={this} counter={Object.keys(this.state.chat).length} title="Non-Subs" filter={(msg) => {return !this.isVip(msg) && !this.isMod(msg) && !this.isQuestion(msg) && !this.isSubscriber(msg)}}/>
            <Chat innerStyle={{ height: '85%',maxHeight:'85vh',  minHeight:'85vh'}} chat={this.state.chat} context={this} title="Subscribers" filter={(msg) => {return !this.isVip(msg) && !this.isMod(msg) && !this.isQuestion(msg) && this.isSubscriber(msg)}} />
            <div style={{
              // margin: 10,
              display: 'flex',
              flexDirection: 'column',
              height: '85%',
              flex:1,
            }}>

                <Chat innerStyle={{ flex: 1, margin: 0, minHeight: '40vh ', maxHeight: '40vh ', overflow: 'hidden' ,}} style={{ margin: 10, flex: 1 }} chat={this.state.chat} context={this} title="Mods / VIP" filter={(msg) => {return this.isMod(msg) || this.isVip(msg)}} />
                <Chat innerStyle={{ flex: 1, margin: 0, minHeight: '100% ', maxHeight: '100%', overflow: 'hidden' }} style={{ marginTop:0, margin: 10, flex: 1, maxHeight: '40%' }} chat={this.state.chat} context={this} title="Questions" filter={(msg) => {return !this.isVip(msg) && !this.isMod(msg) && this.isQuestion(msg) && !this.isSubscriber(msg)}} />
            </div>
            {<div style={{ flexDirection:'row',flex: 3, paddingLeft: 20, display: 'flex', justifyContent: 'space-evenly', flexWrap: 'wrap', alignItems: 'center' }}>
              {/* <Stats unit="Chats/Minute">{this.state.rate}</Stats>
              <Stats unit="Chatters">{Object.keys(this.state.chatters).length}</Stats> */}
              <h1 style={{textTransform:'capitalize'}}>{this.state.channel} <IconButton color="primary" onClick={()=>{
                this.setState({channel:'',route:'/'})
                localStorage.removeItem('channel')
                this.chatService.disconnect()
                delete this.chatService
                this.setState({
                  chat: [],
                  channel: '',
                  rate: 0,
                  hideEmotes: false ,
                  hideCommands: false,
                  hideSymbolOnly: false,
                  chatters: [],
                  numOfSubs: 0,
                  numOfMods: 0,
                  chatStarted: false
                })
                this.setState({
                  route: '/'
                })
                //window.location.reload();
              }}><RefreshRoundedIcon/></IconButton></h1>
              <iframe src={"https://player.twitch.tv/?channel=" + this.state.channel+"&parent=thegiraffebox.com"} frameborder="0" allowfullscreen="true" scrolling="no" style={{width:"100%",height:"50%"}}></iframe>
              <div>
                <h3 style={{textAlign:'center'}}>Settings</h3>
                <div>
                <Switch checked={this.state.hideEmotes} onClick={() => {
                  this.setState(prevState => ({
                    hideEmotes: !prevState.hideEmotes
                  }))
                  localStorage.setItem('hideEmotes', !this.state.hideEmotes)
                  console.log(localStorage.getItem('hideEmotes'), !this.state.hideEmotes)
                }}/> Hide Emote Chats<br />

                <Switch checked={this.state.hideCommands} onClick={() => {
                  this.setState(prevState => ({
                    hideCommands: !prevState.hideCommands
                  }))
                  localStorage.setItem('hideCommands', !this.state.hideCommands)
                  console.log(localStorage.getItem('hideCommands'), !this.state.hideCommands)
                }}/> Hide Commands <br />
                <Switch checked={this.state.hideSymbolOnly} onClick={() => {
                  this.setState(prevState => ({
                    hideSymbolOnly: !prevState.hideSymbolOnly
                  }))
                  localStorage.setItem('hideSymbolOnly', !this.state.hideSymbolOnly)
                  console.log(localStorage.getItem('hideSymbolOnly'), !this.state.hideSymbolOnly)
                }}/> Hide Symbol Only<br />
                  </div>
              </div>
            </div> }

<Container style={{
              position:'fixed',
              bottom:0,
              left:0,
              }}>
            <p style={{color:'#666', }}>© 2020  <Link href="http://amirshabani.com">AmirShabani.com</Link></p>
            </Container>
          </div>
          
        );
      case '/':
        return (
          <div style={{ height: '100%', width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column' }}>
            {/* <Container style={{
              color: 'white',
              display:'flex',
              justifyContent: 'center',
              marginBottom:'100px'
            }}>
              <h2>T.TV Focus Chat</h2>
            </Container> */}
            <Container style={{ textAlign: 'center' }}>
            <p><h1><img src="/5Head.png" height="48px"/> Chat <span style={{fontSize:16, fontWeight:'normal'}}>(Alpha)</span></h1>
              </p>
              <p style={{color:'#aaa'}}>A smarter way of viewing your stream's chat.</p>

              <TextField style={{margin:'25px'}} id="standard-basic" autocomplete="username" label="Twitch Username" inputProps={{
                autoFocus: true,
                color: 'secondary'
              }} onChange={(e) => {
                localStorage.setItem('channel',e.target.value)
                this.setState({
                  channel: e.target.value
                })
              }} />
            </Container>
            <Container style={{ textAlign: 'center', marginTop: 10 }}>
              <Button variant="outlined" color="secondary" onClick={() => {
                // new ChatService(this.updateChat.bind(this), this.state)
                this.setState({
                  route: '/dashboard'
                })
                this.startChat()
              }}
              >
                Launch Chat
              </Button>
              
            </Container>
            <Container style={{
              position:'fixed',
              bottom:0,
              left:0,
              }}>
            <p style={{color:'#666', }}>© 2020  <Link href="http://amirshabani.com">AmirShabani.com</Link>. By using this app you agree to be GiraffeBox's friend.</p>
            </Container>
          </div>

        );
    }


  }

}
