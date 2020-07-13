import { ENV_VARS, COM_FUNC } from "/common/js/env.js";

let datas;
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
    getIzakayaList();

    // その他の初期化処理
  });

  // ===========================================================================
  // イベントハンドラ関数定義
  // ---------------------------------------------------------------------------

  function submitHandler(event) {}

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
        console.log(data[0]);
        datas = data;

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
