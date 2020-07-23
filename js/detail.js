import Vue from "vue";

// import jQuery from "jquery";
// window.$ = window.jQuery = jQuery;

(function () {
  "use strict";

  // ===========================================================================
  // 共通変数定義
  // ---------------------------------------------------------------------------

  const IZAKAYA_ENDPOINT = process.env.AP_CONTEXT_PATH + "/izakaya/";

  // ===========================================================================
  // 初期化関数
  //  - イベントハンドラを設定
  //  - アラートを表示 etc
  // ---------------------------------------------------------------------------
  var params = new URL(document.location).searchParams;
  var izakayaId = params.get("id");

  getIzakaya(izakayaId);

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

  function getIzakaya(izakayaId) {
    fetch(IZAKAYA_ENDPOINT + izakayaId, {
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
