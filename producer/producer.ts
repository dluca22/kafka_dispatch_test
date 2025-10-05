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
  await producer.send({
    topic: 'all',
    messages: [
      {value: data}
    ]
  });

  if(isNum(data[0])) {
    console.log( '### juwst to all >  ',  ) // MA SIIII che basta che va
  } else if (startsInVowel(data[0])) {
    topicsToSend.push('vowel');
    console.log( '### sentTo vowel >  ',  ) // MA SIIII che basta che va
  } else {
    topicsToSend.push('consonant');
    console.log( '### sentTo CONSONANT >  ',  ) // MA SIIII che basta che va
  }
  
  topicsToSend.forEach(async (to) => {
    await producer.send({
      topic: to,
      messages: [
        {value: data}
      ]
    });
  })
  // console.log( '### sent to kafka >  ' ) // MA SIIII che basta che va
}

function startsInVowel(char: string){
  const vowels = ['a', 'e', 'i', 'o', 'u'];
  return vowels.includes(char.toLowerCase());
}

function isNum(char:string){
  let num = parseInt(char);

  return num != undefined || !isNaN(num);
}

// function test(){
//   let word = 'culo';
// }
main();
// test();