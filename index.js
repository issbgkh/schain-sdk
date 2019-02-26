const request = require('request');
const crypto = require('crypto');
const fs = require('fs');
const fsPath = require('fs-path');

const config = require('./config');

const tag = '[scass_sdk.js]';

const sdk = {};

const KEYSTORE = './keystore';
const ACCESS_TOKEN = "dXNlcjE6dXNlcjE=";
const ACCESS_USER = "user1";
const ACCESS_PW = "user1";

var CHAIN_CODE_EXEC = {
  "QUERY": 1,
  "INVOKE": 2
}

sdk.register = async (name) => {
  console.debug(tag, 'register_url:', config.fw_url + "/user");
  console.debug(tag, 'register_name:', name);

  var options = {
    url: config.fw_url + "/user",
    headers: {
      'Authorization': 'Basic ' + new Buffer(ACCESS_USER + ":" + ACCESS_PW).toString("base64")
    },
    formData: {
      name: name
    },
    method: 'POST'
  };

  return new Promise(function(resolve, reject) {
    request(options, function(error, response, body) {
      if (!error && response.statusCode == 200) {
        var data = JSON.parse(body);
        fsPath.writeFile(KEYSTORE + "/" + data.result.user, data.result.private_key, function(err) {
          if (!err) {
            resolve(data);
            console.log("Success to create user:" + data.result.user);
          } else {
            resolve(data);
            console.log(err);
          }
        });
        /*
        console.log(data.result.user);
        console.log(data.result.public_key);
        console.log(data.result.private_key);
        */
      } else {
        reject(error);
      }
    });
  })
};

sdk.invokeChainCode = async (apikey, chain_code_id, user_name, fcn, args) => {
  console.log("exec invoke chain code");
  return execChainCode(CHAIN_CODE_EXEC.INVOKE, chain_code_id, user_name, fcn, args, apikey);
}

sdk.queryChainCode = async (apikey, chain_code_id, user_name, fcn, args) => {
  console.log("exec query chain code");
  return execChainCode(CHAIN_CODE_EXEC.QUERY, chain_code_id, user_name, fcn, args, apikey);
};

execChainCode = async (exec, chain_code_id, user_name, fcn, args, apikey) => {

  if (!fs.existsSync(KEYSTORE + "/" + user_name)) {
    return {
      error: "User is not existed"
    };
  }

  const user_private_key = fs.readFileSync(KEYSTORE + "/" + user_name, 'utf-8');

  var query_url = "";
  if (exec == CHAIN_CODE_EXEC.QUERY) {
    query_url = config.fw_url + "/chaincode/" + chain_code_id + "/query"
  } else if (exec == CHAIN_CODE_EXEC.INVOKE) {
    query_url = config.fw_url + "/chaincode/" + chain_code_id + "/invoke"
  }

  console.debug(tag, "apikey:", apikey);
  console.debug(tag, 'chain_code_url:', query_url);
  console.debug(tag, 'chain_code_id:', chain_code_id);
  console.debug(tag, 'user_name:', user_name);
  console.debug(tag, 'user_private_key:', user_private_key.trim());
  console.debug(tag, 'fcn:', fcn);
  console.debug(tag, 'args:', args);

  const msg = JSON.stringify({
    fcn: fcn,
    args: JSON.parse(args || "[]")
  });

  const signer = crypto.createSign('sha256');
  signer.update(msg);
  signer.end();

  //const key = "-----BEGIN PRIVATE KEY-----\nMIGHAgEAMBMGByqGSM49AgEGCCqGSM49AwEHBG0wawIBAQQg6ILfw4Zm3fECs9C5x2dMO4yEcOH41EsfEh2zfozMMaWhRANCAAQd9GPXR/0C8i643DOhYTyGXUCS0lnAYpx7Lxz0ykbEeGgGf5sJwZ2W9qlbwhBY0j7pSOsXWZe90YzdIYp2su2z\n-----END PRIVATE KEY-----";
  var signature = "";
  try {
    signature = signer.sign(user_private_key).toString("hex");
    console.debug(tag, 'signature:', signature);
  } catch (err) {
    console.error(err);
    return {
      error: "Private key is not correct"
    };
  }

  var options = {
    url: query_url,
    headers: {
      'Authorization': 'Basic ' + new Buffer(ACCESS_USER + ":" + ACCESS_PW).toString("base64"),
      'x-api-key': apikey
    },
    formData: {
      fcn: fcn,
      args: args,
      user: user_name,
      signature: signature
    },
    method: 'POST'
  };

  return new Promise(function(resolve, reject) {
    request(options, function(error, response, body) {
      if (!error && response.statusCode == 200) {
        resolve(JSON.parse(body));
      } else {
        reject(body);
      }
    });
  })
}

module.exports = sdk;
