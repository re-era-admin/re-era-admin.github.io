(function () {
  "use strict";

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
        location.href = "./order.html";
      } else {
      }
    });
  };

  function logIn() {
    let email = document.getElementById("email").value;
    let password = document.getElementById("password").value;
    firebase
      .auth()
      .signInWithEmailAndPassword(email, password)
      .catch(function (error) {
        // Handle Errors here.
        // var errorCode = error.code;
        // var errorMessage = error.message;

        alert(
          "ログインに失敗しました。メールアドレス、パスワードのいずれか、または両方が間違っています。"
        );

        firebase
          .auth()
          .currentUser.getIdToken(/* forceRefresh */ true)
          .then(function (idToken) {
            //サーバにトークンを投げる
            //https://firebase.google.com/docs/auth/admin/verify-id-tokens?hl=ja#web
            location.href = "./order.html";
          })
          .catch(function (error) {
            // Handle error
          });
      });
  }
  document.getElementById("logIn").addEventListener("click", function () {
    let email = document.getElementById("email").value;
    let password = document.getElementById("password").value;
    firebase
      .auth()
      .signInWithEmailAndPassword(email, password)
      .catch(function (error) {
        // Handle Errors here.
        // var errorCode = error.code;
        // var errorMessage = error.message;

        alert(
          "ログインに失敗しました。メールアドレス、パスワードのいずれか、または両方が間違っています。"
        );

        firebase
          .auth()
          .currentUser.getIdToken(/* forceRefresh */ true)
          .then(function (idToken) {
            //サーバにトークンを投げる
            //https://firebase.google.com/docs/auth/admin/verify-id-tokens?hl=ja#web
            location.href = "./order.html";
          })
          .catch(function (error) {
            // Handle error
          });
      });
  });
})();
