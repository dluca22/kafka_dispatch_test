const { Kafka } = require('kafkajs')
require('dotenv').config({ path: '../.env' });

const kafka = new Kafka({
  clientId: 'k-consumer',
  brokers: [`${process.env.KAFKA_BROKER_IP}:${process.env.KAFKA_BROKER_PORT_1}`]
})

const consumer = kafka.consumer({ groupId: 'test-consumer' });

const main = async () => {
  const consumerTopic = process.argv[3];

  if (!consumerTopic){
    console.error('MISSING ARGV FOR TOPIC=')
    process.exit(99);
  }
  try {
    await consumer.connect();
    await consumer.subscribe({
      topic: consumerTopic, 
      fromBeginning: true
    })

    await consumer.run({
      eachMessage: async ({topic, partition, message}) => {
        console.log( message.value.toString() );
      }
      
    })
  } catch (error) {
    console.error(error);
  }
}

main();