# オンライン横丁 フロントエンド

## デプロイ先URL

* masterブランチのデプロイ環境
  * https://yokocho.flatto.online/
  * https://cranky-bell-765f86.netlify.app/
    * flatto.onlineの元URL
* developブランチのデプロイ環境
  * https://develop--cranky-bell-765f86.netlify.app/


## 開発環境整備

```console:bash
$ npm install

```

## ローカルサーバ立ち上げ

BundlerであるParcelのWebサーバ機能を用いています.
以下のコマンドでインストール、立ち上げしてください。
```console:bash
$ git clone (repo-url)
$ npm install 
$ npm run dev
```

コンテンツは https://localhost.re-era.tech:8080/index.html で確認できます。

## 環境差異の扱い

dotenvの仕組みをparcel経由で利用しています。
`.env.(環境名)` のファイル名です。
環境名部分には `NODE_ENV` の値が入ります。
現在は4つのKey-valueを提供しています。

herokuのAPIサーバを使う場合、AP_CONTEXT_PATH を.staging の値で置き換えます。
` => AP_CONTEXT_PATH=https://stg-online-yokocho.herokuapp.com `

```config:.env.development
ENV_NAME=local
ENV_TEXT=ローカル環境
CONTEXT_PATH=https://localhost.re-era.tech:8080/
AP_CONTEXT_PATH=https://localhost.re-era.tech:8443
```