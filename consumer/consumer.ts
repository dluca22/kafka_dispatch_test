const { Kafka } = require('kafkajs')
require('dotenv').config({ path: '../.env' });

const kafka = new Kafka({
  clientId: 'k-consumer',
  brokers: [`${process.env.KAFKA_BROKER_IP}:${process.env.KAFKA_BROKER_PORT_1}`]
})

const consumer = kafka.consumer();

const main = async () => {
  await consumer.connect();
}

main();