const { Kafka } = require('kafkajs');
require('dotenv').config({ path: '../.env' });


const TOPICS: string[] = ['all', 'vowel', 'consonant']; // move to external config

const kafka = new Kafka({ 
  clientId: 'kafka-admin',
  brokers: [`${process.env.KAFKA_BROKER_IP}:${process.env.KAFKA_BROKER_PORT_1}`]
})

const ADMIN = kafka.admin();

const main = async () => {


  try {
    await ADMIN.connect();
    
    const topicsCheck = await checkAppTopics();
    console.log("Admin running check of topics ", topicsCheck)
 
  } catch (error) {
    console.log('FAILED SOMETHING! ', error);
  }
}


async function checkAppTopics() {
  let result:boolean = false;
  let missingTopicsList: string[] = [];

  let runningTopics: string[] = await ADMIN.listTopics();
  console.log('rT', runningTopics);
  TOPICS.forEach( top => {
    if(runningTopics.includes(top) == false){
      missingTopicsList.push(top);
    }
  })

  if(missingTopicsList.length){
    console.log( "these topics are missing ", missingTopicsList );
    result = await createListOfTopics(missingTopicsList);
  }

  return result;
}

async function createListOfTopics(list: string[]): Promise<boolean> {
  try {

    await ADMIN.createTopics({
      topics: list.map(t => ({ 
        topic: t,
        numPartitions: 1,
        replicationFactor: 1,
        configEntries: [
          { name: 'cleanup.policy', value: 'delete' },
          { name: 'retention.ms', value: '300000' }
        ]
      }))
    });
    console.log( "done", list );
    return true;
  } catch (error) {
    console.log( "Errors while creating the topics list", error );
    return false;
  }
}

// function test(){
//   console.log(process.env.KAFKA_BROKER_IP);
//   console.log(process.env.KAFKA_BROKER_PORT_1);
// }

// test();
main();