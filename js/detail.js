import { ENV_VARS, COM_FUNC } from "/common/js/env.js";

(function () {
  "use strict";

  // ===========================================================================
  // 共通変数定義
  // ---------------------------------------------------------------------------

  const IZAKAYA_ENDPOINT = ENV_VARS.AP_CONTEXT_PATH + "/izakaya/";

  // ===========================================================================
  // 初期化関数
  //  - イベントハンドラを設定
  //  - アラートを表示 etc
  // ---------------------------------------------------------------------------
  $(function init() {
    var params = new URL(document.location).searchParams;
    var izakayaId = params.get("id");

    console.log("id :", izakayaId);

    getIzakaya(izakayaId);

    document
      .getElementById("link-out")
      .addEventListener("click", handlers.clickBuyLink);
  });

  // ===========================================================================
  // イベントハンドラ関数定義
  // ---------------------------------------------------------------------------

  var handlers = {
    clickBuyLink: function (e) {
      window.location.href = "/page/izakaya.html";
    },
  };
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
