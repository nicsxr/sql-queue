import { Queue } from '../index'

var q = new Queue('lib/tests/test.db')

async function delayFunction(){
    await new Promise(r => setTimeout(r, 5000));
}

q.add(delayFunction, [])