const AWS = require('aws-sdk');
/**

const fs = require('fs');
const path = require('path');
*/
const secretsManager = new AWS.SecretsManager({region: 'us-east-1'});

async function getSecretsValue(secretName){
  try{
    const data = await secretsManager.getSecretValue({SecretId: secretName}).promise();
    console.log("data=>",data);
  }catch(error){
    console.error("error=>",error);
  }
}

const secret = await getSecretsValue("my-amplify-secret");
console.log("secret=>",secret);
