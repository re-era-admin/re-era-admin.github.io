const ENV_VARS = {
  ENV_NAME: "staging",
  ENV_TEXT: "開発環境",
  CONTEXT_PATH: "https://cranky-bell-765f86.netlify.app/",
  BACKEND_CONTEXT_PATH: "https://stg-online-yokocho.herokuapp.com/",
};

let COM_FUNC = {
  hello: function (e) {
    console.log("現在のモード : " + ENV_VARS.ENV_NAME);
  },
};

// importした先で使えるようにexport宣言
export { ENV_VARS, COM_FUNC };
