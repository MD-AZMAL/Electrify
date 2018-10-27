class Blocks{
    
    constructor(senderkey,receiverkey,power,money){

        this.index = 0;
        this.prevhash = 0;
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