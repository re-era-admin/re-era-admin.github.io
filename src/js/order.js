(function () {
  // ===========================================================================
  // 共通変数定義
  // ---------------------------------------------------------------------------

  // ===========================================================================
  // 初期化関数
  //  - イベントハンドラを設定
  //  - アラートを表示 etc
  // ---------------------------------------------------------------------------

  //parsleyの初期化
  $("#orderForm").parsley();
  function test() {
    $("#orderForm").parsley().validate();
  }

  // チェックボックスの初期値設定
  document.getElementById("part__check-countersign").checked = false;

  document.getElementById("check_btn").addEventListener(
    "click",
    function (event) {
      $("#orderForm").parsley().validate();
      event.preventDefault();
    },
    false
  );

  document.getElementById("remake_btn").addEventListener(
    "click",
    function (event) {
      switchInputForm();
      event.preventDefault();
    },
    false
  );

  document
    .getElementById("part__check-countersign")
    .addEventListener("change", toggleCountersign);

  //
  //抽選型と、予約先着型は開店期間=チケット単位時間とする。そのためチケット単位時間を非表示にし、自動入力されるようにする。
  //
  document.getElementById("ticket_pattern").addEventListener(
    "change",
    function (event) {
      switch (document.getElementById("ticket_pattern").value) {
        case "1":
          displayUnitTime();
          break;
        case "2":
          nonDisplayUnitTime();
          break;
        case "3":
          nonDisplayUnitTime();
          break;
      }
    },
    false
  );

  document.getElementById("duration").addEventListener(
    "change",
    function (event) {
      if (
        document.getElementById("ticket_pattern").value == "2" ||
        document.getElementById("ticket_pattern").value == "3"
      ) {
        nonDisplayUnitTime();
      }
    },
    false
  );

  document.getElementById("submit").addEventListener("click", sendRequest);

  //
  //応募締め切り日時：開始日、時、分いずれかに更新があった場合にバックエンド連携用にlocal-date-time型inputフォーム[非表示]を自動更新する
  //
  // document
  //   .querySelector("#applicationDeadline-date")
  //   .addEventListener("change", (event) => {
  //     createApplicationDateline();
  //   });
  // document
  //   .querySelector("#applicationDeadline-hour")
  //   .addEventListener("change", (event) => {
  //     createApplicationDateline();
  //   });
  // document
  //   .querySelector("#applicationDeadline-min")
  //   .addEventListener("change", (event) => {
  //     createApplicationDateline();
  //   });

  //
  //抽選完了日時：開始日、時、分いずれかに更新があった場合にバックエンド連携用にlocal-date-time型inputフォーム[非表示]を自動更新する
  //
  // document
  //   .querySelector("#lotteryDeadline-date")
  //   .addEventListener("change", (event) => {
  //     createLotteryDeadline();
  //   });
  // document
  //   .querySelector("#lotteryDeadline-hour")
  //   .addEventListener("change", (event) => {
  //     createLotteryDeadline();
  //   });
  // document
  //   .querySelector("#lotteryDeadline-min")
  //   .addEventListener("change", (event) => {
  //     createLotteryDeadline();
  //   });

  //
  //支払い締切り日時：開始日、時、分いずれかに更新があった場合にバックエンド連携用にlocal-date-time型inputフォーム[非表示]を自動更新する
  //
  // document
  //   .querySelector("#paymentDeadline-date")
  //   .addEventListener("change", (event) => {
  //     createPaymentDeadline();
  //   });
  // document
  //   .querySelector("#paymentDeadline-hour")
  //   .addEventListener("change", (event) => {
  //     createPaymentDeadline();
  //   });
  // document
  //   .querySelector("#paymentDeadline-min")
  //   .addEventListener("change", (event) => {
  //     createPaymentDeadline();
  //   });

  //
  //開店日時：開始日、時、分いずれかに更新があった場合にバックエンド連携用にlocal-date-time型inputフォーム[非表示]を自動更新する
  //
  document.querySelector("#start-date").addEventListener("change", (event) => {
    createStartDateTime();
  });
  document.querySelector("#start-hour").addEventListener("change", (event) => {
    createStartDateTime();
  });
  document.querySelector("#start-min").addEventListener("change", (event) => {
    createStartDateTime();
  });

  // ===========================================================================
  // 関数定義 (イベントハンドラ以外)
  // ---------------------------------------------------------------------------

  //Submit実行時にParsleyを用いてValidationを実施
  //その後複合パターン等は独自Validationで処理を実施
  $("#orderForm")
    .parsley()
    .on("form:success", function () {
      //入力項目「お店の開店時間」、「開店期間」を用いて閉店時間を自動生成する
      createEndDateTime();

      //parsleyでチェックをかけれない項目のValidation
      _validateExceptForParseley();
    });

  function displayUnitTime() {
    document.getElementById("part_unitTime").style.display = "block";
    document.getElementById("unit_time").value = "";
  }

  function nonDisplayUnitTime() {
    document.getElementById("part_unitTime").style.display = "none";
    document.getElementById("unit_time").value = document.getElementById(
      "duration"
    ).value;
  }

  function toggleCountersign() {
    document
      .getElementById("part__countersign-input")
      .classList.toggle("disabled");
  }

  function switchInputForm() {
    var inputDatas = document.getElementsByClassName("inputData");
    for (var i = 0; i < inputDatas.length; i++) {
      inputDatas[i].disabled = false;
    }
    document.getElementById("check_btn").style.display = "block";
    document.getElementById("submit").style.display = "none";
    document.getElementById("remake_btn").style.display = "none";
    document.getElementById("inputForm_title").style.display = "block";
    document.getElementById("comfirmForm_title").style.display = "none";

    document.getElementById("main").style.backgroundColor = "#FFF";
  }

  function switchComfirmForm() {
    var inputDatas = document.getElementsByClassName("inputData");
    for (var i = 0; i < inputDatas.length; i++) {
      inputDatas[i].disabled = true;
    }
    document.getElementById("check_btn").style.display = "none";
    document.getElementById("submit").style.display = "block";
    document.getElementById("remake_btn").style.display = "block";
    document.getElementById("inputForm_title").style.display = "none";
    document.getElementById("comfirmForm_title").style.display = "block";

    document.getElementById("main").style.backgroundColor = "#ddd";
  }

  function sendRequest() {
    document.getElementById("modal").style.display = "block";
    switchInputForm();
    var formElement = document.getElementById("orderForm");
    var formData = new FormData(formElement);
    formData.forEach(function (element, index, array) {
      console.log(index);
    });
    formData.append(
      "鍵付き出店",
      document.getElementById("part__check-countersign").checked ? true : false
    );

    const myHeaders = new Headers();

    firebase
      .auth()
      .currentUser.getIdToken(/* forceRefresh */ true)
      .catch(function (error) {
        console.error(error);
        throw error;
      })
      .then(function (idToken) {
        myHeaders.append("Authorization", "Bearer " + idToken);
        fetch(
          process.env.AP_CONTEXT_PATH + "/出店情報/出店情報の登録を申請する",
          // process.env.AP_CONTEXT_PATH + "/日付テスト",
          {
            method: "POST",
            body: formData,
            headers: myHeaders,
            mode: "cors", // no-cors, *cors, same-origin
            // credentials: "include", // include, *same-origin, omit
          }
        )
          .then((response) => response.json())
          .catch((error) => console.error("Error:", error))
          .then((response) => {
            if (response.code != undefined) {
              console.log("Fail", response.message);
              alert(response.message);
              document.getElementById("modal").style.display = "none";

              return;
            }
            console.log("Success", JSON.stringify(response));
            location.href = "./acceptOffer.html";
          });
      });
  }

  //TODO 以下の処理はもう少しまとめたい。
  function createApplicationDateline() {
    const _startDate = document.querySelector("#applicationDeadline-date")
      .value;
    const _startHour = (
      "00" + document.querySelector("#applicationDeadline-hour").value
    ).slice(-2);
    const _startMin = (
      "00" + document.querySelector("#applicationDeadline-min").value
    ).slice(-2);
    const result = document.querySelector("#応募締め切り日時");
    result.value = _startDate + "T" + _startHour + ":" + _startMin;
  }

  function createLotteryDeadline() {
    const _startDate = document.querySelector("#lotteryDeadline-date").value;
    const _startHour = (
      "00" + document.querySelector("#lotteryDeadline-hour").value
    ).slice(-2);
    const _startMin = (
      "00" + document.querySelector("#lotteryDeadline-min").value
    ).slice(-2);
    const result = document.querySelector("#抽選完了日時");
    result.value = _startDate + "T" + _startHour + ":" + _startMin;
  }

  function createPaymentDeadline() {
    const _startDate = document.querySelector("#paymentDeadline-date").value;
    const _startHour = (
      "00" + document.querySelector("#paymentDeadline-hour").value
    ).slice(-2);
    const _startMin = (
      "00" + document.querySelector("#paymentDeadline-min").value
    ).slice(-2);
    const result = document.querySelector("#支払い締切り日時");
    result.value = _startDate + "T" + _startHour + ":" + _startMin;
  }

  function createStartDateTime() {
    const _startDate = document.querySelector("#start-date").value;
    // const _startDate = document.querySelector("#start-date").value;
    const _startHour = (
      "00" + document.querySelector("#start-hour").value
    ).slice(-2);
    const _startMin = ("00" + document.querySelector("#start-min").value).slice(
      -2
    );
    const result = document.querySelector("#開店時間");
    result.value = _startDate + "T" + _startHour + ":" + _startMin;
  }

  function createEndDateTime() {
    const _openDate = new Date(document.querySelector("#開店時間").value);
    const _duration = document.querySelector("#duration").value;
    _openDate.setMinutes(_openDate.getMinutes() + Number(_duration));

    document.querySelector("#閉店時間").value =
      _openDate.getFullYear() +
      "-" +
      ("00" + (_openDate.getMonth() + 1)).slice(-2) +
      "-" +
      ("00" + _openDate.getDate()).slice(-2) +
      "T" +
      ("00" + _openDate.getHours()).slice(-2) +
      ":" +
      ("00" + _openDate.getMinutes()).slice(-2);
  }

  function _validateExceptForParseley() {
    const varNowDate = new Date();
    const varOpenDateTime = new Date(document.getElementById("開店時間").value);
    const duration = Number(document.getElementById("duration").value);
    const unitTime = Number(document.getElementById("unit_time").value);
    // let applicationDeadline = document.getElementById("応募締め切り日時").value;
    // let lotteryDeadline = document.getElementById("抽選完了日時").value;
    // let paymentDeadline = document.getElementById("支払い締切り日時").value;
    let error_message = "";

    const enableCountersign = document.getElementById("part__check-countersign")
      .checked;
    if (enableCountersign) {
      const countersign = document.getElementById("part__countersign-input")
        .value;
      if (countersign.length < 1) {
        error_message = error_message + "合言葉を入力してください。\n";
      }
    }

    //開店時間が現在時刻よりも5分以上後である事をチェック
    //秒も換算されるためあえて>=を利用しています。
    if (new Date().setMinutes(varNowDate.getMinutes() + 5) >= varOpenDateTime) {
      error_message =
        error_message + "お店の開店時間は今から5分以上後にしてください。\n";
    }

    //開店期間を超える単位時間が設定されていないかチェック
    console.log(unitTime + ">" + duration);
    if (unitTime > duration) {
      error_message =
        error_message +
        "チケットの単位時間は開店期間より短く設定してください。\n";
    }

    //応募締切り日時のチェック
    // if (nowDate.setMinutes(nowDate.getMinutes() + 60) > applicationDeadline) {
    //   error_message =
    //     error_message +
    //     "応募締め切り日時は今から60分以上後にして下さい。\n";
    // }

    //応募締切り日時のチェック
    // if (nowDate.setMinutes(nowDate.getMinutes() + 60) > applicationDeadline) {
    //   error_message =
    //     error_message +
    //     "応募締め切り日時は今から60分以上後にして下さい。\n";
    // }

    //チケット価格のチェック
    let ticketPrice = document.getElementById("price").value;
    if (ticketPrice >= 1 && ticketPrice < 100) {
      error_message =
        error_message +
        "チケット金額は0円、または有料の場合は100円以上を設定してください。\n";
    }

    //エラー内容の出力
    if (error_message == "") {
      switchComfirmForm();
    } else {
      alert(error_message);
    }
  }
})();
