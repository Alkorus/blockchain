import crypto from 'crypto';
import { parentPort, workerData } from 'worker_threads';

const block = workerData.block;
const difficulty = workerData.difficulty;

do{

    block.nonce++;
    block.hash = hash(block);

} while(block.hash.substring(0, difficulty) != Array(difficulty+1).join(0))

parentPort.postMessage({hash: block.hash, nonce:block.nonce});

function hash(toHash) {
    const sha256Hasher = crypto.createHash('sha256');
    sha256Hasher.update(JSON.stringify(toHash));
    return sha256Hasher.digest('hex');
}