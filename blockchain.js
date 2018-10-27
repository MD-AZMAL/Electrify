let Block = require('./block');
let SHA256 = require('js-sha256');
let express = require('express');

class Blockchain {

    constructor(defaultblock) {
        this.blocks = [];
        defaultblock = this.mine(defaultblock);
        this.blocks.push(defaultblock);
    }

    /*  addblock(block){
       block.hash = this.gethash(block);
       this.blocks.push(block);
      }*/

    generatenxtblock(block) {

        let block = new Block();
        let prevblock = this.getprevblock();
        block.prevhash = prevblock.hash;
        block.hash = this.gethash(block);

        return block;
    }

    /*gethash(block){

    gethash(block) {
        let blockhash = SHA256(block.key);
        return blockhash;

    }*/

    getprevblock() {
        return this.blocks[this.blocks.length - 1];
    }

    mine(block) {
        let blockhash = SHA256(block.key);
        console.log('mining');
        while (!blockhash.startsWith("000")) {
            block.nonce += 1;
            blockhash = SHA256(block.key);
        }

        block.hash = blockhash;
        return block;

    }
}

module.exports = Blockchain;