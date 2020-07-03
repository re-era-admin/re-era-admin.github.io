# オンライン横丁 フロントエンド

## URL

* masterブランチのデプロイ環境
  * https://cranky-bell-765f86.netlify.app/
* developブランチのデプロイ環境
  * https://develop--cranky-bell-765f86.netlify.app/


## 開発環境整備

```console:bash
$ npm install

```

## ローカルサーバ立ち上げ

ローカル確認用のWebサーバに`live-server` というものを使用しています。
以下のコマンドでインストールしてください。
` $ npm install -g live-server` 

```console:bash
❯ npm run dev

> online-yokocho-front@1.0.0 dev (git cloneディレクトリ)
> live-server . --host=0.0.0.0 --ignore=.git

Serving "." at http://127.0.0.1:8080
Ready for changes

(localhost:8080/ で確認できる)
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