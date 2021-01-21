import Vue from "vue";
import VueTheMask from "vue-the-mask";

import jQuery from "jquery";
window.$ = window.jQuery = jQuery;

(function () {
  "use strict";

  // ===========================================================================
  // 共通変数定義
  // ---------------------------------------------------------------------------
  let 出店情報Id;

  let price;

  const 合言葉確認URL =
    process.env.AP_CONTEXT_PATH + "/出店情報/合言葉を照合する";

  var vm = new Vue({
    el: "#container__modal",
    data: {
      msg: [],
      cushionLink: "",
      modalActive: false,
      closable: false,
    },
    methods: {
      tojiru() {
        this.modalActive = false;
      },
    },
  });

  // ===========================================================================
  // イベントハンドラ関数定義
  // ---------------------------------------------------------------------------

  var handlers = {
    submitPurchase: function () {
      入力フォームのバリデーション();

      var el = document.getElementById("container__loading");
      el.classList.add("active");
      document.getElementById("header").classList.add("under-modal");
      var cardInformation = {
        name: document.querySelector("#cardName").value,
        number: document.querySelector("#cardNumber").value,
        expiration_month: document.querySelector("#cardMonth").value,
        expiration_year: document.querySelector("#cardYear").value,
        security_code: document.querySelector("#cardCvv").value,

        //仮のカード情報
        // name: "TEST USER",
        // number: "4242424242424242",
        // expiration_month: "07",
        // expiration_year: "2025",
        // security_code: "999",
      };

      Omise.createToken(
        "card",
        cardInformation,
        function (statusCode, response) {
          if (statusCode === 200) {
            var emailVal = document.querySelector("#email").value;
            var purchaserName = document.querySelector("#purchaser-name").value;

            let purchaseFormData = new FormData();
            purchaseFormData.append("omiseトークン", response.id);
            purchaseFormData.append("メールアドレス", emailVal);
            purchaseFormData.append("購入者名", purchaserName);
            purchaseFormData.append("出店Id", 出店情報Id);
            purchaseFormData.append("表示価格", price);

            サーバへリクエスト送信(
              process.env.AP_CONTEXT_PATH + "/出店情報/チケット申込を行う",
              purchaseFormData
            );
          } else {
            // Error: display an error message. Note that `response.message` contains
            // a preformatted error message. Also note that `response.code` will be
            // "invalid_card" in case of validation error on the card.
            alert(
              "カードの確認でエラーが発生しました.",
              response.code,
              response.message
            );
            document
              .getElementById("container__loading")
              .classList.remove("active");
            throw new Error("カード確認エラー");
          }
        }
      );
    },
    submitFreeEntry() {
      入力フォームのバリデーション();

      var el = document.getElementById("container__loading");
      el.classList.add("active");
      document.getElementById("header").classList.add("under-modal");

      var emailVal = document.querySelector("#email").value;
      var purchaserName = document.querySelector("#purchaser-name").value;

      let purchaseFormData = new FormData();
      purchaseFormData.append("メールアドレス", emailVal);
      purchaseFormData.append("購入者名", purchaserName);
      purchaseFormData.append("出店Id", 出店情報Id);
      purchaseFormData.append("表示価格", price);

      サーバへリクエスト送信(
        process.env.AP_CONTEXT_PATH + "/出店情報/無料のチケットへ申込を行う",
        purchaseFormData
      );
    },
  };

  // ===========================================================================
  // 初期化関数
  //  - イベントハンドラを設定
  //  - アラートを表示 etc
  // ---------------------------------------------------------------------------
  $(function init() {
    var params = new URL(document.location).searchParams;
    出店情報Id = params.get("id");

    getIzakaya(出店情報Id);

    setLinkBack(出店情報Id);
    Omise.setPublicKey(process.env.OMISE_PUBLIC_KEY);
  });
  // ===========================================================================
  // 関数定義 (イベントハンドラ以外)
  // ---------------------------------------------------------------------------

  function getIzakaya(p出店情報Id) {
    fetch(
      process.env.AP_CONTEXT_PATH +
        "/出店情報/チケット申込ページを参照する/" +
        p出店情報Id,
      {
        method: "GET",
        mode: "cors",
      }
    )
      .then((response) => {
        if (!response.ok) {
          throw Error(response.statusText);
        }
        return response.json();
      })
      .then((izakaya) => {
        if (izakaya.合言葉設定) {
          合言葉を照合する();
        }

        price = izakaya.varチケット価格;

        var vm = new Vue({
          el: "#box__izakaya",
          data: {
            izakaya: [],
          },
          mounted() {
            this.izakaya = izakaya;
          },
        });

        /*
        See on github: https://github.com/muhammederdem/credit-card-form
        */
        Vue.use(VueTheMask);
        new Vue({
          el: "#card-form-wrapper",
          data() {
            return {
              // currentCardBackground: Math.floor(Math.random() * 5 + 1), // just for fun :D
              cardName: "",
              cardNumber: "",
              cardMonth: "",
              cardYear: "",
              cardCvv: "",
              minCardYear: new Date().getFullYear(),
              amexCardMask: "#### ###### #####",
              otherCardMask: "#### #### #### ####",
              cardNumberTemp: "",
              isCardFlipped: false,
              focusElementStyle: null,
              isInputFocused: false,
              varチケット価格: izakaya.varチケット価格,
              var単位時間: izakaya.var単位時間,
            };
          },
          mounted() {
            this.cardNumberTemp = this.otherCardMask;
          },
          computed: {
            getCardType() {
              let number = this.cardNumber;
              let re = new RegExp("^4");
              if (number.match(re) != null) return "visa";

              re = new RegExp("^(34|37)");
              if (number.match(re) != null) return "amex";

              re = new RegExp("^35(2[8-9]|[3-8][0-9])");
              if (number.match(re) != null) return "jcb";

              re = new RegExp("^5[1-5]");
              if (number.match(re) != null) return "mastercard";

              re = new RegExp("^6011");
              if (number.match(re) != null) return "discover";

              re = new RegExp("^9792");
              if (number.match(re) != null) return "troy";

              return "none"; // default type
            },
            generateCardNumberMask() {
              return this.getCardType === "amex"
                ? this.amexCardMask
                : this.otherCardMask;
            },
            minCardMonth() {
              if (this.cardYear === this.minCardYear)
                return new Date().getMonth() + 1;
              return 1;
            },
          },
          watch: {
            cardYear() {
              if (this.cardMonth < this.minCardMonth) {
                this.cardMonth = "";
              }
            },
          },
          methods: {
            flipCard(status) {
              this.isCardFlipped = status;
            },
            focusInput(e) {
              this.isInputFocused = true;
              let targetRef = e.target.dataset.ref;
              let target = this.$refs[targetRef];
              this.focusElementStyle = {
                width: `${target.offsetWidth}px`,
                height: `${target.offsetHeight}px`,
                transform: `translateX(${target.offsetLeft}px) translateY(${target.offsetTop}px)`,
              };
            },
            blurInput() {
              let vm = this;
              setTimeout(() => {
                if (!vm.isInputFocused) {
                  vm.focusElementStyle = null;
                }
              }, 300);
              vm.isInputFocused = false;
            },
            submitPurchase: (function () {
              if (price === 0) {
                return handlers.submitFreeEntry;
              } else {
                return handlers.submitPurchase;
              }
            })(),
          },
        });
      })
      .catch((err) => {
        console.log(err);
      });
  }

  function setLinkBack(izakayaId) {
    document.querySelector(".part__link-top > a").href =
      "/detail.html?id=" + izakayaId;
  }

  function 合言葉を照合する() {
    var cookies = document.cookie.split(";");
    let 合言葉 = "";
    for (var c of cookies) {
      var cArray = c.split("=");
      if (cArray[0].trim(" ") == "countersign") {
        合言葉 = cArray[1]; // [key,value]
      }
    }
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
            console.log("合言葉が確認できました。");
            return;
          } else if (text && text == "合言葉が間違っています") {
            alert("不正な遷移が確認されました。\nトップに戻ります。");
            location.href = "/index.html";
          }
        });
      });
  }

  function 入力フォームのバリデーション() {
    //validation TODO:後でアーキテクチャの方針に合わせてチェック方法修正
    if (document.getElementById("email").value == "") {
      alert("メールアドレスを入力してください。");
      throw new Error("入力エラー");
    }

    var _mailFormat = /^[A-Za-z0-9]{1}[A-Za-z0-9_.+-]*@{1}[A-Za-z0-9_.-]{1,}\.[A-Za-z0-9]{1,}$/;
    if (!_mailFormat.test(document.getElementById("email").value)) {
      alert("メールアドレスのフォーマットに誤りがあります。");
      throw new Error("入力エラー");
    }

    if (document.getElementById("purchaser-name").value == "") {
      alert("Zoom上で表示するお名前を入力してください。");
      throw new Error("入力エラー");
    }
  }

  function サーバへリクエスト送信(requestUrl, purchaseFormData) {
    fetch(requestUrl, {
      method: "POST",
      body: purchaseFormData,
    })
      .then((response) => response.json())
      .catch((error) => console.error("Error:", error))
      .then((response) => {
        document
          .getElementById("container__loading")
          .classList.remove("active");
        document.getElementById("header").classList.add("under-modal");
        vm.modalActive = true;
        if (response.code != undefined) {
          console.error("Fail", response.message);
          document.getElementById("part__modal-icon").classList.add("error");
          const res = {
            title: "",
            text: response.message,
          };
          vm.msg = res;
          vm.closable = true;
          throw new Error("サーバでの決済処理エラー");
        }
        console.log("Success", response.varVoチケット.varクッションページUrl);
        document.getElementById("part__modal-icon").classList.remove("error");
        vm.msg.title = "お申し込みありがとうございます!";
        vm.msg.text =
          "申し込みいただいたチケットは入力いただいたメールアドレスへお送りします。\nメールボックスをご確認ください。\nGmailなどの設定によっては迷惑メールに振り分けられるケースがあります。" +
          "\n見当たらない場合は迷惑メールボックス等をお確かめください。";
        vm.cushionLink = response.varVoチケット.varクッションページUrl;
        vm.closable = false;
      });
  }
})();
