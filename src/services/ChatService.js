import tmi from 'tmi.js'

export default class ChatService {
    constructor(updateChat, state){
        this.opts = {
            connection: {
                reconnect: true,
                secure: true
            },
            channels: [
                state.channel
            ]
        }
        this.client = new tmi.client(this.opts)
        this.client.on('message', updateChat)
        this.client.on('connected', this.onConnectedHandler)


        this.client.connect()
    }

    disconnect(){
        this.client.disconnect()
    }
    onConnectedHandler(addr, port){
        console.log("Connected:",addr,port)
    }
    
}
