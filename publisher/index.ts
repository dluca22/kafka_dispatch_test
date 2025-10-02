const { createInterface } = require('node:readline');// import { Kafka } from 'kafkajs';


const main = async () => {
  const rl = createInterface({
    input: process.stdin,
    output: process.stdout
  });

  rl.on('line', (data: any) => {
    console.log(data)
  })
}

main();