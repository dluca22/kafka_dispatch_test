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
    if(data.length){
      await dispatchToTopics(data);
    }
  })
}

async function dispatchToTopics(data: string): Promise<void>{
  let topicsToSend = ['all'];
  const firstChar = data[0];
  if(isNum(firstChar)) {
    console.log( '### just sending to "all" topic')
  } else if (startsInVowel(firstChar)) {
    topicsToSend.push('vowel');
    console.log( '### sentTo "vowel" & "all" topic')
  } else {
    topicsToSend.push('consonant');
    console.log( '### sentTo "consonant" & "all" topic')
  }
  
  topicsToSend.forEach(async (to) => {
    await producer.send({
      topic: to,
      messages: [
        {value: data}
      ]
    });
  })
  
}

function startsInVowel(char: string){
  const vowels = ['a', 'e', 'i', 'o', 'u'];
  return vowels.includes(char.toLowerCase());
}

function isNum(char:string){
  let num = parseInt(char);

  return num != undefined && !isNaN(num);
}

main();