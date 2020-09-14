import Vue from "vue";

// import jQuery from "jquery";
// window.$ = window.jQuery = jQuery;

(function () {
  "use strict";

  // ===========================================================================
  // 共通変数定義
  // ---------------------------------------------------------------------------

  const IZAKAYA_ENDPOINT =
    process.env.AP_CONTEXT_PATH + "/出店情報/出店情報詳細を参照する/";

  // ===========================================================================
  // 初期化関数
  //  - イベントハンドラを設定
  //  - アラートを表示 etc
  // ---------------------------------------------------------------------------
  var params = new URL(document.location).searchParams;
  var 出店情報Id = params.get("id");

  getIzakaya(出店情報Id);

  window.addEventListener("DOMContentLoaded", function () {
    console.log("dom loaded");
  });

  // ===========================================================================
  // イベントハンドラ関数定義
  // ---------------------------------------------------------------------------

  var handlers = {};
  // ===========================================================================
  // 関数定義 (イベントハンドラ以外)
  // ---------------------------------------------------------------------------

  function getIzakaya(出店情報Id) {
    fetch(IZAKAYA_ENDPOINT + 出店情報Id, {
      method: "GET",
      mode: "cors",
    })
      .then((response) => {
        if (!response.ok) {
          throw Error(response.statusText);
        }
        return response.json();
      })
      .then((data) => {
        console.log(data);
        var vm = new Vue({
          el: "#izakaya-content",
          data: {
            izakaya: [],
          },
          mounted() {
            this.izakaya = data;
          },
        });
      })
      .catch((err) => {
        console.log(err);
      });
  }
})();
