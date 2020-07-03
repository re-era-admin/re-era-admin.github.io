import { ENV_VARS, COM_FUNC } from "/common/js/env.js";

var el = document.getElementById("headerT1");
el.innerHTML = "オンライン横丁(仮) " + ENV_VARS.ENV_NAME;

COM_FUNC.hello();
