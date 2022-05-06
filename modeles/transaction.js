import dayjs from "dayjs";
import crypto from 'crypto';

class Transaction {
    constructor(from, to, amount) {
        this.from = from;
        this.to = to;
        this.amount = amount;
        this.timestamp = dayjs().format()
        this.hash();
    }

    hash() {
        const hash = crypto.createHash('sha256');
        hash.update(JSON.stringify(this));      // hash de this seul ne fonctionne pas bien
        this.hash = hash.digest('hex');    
    }
}

export { Transaction };