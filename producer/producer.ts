const readline = require('readline');
const { Kafka } = require('kafkajs');
require('dotenv').config({ path: '../.env' });


const kafka = new Kafka({
  clientId: 'k-producer',
  brokers: [`${process.env.KAFKA_BROKER_IP}:${process.env.KAFKA_BROKER_PORT_1}`]
})

const producer = kafka.producer();


const main = async () => {
  await producer.connect();
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });

  rl.on('line', async (data: any) => {
    console.log("output => ", data)
    await producer.send({
      topic: 'all',
      messages: [
        {value: data}
      ]
    })
  })
}

main();