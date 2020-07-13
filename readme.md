# オンライン横丁 フロントエンド

## デプロイ先URL

* masterブランチのデプロイ環境
  * https://cranky-bell-765f86.netlify.app/
* developブランチのデプロイ環境
  * https://develop--cranky-bell-765f86.netlify.app/


## 開発環境整備

```console:bash
$ npm install

```

## ローカルサーバ立ち上げ

ローカル確認用のWebサーバに `live-server`  というものを使用しています。
以下のコマンドでインストールしてください。
` $ npm install -g live-server` 

```console:bash
❯ npm run dev

> echo "コンテンツは https://localhost.re-era.tech:8080/ で確認できます。
 下の127.〜は無視してください. " && live-server . --host=0.0.0.0 --ignore='.git/**' --https=https.conf.js --no-browser

コンテンツは https://localhost.re-era.tech:8080/ で確認できます。
 下の127.〜は無視してください.

(-> localhost.re-era.tech:8080/ で確認できる)
```

## 環境差異の扱い

なるべくenv.jsに寄せる。
関数と変数の形で環境ごとに変わるのもを定義する。
環境差異を扱うJavaScript側で`env.js`をimportし、
`ENV_NAME`の値を見て分岐させるなど。

```js:env.js
const ENV_VARS = {
  ENV_NAME: "staging",

// (略)

let COM_FUNC = {
  hello: function (e) {

export { ENV_VARS, COM_FUNC };
```