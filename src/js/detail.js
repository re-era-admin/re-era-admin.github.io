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

  const 合言葉確認URL =
    process.env.AP_CONTEXT_PATH + "/出店情報/合言葉を照合する";

  // ===========================================================================
  // 初期化関数
  //  - イベントハンドラを設定
  //  - アラートを表示 etc
  // ---------------------------------------------------------------------------
  const params = new URL(document.location).searchParams;
  const 出店情報Id = params.get("id");

  getIzakaya(出店情報Id);

  // ===========================================================================
  // イベントハンドラ関数定義
  // ---------------------------------------------------------------------------

  var handlers = {
    openModal: function () {
      modalVm.modalActive = true;
      document.getElementById("header").classList.add("under-modal");
      return false;
    },

    confirmCountersign: function () {
      document.getElementById("container__loading").classList.add("active");
      const 合言葉 = document.querySelector(".part__countersign-input > input")
        .value;
      let param = new FormData();

      param.append("出店Id", 出店情報Id);
      param.append("合言葉", 合言葉);

      // サーバに合言葉が合っているか確認する
      fetch(合言葉確認URL, {
        method: "POST",
        body: param,
      })
        .catch((error) => console.error("Error:", error))
        .then((response) => {
          document
            .getElementById("container__loading")
            .classList.remove("active");
          response.text().then(function (text) {
            if (text && text == "OK") {
              document.cookie = `countersign=${合言葉}`;
              location.href = "/buy.html?id=" + 出店情報Id;
            } else if (text && text == "合言葉が間違っています") {
              modalVm.$set(
                modalVm.msg,
                "text",
                "合言葉が間違っています。\n正しい合言葉を入力してください。"
              );
              document
                .querySelector(".part__countersign-input > input")
                .classList.add("error");
            }
          });
        });
    },
  };
  // ===========================================================================
  // 関数定義 (イベントハンドラ以外)
  // ---------------------------------------------------------------------------

  var modalVm = new Vue({
    el: "#container__modal",
    data: {
      msg: [],
      modalActive: false,
      closable: false,
      fnConfirm: handlers.confirmCountersign,
    },
    methods: {
      tojiru() {
        this.modalActive = false;
        document.getElementById("header").classList.remove("under-modal");
      },
    },
  });

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
        var vm = new Vue({
          el: "#izakaya-content",
          data: {
            izakaya: [],
            fnOnClick: null,
            chargeLinkPath: "",
          },
          mounted() {
            console.log(data);
            //画面表示用にデータを加工
            data.var開店時間 = _changeFormatDateToDisplay(data.var開店時間);
            data.var閉店時間 = _changeFormatDateToDisplay(data.var閉店時間);
            this.izakaya = data;

            // 合言葉付き出店の場合、下部リンククリック時に入力モーダルを表示
            console.log("通った", data.var合言葉);
            if (!data.var合言葉) {
              this.chargeLinkPath =
                "/buy.html?id=" + data.varVo出店Id.var出店Id;
              this.fnOnClick = () => {
                location.href = "/buy.html?id=" + data.varVo出店Id.var出店Id;
              };
            } else {
              this.chargeLinkPath = "#";
              this.fnOnClick = handlers.openModal;
            }
          },
        });
      })
      .catch((err) => {
        console.log(err);
      });
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
