import dayjs from 'dayjs';
import chalk from 'chalk';

import { Worker } from 'worker_threads';
import { monitorEventLoopDelay } from 'perf_hooks';

class Block{
    constructor(previousHash = '', body = []){
        this.previousHash = previousHash;
        this.timestamp = dayjs().format();
        this.nonce = 0;

        this.body = body;   //Transactions
    }

}

class Blockchain {
    constructor(){
        if(!Blockchain.instance) {
            this.chain = [];
            this.blockSize = 5;
            this.height = 0;
            this.difficulty = 6;
            this.pendingTransactions = [];
            this.isMining = false;

            Blockchain.instance = this;
            return Blockchain.instance;
        }
    }

    addTransaction(transaction){
        this.pendingTransactions.push(transaction);
        console.log(chalk.hex('#5D3FD3')
            .bold(`Transactions en attente: ${this.pendingTransactions.length}`));
        
        if(this.pendingTransactions.length >= this.blockSize && !this.isMining) {
            //console.log('On mine');

            //Créer un block
            const transactionsToAddInBlock = this.pendingTransactions.splice(0, this.blockSize);
            const newBlock = new Block(this.chain[this.chain.length-1]?.hash, transactionsToAddInBlock);

            this.isMining = true;
            const worker = new Worker('./workers/mine.js', { workerData: {block: newBlock, difficulty: this.difficulty}});
            console.log(chalk.bgHex('#5D3FD3').white(`Mining for Block ${newBlock.timestamp} started`));
            // Attendre sans bloquer le thread
            worker.once('message', result => {
                //Mining terminé
                newBlock.hash = result.hash;
                newBlock.nonce = result.nonce;
                newBlock.height = this.chain.length + 1;

                console.log(chalk.bgHex('#5D3FD3').white(`Block ${newBlock.height} Mined: ${newBlock.hash} - ${newBlock.nonce}`));
                console.log(newBlock);
                this.chain.push(newBlock);

                this.isMining = false;
            });
        }
    }
}

const blockchainInstance = new Blockchain();
Object.seal(blockchainInstance);

export {Block, blockchainInstance as Blockchain};