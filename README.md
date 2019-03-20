# schain-sdk

SChain Javascript SDK

## Prerequisite
An API Key and an App ID are required while using the SDK. Read the [Get started](https://github.com/issbgkh/schain-get-started) guide to get them.

## Install package
* npm i schain_sdk

## Usage

### Import package
```javascript
const schain = require('schain_sdk');
```
### Initialize
```javascript
const API_Key = '5d5b9cbd55cc6725f82dabba0632fe6e';
const App_ID = 'app-38b30623-c207-4025-8c80-69df51f822c2';

schain.init(API_Key, App_ID)
```
### Register an user
```javascript
let username = 'user01';

await schain.register(username).then(data => {
    console.log('done');
}).catch(error => {
    console.log(error);
});
```
### Invoke chaincode
```javascript
// Specify an user identity that is used to invoke the chaincode.
// A null value is allowed if user identity is not that important for this function.
let username = 'user01';

// The function name to be invoked
let func = 'invoke';

// The arguments to be passed to the function
let args = '["a", "b", "c"]';

await scass_sdk.invokeChainCode(username, func, args).then(data => {
    console.log('done');
}).catch(error => {
    console.log(error);
});
```
### Query chaincode
```javascript
// Specify an user identity that is used to query the chaincode
// A null value is allowed if user identity is not that important for this function.
let username = 'user01';

// The function name to be invoked for querying
let func = 'query';

// The arguments to be passed to the function
let args = '["a"]';

await schain.queryChainCode(username, func, args).then(data => {
    console.log('done');
}).catch(error => {
    console.log(error);
});
```

## Simple store template
The SDK provides a set of convenient functions that support the [simple store chaincode template.](https://github.com/issbgkh/simple-store)

### Set a value
```javascript
let key = 'key1';
let value = '100';

await schain.set(key, value).then(result => {
    console.log('done');
}).catch(error => {
  res.send(error);
});
```

### Get a value
```javascript
let key = 'key1';

await schain.get(key).then(value => {
    console.log('a=' + value);
}).catch(error => {
    console.log(error);
});
```

### Delete a value
```javascript
let key = 'key1';

await schain.delete(key).then(result => {
    console.log(result);
}).catch(error => {
    console.log(error);
});
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
