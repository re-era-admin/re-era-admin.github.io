import Vue from "vue";

import jQuery from "jquery";
window.$ = window.jQuery = jQuery;

(function () {
  "use strict";

  // ===========================================================================
  // 共通変数定義
  // ---------------------------------------------------------------------------

  const IZAKAYA_ENDPOINT =
    process.env.AP_CONTEXT_PATH + "/店主メニュー/自分の出店予定を参照する";

  // ===========================================================================
  // 初期化関数
  //  - イベントハンドラを設定
  //  - アラートを表示 etc
  // ---------------------------------------------------------------------------
  getIzakayaList();

  window.addEventListener("DOMContentLoaded", function () {
    console.log("dom content loaded");
  });
  // ===========================================================================
  // イベントハンドラ関数定義
  // ---------------------------------------------------------------------------

  var handlers = {};

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
      .then((responseData) => {
        var vm = new Vue({
          el: "#izakaya-content",
          data: {
            izakaya_list: [],
          },
          mounted() {
            //画面表示用にデータを加工
            Object.keys(responseData).forEach(function (i) {
              //   //画面表示用に開店時間、閉店時間のフォーマットを変換する
              //   responseData[i].var開店時間 = _changeFormatDateToDisplay(
              //     responseData[i].var開店時間
              //   );
              //   responseData[i].var閉店時間 = _changeFormatDateToDisplay(
              //     responseData[i].var閉店時間
              //   );
              //   responseData[i]["表示パターン"] = _createDisplayPattern(
              //     responseData[i].varVoステータス.varステータス,
              //     responseData[i].varVoチケット購入形態.varチケット購入形態,
              //     responseData[i].var席数,
              //     responseData[i].var埋まっている席数
              //   );
            });
            this.izakaya_list = responseData;
          },
        });
      })
      .catch((err) => {
        console.log(err);
      });
  }

  function _changeFormatDateToDisplay(pDate) {
    let _date = new Date(pDate);
    let _formatedDate;

    const wNames = ["日", "月", "火", "水", "木", "金", "土"];

    _formatedDate =
      _date.getFullYear() +
      "/" +
      ("00" + (_date.getMonth() + 1)).slice(-2) +
      "/" +
      ("00" + _date.getDate()).slice(-2) +
      "(" +
      wNames[_date.getDay()] +
      ") " +
      ("00" + _date.getHours()).slice(-2) +
      ":" +
      ("00" + _date.getMinutes()).slice(-2);

    return _formatedDate;
  }
})();
