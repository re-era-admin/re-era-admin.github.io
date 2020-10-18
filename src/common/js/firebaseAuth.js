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
})();
