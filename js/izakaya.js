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
  getIzakayaList();

  window.addEventListener("DOMContentLoaded", function () {
    console.log("dom content loaded");
    document
      .getElementById("link-out")
      .addEventListener("click", handlers.clickBuyLink);
  });
  // ===========================================================================
  // イベントハンドラ関数定義
  // ---------------------------------------------------------------------------

  var handlers = {
    clickBuyLink: function (e) {
      window.location.href = "/index.html";
    },
  };

  // ===========================================================================
  // 関数定義 (イベントハンドラ以外)
  // ---------------------------------------------------------------------------

  function getIzakayaList() {
    fetch(IZAKAYA_ENDPOINT, {
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
        var vm = new Vue({
          el: "#izakaya-content",
          data: {
            izakaya_list: [],
          },
          mounted() {
            this.izakaya_list = data;
          },
        });
      })
      .catch((err) => {
        console.log(err);
      });
  }
})();
