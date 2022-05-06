import Chance from 'chance';
import { Transaction } from './modeles/transaction.js';
import { Blockchain } from './modeles/blockchain.js';

const chance = new Chance();
const delay = ms => new Promise(resolve => setTimeout(resolve, ms));

while(true) {
    Blockchain.addTransaction(generateTransactions());
    const nextTransactionIn = chance.integer({min: 1000, max: 3000});
    console.log(`Next transaction in: ${nextTransactionIn} ms`);
    await delay(nextTransactionIn);
}

function generateTransactions(){
    const users = chance.unique(chance.character, 2, {pool: 'ABCDWXYZ'});
    const amount = chance.floating({min:1, max:42});

    return new Transaction(users[0], users[1], amount);
}