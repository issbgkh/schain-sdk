# schain-sdk

A Javascript sdk for schain

## SDK usage
### Compatibility
The SDK itself is implemented in Javscript

### Install
1) npm i schain_sdk

### Prepare chaincode id & apikey
Browse [developer console](http://ec2-13-231-26-144.ap-northeast-1.compute.amazonaws.com/). and create an app in My app then get chaincode id and get api key in profile.

### Use the SDK

#### Import schain_sdk in js
const schain = require('schain_sdk');

#### Register user
let result = await schain.register(USER_NAME, APIKEY);

#### Invoke chain code
let result = await schain.invokeChainCode(APIKEY, CHAINCODE_ID, USER_NAME, FUNCTION, ARGS);

#### Query chain code
let result = await schain.queryChainCode(APIKEY, CHAINCODE_ID, USER_NAME, 'FUNCTION', ARGS);

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
