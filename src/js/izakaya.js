import Vue from "vue";

import jQuery from "jquery";
window.$ = window.jQuery = jQuery;

(function () {
  "use strict";

  // ===========================================================================
  // 共通変数定義
  // ---------------------------------------------------------------------------

  const IZAKAYA_ENDPOINT =
    process.env.AP_CONTEXT_PATH + "/出店情報/出店情報一覧を参照する";

  // ===========================================================================
  // 初期化関数
  //  - イベントハンドラを設定
  //  - アラートを表示 etc
  // ---------------------------------------------------------------------------
  getIzakayaList();

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
              //画面表示用に開店時間、閉店時間のフォーマットを変換する
              responseData[i].var開店時間 = _changeFormatDateToDisplay(
                responseData[i].var開店時間
              );
              responseData[i].var閉店時間 = _changeFormatDateToDisplay(
                responseData[i].var閉店時間
              );

              responseData[i]["表示パターン"] = _createDisplayPattern(
                responseData[i].varVoステータス.varステータス,
                responseData[i].varVoチケット購入形態.varチケット購入形態,
                responseData[i].var席数,
                responseData[i].var埋まっている席数,
                responseData[i].var合言葉設定
              );
            });
            this.izakaya_list = responseData;
          },
        });
      })
      .catch((err) => {
        console.log(err);
      });
  }

  function _createDisplayPattern(
    status,
    ticketPattern,
    seat,
    filledSeat,
    合言葉設定
  ) {
    let displayPattern;

    //表示しないパターンのものはバックエンドからの返却は行われない想定。
    //念のため処理を記載

    switch (status) {
      case "申請中":
        return "表示しない";

      case "承認済み_Zoomミーティングルーム準備中":
        return "表示しない";

      case "承認済み_出店可能状態":
        if (seat == filledSeat) {
          return "満席";
          break;
        }
        if (合言葉設定) {
          return "VIP限定ラウンジ";
        }
        if (ticketPattern == "ふらっと型") {
          return "開店待ち";
          break;
        }
        if (ticketPattern == "予約抽選型") {
          return "抽選受付中";
          break;
        }

        if (ticketPattern == "予約先着型") {
          return "予約受付中";
          break;
        }
      case "キャンセル_店主都合":
        return "表示しない";
        break;

      case "キャンセル_システム都合":
        return "表示しない";
        break;

      case "開店中":
        if (seat == filledSeat) {
          return "満席";
          break;
        }
        if (合言葉設定) {
          return "VIP限定ラウンジ";
        }
        if (ticketPattern == "ふらっと型") {
          return "開店中";
        }
        if (ticketPattern == "予約抽選型") {
          return "開店中";
          break;
        }

        if (ticketPattern == "予約先着型") {
          return "開店中";
          break;
        }
        break;

      case "Close":
        return "Close";
        break;
    }
  }

  function _changeFormatDateToDisplay(pDate) {
    let _date = new Date(pDate + "+09:00");
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
