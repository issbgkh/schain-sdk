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

e.g.
schain.init('5d5b9cbd55cc6725f82dabba0632fe6e', 'app-38b30623-c207-4025-8c80-69df51f822c2')
```
#### Register user
```javascript
let result = await schain.register(USER_NAME);

e.g.
let result = await schain.register('user01');
```
#### Invoke chain code
```javascript
let result = await schain.invokeChainCode(USER_NAME, FUNCTION, ARGS);

e.g.
let result = await schain.invokeChainCode('user01', 'invoke', '["a","b","10"]');
```
#### Query chain code
```javascript
let result = await schain.queryChainCode(USER_NAME, FUNCTION, ARGS);

e.g.
let result = await schain.queryChainCode('user01','query', '["a"]');
```

### Use the SDK for CRUD Template

#### Init apikey and chain code
```javascript
schain.init(APIKEY, CHAINCODE_ID)

e.g.
schain.init('5d5b9cbd55cc6725f82dabba0632fe6e', 'app-a017cda3-c1fc-4d47-9b9b-bbe3ac32969c')
```
#### get value
```javascript
let result = await schain.get(KEY);

e.g.
await schain.get('a').then(data => {
  res.send(data);
}).catch(error => {
  res.send(error);
})
```
#### set value
```javascript
let result = await schain.set(KEY, VALUE);

e.g.
await schain.set('a', '10').then(data => {
  res.send(data);
}).catch(error => {
  res.send(error);
})
```
#### delete value
```javascript
let result = await schain.delete(KEY);

e.g.
await schain.delete('a').then(data => {
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
