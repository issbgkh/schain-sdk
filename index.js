const request = require('request');
const crypto = require('crypto');
const http = require('http');
const fs = require('fs');
const fsPath = require('fs-path');
const path = require('path');

const FW_URL = "http://ec2-13-231-26-144.ap-northeast-1.compute.amazonaws.com:9000/v1";

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

var API_KEY = "";
var APP_ID = "";

sdk.init = function(apikey, appid) {
  if (!apikey) {
    return {
      error: "Api key is not defined"
    };
  }

  if (!appid) {
    return {
      error: "App id is not defined"
    };
  }

  console.log("init API_KEY:" + apikey + " APP_ID:" + appid);
  API_KEY = apikey;
  APP_ID = appid;
}

sdk.register = async (name) => {
  console.debug(tag, 'register_url:', FW_URL + "/user");
  console.debug(tag, 'register_name:', name);

  var options = {
    url: FW_URL + "/user",
    headers: {
      'x-api-key': API_KEY
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

//==========File Manager for S3=========
sdk.upload_file = async (file_path) => {
  var url = FW_URL + "/files"
  console.debug(tag, "url:" + url)

  if (!fs.existsSync(file_path)) {
    return {
      error: "File is not exist"
    };
  }

  var options = {
    url: url,
    headers: {
      'x-api-key': API_KEY,
      'Content-Type': 'multipart/form-data'
    },
    formData: {
      id: APP_ID,
      file_key: path.basename(file_path),
      file: fs.createReadStream(file_path)
    },
    method: 'POST'
  };

  return new Promise(function(resolve, reject) {
    request(options, function(error, response, body) {
      console.debug(tag, body);
      if (!error && response.statusCode == 200) {
        resolve(JSON.parse(body));
      } else {
        reject(JSON.parse(body));
      }
    });
  })
}

sdk.delete_file = async (file_name) => {
  var url = FW_URL + "/files/" + APP_ID + "/" + file_name
  console.debug(tag, "url:" + url)

  var options = {
    url: url,
    headers: {
      'x-api-key': API_KEY,
    },
    method: 'DELETE'
  };

  return new Promise(function(resolve, reject) {
    request(options, function(error, response, body) {
      console.debug(tag, body);
      if (!error && response.statusCode == 200) {
        resolve(JSON.parse(body));
      } else {
        reject(JSON.parse(body));
      }
    });
  })
}

sdk.get_file_hash = async (file_name) => {
  var url = FW_URL + "/files/" + APP_ID + "/hash/" + file_name
  console.debug(tag, "url:" + url)

  var options = {
    url: url,
    headers: {
      'x-api-key': API_KEY,
    },
    method: 'GET'
  };

  return new Promise(function(resolve, reject) {
    request(options, function(error, response, body) {
      console.debug(tag, body);
      if (!error && response.statusCode == 200) {
        resolve(JSON.parse(body));
      } else {
        reject(JSON.parse(body));
      }
    });
  })
}

sdk.download_file = async (file_name, downloadDir) => {
  var url = FW_URL + "/files/" + APP_ID + "/download/" + file_name
  console.debug(tag, "url:" + url)

  var options = {
    url: url,
    headers: {
      'x-api-key': API_KEY
    },
    method: 'GET'
  };


  return new Promise(function(resolve, reject) {
    try {
      ensureDirSync(downloadDir);

      var req = request(options, function(error, response, body) {
        if (!error && response.statusCode == 200) {
          resolve(JSON.parse("{}"));
        } else {
          reject("Can't download file: " + file_name);
          fs.unlinkSync(downloadDir + "/" + file_name);
        }
      });

      var stream = fs.createWriteStream(downloadDir + "/" + file_name);
      req.pipe(stream);
    } catch (err) {
      reject("Can't download file: " + file_name);
    }
  })
}

sdk.get_file_list = async (s3_option = {}) => {
  var url = FW_URL + "/files/" + APP_ID;
  var options = {
    url: url,
    headers: {
      'x-api-key': API_KEY
    },
    qs: s3_option,
    method: 'GET'
  };

  return new Promise(function(resolve, reject) {
    var req = request(options, function(error, response, body) {
      if (!error && response.statusCode == 200) {
        resolve(JSON.parse(body));
      } else {
        reject(JSON.parse(body));
      }
    });
  })
}

//==========CURD Template SDK==========
sdk.get = async (key) => {
  console.log("exec get fcn in curd template");
  var args = "[\"" + key + "\"]";
  return sdk.queryChainCode("", "get", args)
}

sdk.set = async (key, value) => {
  console.log("exec set fcn in curd template");
  var args = "[\"" + key + "\",\"" + value + "\"]";
  return sdk.invokeChainCode("", "set", args)
}

sdk.delete = async (key) => {
  console.log("exec del fcn in curd template");
  var args = "[\"" + key + "\"]";
  return sdk.invokeChainCode("", "delete", args)
}

//====================================
sdk.invokeChainCode = async (user_name, fcn, args) => {
  console.log("exec invoke chain code");
  var args_var = args;
  if (typeof args === 'array' || Array.isArray(args)) {
    args_var = JSON.stringify(args);
  }
  return execChainCode(CHAIN_CODE_EXEC.INVOKE, user_name, fcn, args_var);
}

sdk.queryChainCode = async (user_name, fcn, args) => {
  console.log("exec query chain code");
  var args_var = args;
  if (typeof args === 'array' || Array.isArray(args)) {
    args_var = JSON.stringify(args);
  }
  return execChainCode(CHAIN_CODE_EXEC.QUERY, user_name, fcn, args_var);
};

execChainCode = async (exec, user_name, fcn, args) => {

  if (!API_KEY) {
    return {
      error: "Api key is not defined"
    };
  }

  if (!APP_ID) {
    return {
      error: "App id is not defined"
    };
  }

  var query_url = "";
  if (exec == CHAIN_CODE_EXEC.QUERY) {
    query_url = FW_URL + "/chaincode/" + APP_ID + "/query"
  } else if (exec == CHAIN_CODE_EXEC.INVOKE) {
    query_url = FW_URL + "/chaincode/" + APP_ID + "/invoke"
  }

  var user_private_key = "";
  var signature = "";
  if (user_name) {
    if (!fs.existsSync(KEYSTORE + "/" + user_name)) {
      console.log(user_name)
      return {
        error: "User is not existed"
      };
    }

    user_private_key = fs.readFileSync(KEYSTORE + "/" + user_name, 'utf-8');
    user_private_key = user_private_key.trim();

    const msg = JSON.stringify({
      fcn: fcn,
      args: JSON.parse(args || "[]")
    });

    const signer = crypto.createSign('sha256');
    signer.update(msg);
    signer.end();

    //const key = "-----BEGIN PRIVATE KEY-----\nMIGHAgEAMBMGByqGSM49AgEGCCqGSM49AwEHBG0wawIBAQQg6ILfw4Zm3fECs9C5x2dMO4yEcOH41EsfEh2zfozMMaWhRANCAAQd9GPXR/0C8i643DOhYTyGXUCS0lnAYpx7Lxz0ykbEeGgGf5sJwZ2W9qlbwhBY0j7pSOsXWZe90YzdIYp2su2z\n-----END PRIVATE KEY-----";
    try {
      signature = signer.sign(user_private_key).toString("hex");
    } catch (err) {
      console.error(err);
      return {
        error: "Private key is not correct"
      };
    }
  }

  console.debug(tag, "apikey:", API_KEY);
  console.debug(tag, 'chain_code_url:', query_url);
  console.debug(tag, 'appid:', APP_ID);
  console.debug(tag, 'user_name:', user_name);
  console.debug(tag, 'user_private_key:', user_private_key);
  console.debug(tag, 'signature:', signature);
  console.debug(tag, 'fcn:', fcn);
  console.debug(tag, 'args:', args);

  var options = {
    url: query_url,
    headers: {
      'x-api-key': API_KEY
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

function ensureDirSync(dirpath) {
  try {
    fs.mkdirSync(dirpath, {
      recursive: true
    })
  } catch (err) {
    if (err.code !== 'EEXIST') throw err
  }
}

module.exports = sdk;
