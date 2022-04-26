
export default class StatService {
    constructor(context){ 
        this.context = context
        this.chatCount = 0
        this.calcInterval = 5000
        this.filterOutInterval = 5000
        this.subsInterval = 10000
    }
    start(){
        setInterval(this.calculate.bind(this), this.calcInterval);
        //setInterval(this.filterOutOldies.bind(this), this.filterOutInterval)
        //setInterval(this.calculateSubs.bind(this), this.subsInterval)
    }

    calculate(){
        let rate = (this.chatCount)*(60 / (this.calcInterval/1000))
        this.context.setState({rate: rate})
        this.chatCount = 0
    }

    filterOutOldies(){
        let copy = this.context.state.chatters
        Object.keys(copy).forEach((key) => {
            console.log('checking activity')
            if((new Date().getTime()/1000) - (copy[key].lastMessage/1000) > this.filterOutInterval){
                console.log("chatter inactive")
                delete copy[key]
            }
        })
        let deleted = Object.keys(this.context.state.chatters).length - Object.keys(copy).length
        console.log("Deleted: " + deleted)
        this.context.setState({
            chatters: copy
        })
    }
    calculateSubs(){
        let subs = 0
        
        Object.keys(this.context.state.chatters).forEach((key) => {
            console.log(this.context.state.chatters[key])
            if(this.context.state.chatters[key].isSubscriber){
                subs += 1
            }
        })
        console.log('counted ' + subs + ' subs!')
        this.context.setState({numOfSubs: subs})
    }
    newChat(){
        this.chatCount++
    }
    
}