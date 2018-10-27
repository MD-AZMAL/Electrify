class Blocks{
    
    constructor(index,prevhash,senderkey,receiverkey,power,money){

        this.index = index;
        this.prevhash = prevhash;
        this.hash = "";
        this.nonce = 0;
        this.data = {
            senderkey:senderkey,
            receiverkey:receiverkey,
            power:power,
            money:money
      };
    }

    get key(){
        return JSON.stringify(this.data) + this.index + this.prevhash + this.hash + this.nonce;
    }

    addata(data){
      this.data.push(data);    
    }
             
}
module.exports=Blocks;