import Vue from "vue";

// import jQuery from "jquery";
// window.$ = window.jQuery = jQuery;

(function () {
  "use strict";

  // ===========================================================================
  // 共通変数定義
  // ---------------------------------------------------------------------------

  const TICKET_ENDPOINT =
    process.env.AP_CONTEXT_PATH +
    "/出店情報/クッションUrlに紐づくチケット情報を参照する/";

  let 開店時間;
  let 表示状態 = "非表示";

  // ===========================================================================
  // 初期化関数
  //  - イベントハンドラを設定
  //  - アラートを表示 etc
  // ---------------------------------------------------------------------------
  var params = new URL(document.location).searchParams;
  var リダイレクトId = params.get("id");

  リダイレクト情報を取得する(リダイレクトId);

  // ===========================================================================
  // イベントハンドラ関数定義
  // ---------------------------------------------------------------------------

  var handlers = {};

  // ===========================================================================
  // 関数定義 (イベントハンドラ以外)
  // ---------------------------------------------------------------------------

  function リダイレクト情報を取得する(リダイレクトId) {
    fetch(TICKET_ENDPOINT + リダイレクトId, {
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
        開店時間 = new Date(data.var開店時間);
        console.log("debug", data, 開店時間);
        let フォーマット済み日時 = 日時フォーマット(開店時間);
        var vm = new Vue({
          el: "#cushion-content",
          data: {
            data: [],
            開店時間_formatted: フォーマット済み日時,
            表示状態: 表示状態,
          },
          mounted() {
            this.data = data;
          },
        });
      })
      .catch((err) => {
        console.log(err);
      });
  }

  function 日時フォーマット(日時) {
    console.log("日時", 日時);
    let フォーマット文字列 = 日時.getFullYear() + "/";
    let 月文字列 = 日時.getMonth() + 1;
    let 曜日文字列 = new Intl.DateTimeFormat("ja-JP", {
      weekday: "short",
    }).format(日時);
    フォーマット文字列 = フォーマット文字列 + 月文字列 + "/";
    フォーマット文字列 = フォーマット文字列 + 日時.getDate();
    フォーマット文字列 = フォーマット文字列 + "(" + 曜日文字列 + ") ";

    フォーマット文字列 = フォーマット文字列 + 日時.getHours() + ":";
    フォーマット文字列 = フォーマット文字列 + 日時.getMinutes();
    return フォーマット文字列;
  }
})();
