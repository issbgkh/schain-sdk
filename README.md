# SChain Javascript SDK

透過 SChain Javascript SDK，開發者可撰寫應用程式來存取區塊鍊中的 Chaincode 代碼。

## 前置作業

開始使用 SDK 之前，你需要先在開發者中心取得 API KEY 及 APP ID。

若你尚未閱讀 [Get started](https://github.com/issbgkh/schain-get-started)，我們強烈建議你立即前往。

## 安裝套件
```javascript
npm i schain_sdk
```

## 引入套件

```javascript
const schain = require('schain_sdk');
```
## 初始化
```javascript
// 請貼上你的 API KEY 及 APP ID
const API_KEY = '5d5b9cbd55cc6725f82dabba0632fe6e';
const APP_ID = 'app-38b30623-c207-4025-8c80-69df51f822c2';

schain.init(API_KEY, APP_ID)
```


# 資料儲存樣板

SDK 特別提供了存取 [資料儲存樣板](https://github.com/issbgkh/simple-store) 的函數接口。

### 寫入一個 key-value 鍵值
```javascript
let key = 'key1';
let value = '100';

await schain.set(key, value).then(result => {
    console.log('done');
}).catch(error => {
    console.log(error);
});
```

### 取得一個鍵值
```javascript
let key = 'key1';

await schain.get(key).then(value => {
    console.log('value=' + value);
}).catch(error => {
    console.log(error);
});
```

### 刪除一個鍵值
```javascript
let key = 'key1';

await schain.delete(key).then(result => {
    console.log(result);
}).catch(error => {
    console.log(error);
});
```


# 存取自行撰寫的 Chaincode 代碼

SDK 也提供了方法來存取你自行撰寫的 Chaincode 代碼函數。

### 註冊使用者身份
若你的應用程式需要區隔不同的使用者身份，可以使用 **register** 函數來創建使用者身份。

```javascript
let username = 'user01';

await schain.register(username).then(result => {
    console.log('done');
}).catch(error => {
    console.log(error);
});
```

### 更新分散式帳本
透過調用 Chaincode 函數來更新分散式帳本。

```javascript
// 指名要用來調用此函數的使用者身份
// 可設定為 null，表示要調用的函數無需區分使用者身份
let username = 'user01';

// 要調用的函數名稱
let func = 'invoke';

// 函數參數
let args = ['a', 'b', 'c'];

await schain.invokeChainCode(username, func, args).then(result => {
    console.log('done');
}).catch(error => {
    console.log(error);
});
```

### 查詢分散式帳本
透過調用 Chaincode 函數來查詢分散式帳本。

```javascript
// 指名要用來調用此函數的使用者身份
// 可設定為 null，表示要調用的函數無需區分使用者身份
let username = 'user01';

// 要調用的函數名稱
let func = 'query';

// 函數參數
let args = ['a'];

await schain.queryChainCode(username, func, args).then(result => {
    console.log(result);
}).catch(error => {
    console.log(error);
});
```

# 檔案儲存管理
SDK提供檔案管理的方法, 即可對檔案上傳, 下載, 刪除以及取得檔案Hash值與清單列表, 提供100MB空間供開發者使用

### 上傳檔案
```javascript
//file為上傳的檔案物件
let file = [file_object];

await schain.upload_file(file).then(result => {
  res.send(result);
}).catch(error => {
  res.send(error);
})
```

### 刪除檔案
```javascript
//file_name為要刪除的檔案名稱
let file_name = "file.jpg";

await schain.delete_file(file_name).then(result => {
  res.send(result);
}).catch(error => {
  res.send(error);
})
```

### 取得檔案Hash值
```javascript
//file_name為要取得Hash值的檔案名稱
let file_name = "file.jpg";

await schain.get_file_hash(file_name).then(result => {
  res.send(result);
}).catch(error => {
  res.send(error);
})
```

### 下載檔案
```javascript
//file_name為要下載的檔案名稱
let file_name = "file.jpg";

//path為下載儲存檔案的路徑, 本範例會在根目錄下建立download資料夾存放檔案
let path = "download";

await schain.download_file(file_name, path).then(data => {
  res.send(data);
}).catch(error => {
  res.send(error);
})
```

### 取得檔案清單
```javascript
//options為取得檔案清單規則的條件設定
var options = {
  maxKeys: 1000,
  prefix: "prifix_key",
  startAfter: "file_key",
  continuationToken: "token",
  delimiter: "group_key",
  encodingType: 'url'
};

//設定檔案清單規則
await schain.get_file_list(options).then(data => {
  res.send(data);
}).catch(error => {
  res.send(error);
})

//不設定檔案清單規則
await schain.get_file_list().then(data => {
  res.send(data);
}).catch(error => {
  res.send(error);
})
```
options 詳細設定說明請參考 [Aws S3官方文件](https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/S3.html#listObjectsV2-property)

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
