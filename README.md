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
#### Init apikey and chain code
```javascript
schain.init(APIKEY, CHAINCODE_ID)
```
#### Register user
```javascript
let result = await schain.register(USER_NAME);
```
#### Invoke chain code
```javascript
let result = await schain.invokeChainCode(USER_NAME, FUNCTION, ARGS);
```
#### Query chain code
```javascript
let result = await schain.queryChainCode(USER_NAME, FUNCTION, ARGS);
```

### Use the SDK for CRUD Template

#### Init apikey and chain code
```javascript
schain.init(APIKEY, CHAINCODE_ID)
```
#### get value
```javascript
let result = await schain.get(KEY);

e.g.
await schain.get("a").then(data => {
  res.send(data);
}).catch(error => {
  res.send(error);
})
```
#### set value
```javascript
let result = await schain.set(KEY, VALUE);

e.g.
await schain.set("a", "10").then(data => {
  res.send(data);
}).catch(error => {
  res.send(error);
})
```
#### delete value
```javascript
let result = await schain.delete("KEY");

e.g.
await schain.delete("a").then(data => {
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
