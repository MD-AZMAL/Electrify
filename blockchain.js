let Block = require('./block');
let SHA256 = require('js-sha256');
let express = require('express');

class Blockchain {

    constructor(defaultblock) {
        this.blocks = [];
        this.addblock(defaultblock);
    }

    addblock(block) {
        block.hash = this.gethash(block);
        this.blocks.push(block);
    }

    generatenxtblock(block) {

        let block = new Block();
        let prevblock = this.getprevblock();

        block.index = this.blocks.length;

        block.prevhash = prevblock.hash;
        block.hash = this.gethash(block);

        return block;
    }

    gethash(block) {

        let blockhash = SHA256(block.key());

        while (!blockhash.startwith('000')) {
            block.nonce += 1;
            blockhash = SHA256(block.key());

        }

        return blockhash;

    }

    getprevblock(block) {
        return this.blocks[this.blocks.length - 1];
    }

}
module.exports = Blockchain;