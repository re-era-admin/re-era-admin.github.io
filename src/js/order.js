(function () {
  const firebaseConfig = {
    apiKey: "AIzaSyAcahSSBT9jzNddDlvPLMLIsUFSsagmN4g",
    authDomain: "flatto-yokocho.firebaseapp.com",
    databaseURL: "https://flatto-yokocho.firebaseio.com",
    projectId: "flatto-yokocho",
    storageBucket: "flatto-yokocho.appspot.com",
    messagingSenderId: "699983020092",
    appId: "1:699983020092:web:d29c1bd9f1b62817904339",
    measurementId: "G-7J94N3VHRE",
  };

  // Initialize Firebase
  firebase.initializeApp(firebaseConfig);
  window.onload = function () {
    firebase.auth().onAuthStateChanged(function (user) {
      if (user) {
      } else {
        location.href = "./login.html";
      }
    });
  };
  $("#orderForm").parsley();
  function test() {
    $("#orderForm").parsley().validate();
  }
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
  $("#orderForm")
    .parsley()
    .on("form:success", function () {
      nowDate = new Date();
      var openDateTime = new Date(document.getElementById("開店時間").value);
      var endDateTime = new Date(document.getElementById("閉店時間").value);
      var error_message = "";
      if (nowDate.setMinutes(nowDate.getMinutes() + 10) > openDateTime) {
        error_message =
          error_message + "お店の開店時間は今から10分以上後にして下さい。\n";
      }

      //単位時間以下になっていおない事
      if (
        (endDateTime - openDateTime) / 60000 <
        document.getElementById("unit_time").value
      ) {
        //60000ミリ秒=1分
        error_message =
          error_message +
          "お店の開店開店時間と閉店時間の間は最低でもチケットの単位時間の設定時間(" +
          document.getElementById("unit_time").value +
          "分)よりも開けてください。\n";
      }

      if ((endDateTime - openDateTime) / 60000 > 240) {
        //60000ミリ秒=1分
        error_message =
          error_message +
          "最大開店期間は4時間です。お店の開店開店時間、閉店時間を修正してください";
      }

      if (endDateTime < openDateTime) {
        error_message =
          error_message + "お店の開店開店時間と閉店時間が前後しています。\n";
      }

      if (error_message == "") {
        switchComfirmForm();
      } else {
        alert(error_message);
      }
    });

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
    switchInputForm();
    var formElement = document.getElementById("orderForm");
    var formData = new FormData(formElement);
    formData.forEach(function (element, index, array) {
      console.log(index);
    });

    fetch(
      process.env.AP_CONTEXT_PATH + "/出店情報/出店情報の登録を申請する",
      // process.env.AP_CONTEXT_PATH + "/日付テスト",
      {
        method: "POST",
        body: formData,
      }
    )
      .then((response) => response.json())
      .catch((error) => console.error("Error:", error))
      .then((response) => {
        // document
        //   .getElementById("container__loading")
        //   .classList.remove("active");
        // document.getElementById("header").classList.add("under-modal");
        if (response.code != undefined) {
          console.log("Fail", response.message);
          document.getElementById("part__modal-icon").classList.add("error");
          var vm = new Vue({
            el: "#container__modal",
            data: {
              msg: [],
            },
            mounted() {
              const result = {
                title: "",
                text: response.message,
              };
              this.msg = result;
            },
          });
          return;
        }
        console.log("Success", JSON.stringify(response));
        location.href = "./acceptOffer.html";
      });
  }
  document.getElementById("submit").addEventListener("click", sendRequest);

  document.getElementById("close").addEventListener("click", function (event) {
    document.getElementsById("container__modal").style.display = "none";
  });

  document.querySelector("#start-date").addEventListener("change", (event) => {
    createStartDateTime();
  });
  document.querySelector("#start-hour").addEventListener("change", (event) => {
    createStartDateTime();
  });
  document.querySelector("#start-min").addEventListener("change", (event) => {
    createStartDateTime();
  });

  document.querySelector("#end-date").addEventListener("change", (event) => {
    createEndDateTime();
  });
  document.querySelector("#end-hour").addEventListener("change", (event) => {
    createEndDateTime();
  });
  document.querySelector("#end-min").addEventListener("change", (event) => {
    createEndDateTime();
  });

  function createStartDateTime() {
    const _startDate = document.querySelector("#start-date").value;
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
    const _endDate = document.querySelector("#end-date").value;
    const _endHour = ("00" + document.querySelector("#end-hour").value).slice(
      -2
    );
    const _endMin = ("00" + document.querySelector("#end-min").value).slice(-2);
    const result = document.querySelector("#閉店時間");
    result.value = _endDate + "T" + _endHour + ":" + _endMin;
  }
})();
