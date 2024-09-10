import AWS from 'aws-sdk';
/**

const fs = require('fs');
const path = require('path');
*/
const secretsManager = new AWS.SecretsManager({region: 'us-east-1'});
const amplify = new AWS.Amplify({region: 'us-east-1'});

async function getSecretsValue(secretName){
  try{
    const data = await secretsManager.getSecretValue({SecretId: secretName}).promise();
    console.log("data=>",data);
    if('SecretString' in data){
      console.log("SecretString=>", JSON.parse(data.SecretString));
      const resp = await updateAmplifySecrets("dzyja44gtci76","main",JSON.parse(data.SecretString));
      console.log("resp=>",resp);
    }
  }catch(error){
    console.error("error=>",error);
  }
}

const secret = await getSecretsValue("my-amplify-secret");

async function updateAmplifySecrets(appId,envName,secretValues){
  try{
    const updatedVars = { ...secretValues };
    console.log("updatedVars=>",updatedVars);
    const params = {
      appId: appId,
      branchName: envName,
      enviromentVariables: updatedVars,
    }
    const updateData = await amplify.updateBranch(params).promise();
    console.log("updateData=>",updateData);
    return updateData;
  }catch(error){
    console.error("error=>",error);
  }
}
