const request = require('request');
const crypto = require('crypto');
const http = require('http');
const fs = require('fs');
const fsPath = require('fs-path');
const path = require('path');

var debug = false;

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

sdk.set_debug = function(isDebug) {
  debug = isDebug;
  if (debug) {
    console.debug(tag, "Debug mode is open")
  } else {
    console.debug(tag, "Debug mode is close")
  }
}

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

  if (debug) console.debug(tag, "init API_KEY:" + apikey + " APP_ID:" + appid);

  API_KEY = apikey;
  APP_ID = appid;
}

sdk.register = async (name) => {
  if (!checkInitComplete()) {
    return {
      error: "Api key or App id is not defined"
    };
  }

  if (debug) console.debug(tag, 'register_url:', FW_URL + "/user");
  if (debug) console.debug(tag, 'register_name:', name);

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
            if (debug) console.log("Success to create user:" + data.result.user);
          } else {
            resolve(data);
            if (debug) console.log(err);
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
  if (!checkInitComplete()) {
    return {
      error: "Api key or App id is not defined"
    };
  }

  if (!fs.existsSync(file_path)) {
    return {
      error: "File is not exist"
    };
  }

  var url = FW_URL + "/files"
  if (debug) console.debug(tag, "url:" + url);

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
      if (!error && response.statusCode == 200) {
        resolve(JSON.parse(body));
      } else {
        reject(JSON.parse(body));
      }
    });
  })
}

sdk.delete_file = async (file_name) => {
  if (!checkInitComplete()) {
    return {
      error: "Api key or App id is not defined"
    };
  }

  var url = FW_URL + "/files/" + APP_ID + "/" + file_name
  if (debug) console.debug(tag, "url:" + url)

  var options = {
    url: url,
    headers: {
      'x-api-key': API_KEY,
    },
    method: 'DELETE'
  };

  return new Promise(function(resolve, reject) {
    request(options, function(error, response, body) {
      if (!error && response.statusCode == 200) {
        resolve(JSON.parse(body));
      } else {
        reject(JSON.parse(body));
      }
    });
  })
}

sdk.get_file_hash = async (file_name) => {
  if (!checkInitComplete()) {
    return {
      error: "Api key or App id is not defined"
    };
  }

  var url = FW_URL + "/files/" + APP_ID + "/hash/" + file_name
  if (debug) console.debug(tag, "url:" + url)

  var options = {
    url: url,
    headers: {
      'x-api-key': API_KEY,
    },
    method: 'GET'
  };

  return new Promise(function(resolve, reject) {
    request(options, function(error, response, body) {
      if (!error && response.statusCode == 200) {
        resolve(JSON.parse(body));
      } else {
        reject(JSON.parse(body));
      }
    });
  })
}

sdk.verify_file = async (file_path) => {
  if (!checkInitComplete()) {
    return {
      error: "Api key or App id is not defined"
    };
  }

  if (!fs.existsSync(file_path)) {
    return {
      error: "File is not exist"
    };
  }

  var file_name = path.basename(file_path);

  return new Promise(function(resolve, reject) {
    sdk.get_file_hash(file_name).then(data => {
      var block_chain_hash = data.hash;

      var buffer = fs.readFileSync(file_path);
      var fsHash = crypto.createHash('md5');
      fsHash.update(buffer);
      var file_hash = fsHash.digest('hex');

      if (debug) console.debug(tag, "block_chain_hash:" + block_chain_hash);
      if (debug) console.debug(tag, "file_hash:" + file_hash);

      if (block_chain_hash == file_hash) {
        resolve(JSON.parse("{}"));
      } else {
        reject({
          error: "File is not correct"
        });
      }
    }).catch(err => {
      reject({
        error: "Can't get file hash value"
      });
    })
  })
}

sdk.download_file = async (file_name, downloadDir) => {
  if (!checkInitComplete()) {
    return {
      error: "Api key or App id is not defined"
    };
  }

  var url = FW_URL + "/files/" + APP_ID + "/download/" + file_name
  if (debug) console.debug(tag, "url:" + url)

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
          reject({
            error: "Can't download file: " + file_name
          });
          fs.unlinkSync(downloadDir + "/" + file_name);
        }
      });

      var stream = fs.createWriteStream(downloadDir + "/" + file_name);
      req.pipe(stream);
    } catch (err) {
      reject({
        error: "Can't download file: " + file_name
      });
    }
  })
}

sdk.get_file_list = async (s3_option = {}) => {
  if (!checkInitComplete()) {
    return {
      error: "Api key or App id is not defined"
    };
  }

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
  if (debug) console.debug(tag, "exec get fcn in curd template");
  var args = "[\"" + key + "\"]";
  return sdk.queryChainCode("", "get", args)
}

sdk.set = async (key, value) => {
  if (debug) console.debug(tag, "exec set fcn in curd template");
  var args = "";
  if (typeof value === 'string' || value instanceof String) {
    args = "[\"" + key + "\",\"" + value + "\"]";
  } else {
    value = JSON.stringify(value).replace(/"/g, '\\"')
    args = "[\"" + key + "\",\"" + value + "\"]";
  }
  return sdk.invokeChainCode("", "set", args)
}

sdk.delete = async (key) => {
  if (debug) console.debug(tag, "exec del fcn in curd template");
  var args = "[\"" + key + "\"]";
  return sdk.invokeChainCode("", "delete", args)
}

//====================================
sdk.invokeChainCode = async (user_name, fcn, args) => {
  if (debug) console.debug(tag, "exec invoke chain code");
  var args_var = args;
  if (typeof args === 'array' || Array.isArray(args)) {
    args_var = JSON.stringify(args);
  }
  return execChainCode(CHAIN_CODE_EXEC.INVOKE, user_name, fcn, args_var);
}

sdk.queryChainCode = async (user_name, fcn, args) => {
  if (debug) console.debug(tag, "exec query chain code");
  var args_var = args;
  if (typeof args === 'array' || Array.isArray(args)) {
    args_var = JSON.stringify(args);
  }
  return execChainCode(CHAIN_CODE_EXEC.QUERY, user_name, fcn, args_var);
};

execChainCode = async (exec, user_name, fcn, args) => {

  if (!checkInitComplete()) {
    return {
      error: "Api key or App id is not defined"
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
      if (debug) console.debug(tag, err);
      return {
        error: "Private key is not correct"
      };
    }
  }
  if (debug) {
    console.debug(tag, "apikey:", API_KEY);
    console.debug(tag, 'chain_code_url:', query_url);
    console.debug(tag, 'appid:', APP_ID);
    console.debug(tag, 'user_name:', user_name);
    console.debug(tag, 'user_private_key:', user_private_key);
    console.debug(tag, 'signature:', signature);
    console.debug(tag, 'fcn:', fcn);
    console.debug(tag, 'args:', args);
  }

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

function checkInitComplete() {
  if (!API_KEY || !APP_ID) {
    return false;
  }
  return true;
}

module.exports = sdk;
