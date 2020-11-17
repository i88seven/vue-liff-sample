# vue-liff-sample

LINE API 実践ガイドの 4-2 をハンズオンとして実装してみました。

## Getting started

### Client 起動

```
$ cd client
$ python -m http.server
```

### Server 起動

```
$ cd server
$ npm run start
```

## ローカルへのアクセスを公開

ngrok などを使って起動した Server へのアクセスを公開する。
`client/main.js` の `API_HOST` に Server の URL を指定。

## LIFF の結びつけ

ngrok などを使って起動した Client へのアクセスを公開する。
LIFF(LINE Frontend Framework) で、起動した Client を表示するように設定。
`client/main.js` の `LIFF＿ID` に発行された LIFF ID を 指定。
