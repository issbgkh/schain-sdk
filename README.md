# schain-sdk

A Javascript sdk for schain

## SDK usage
### Compatibility
The SDK itself is implemented in Javscript

### Install
* npm i schain_sdk

### Prepare chaincode id & apikey
Browse [developer console](http://ec2-13-231-26-144.ap-northeast-1.compute.amazonaws.com/). and create an app in My app then get chaincode id and get api key in profile.

### Use the SDK

#### Import schain_sdk in js
```javascript
const schain = require('schain_sdk');
```
#### Register user
```javascript
let result = await schain.register(USER_NAME, APIKEY);
```
#### Invoke chain code
```javascript
let result = await schain.invokeChainCode(APIKEY, CHAINCODE_ID, USER_NAME, FUNCTION, ARGS);
```
#### Query chain code
```javascript
let result = await schain.queryChainCode(APIKEY, CHAINCODE_ID, USER_NAME, FUNCTION, ARGS);
```

### Use the SDK for CRUD Template

#### get value
```javascript
let result = await schain.get(APIKEY, CHAINCODE_ID, ARGS);

e.g.
await schain.get("5d5b9cbd55cc6725f82dabba0632fe6e", "app-a017cda3-c1fc-4d47-9b9b-bbe3ac32969c",  ["a"]).then(data => {
  res.send(data);
}).catch(error => {
  res.send(error);
})
```
#### set value
```javascript
let result = await schain.set(APIKEY, CHAINCODE_ID, ARGS);

e.g.
await schain.set("5d5b9cbd55cc6725f82dabba0632fe6e", "app-a017cda3-c1fc-4d47-9b9b-bbe3ac32969c",  ["a","1"]).then(data => {
  res.send(data);
}).catch(error => {
  res.send(error);
})
```
#### delete value
```javascript
let result = await schain.delete(APIKEY, CHAINCODE_ID, ARGS);

e.g.
await schain.delete("5d5b9cbd55cc6725f82dabba0632fe6e", "app-a017cda3-c1fc-4d47-9b9b-bbe3ac32969c",  ["a"]).then(data => {
  res.send(data);
}).catch(error => {
  res.send(error);
})
```

## License
Copyright 2019 S-Chain Technologies Limited

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
