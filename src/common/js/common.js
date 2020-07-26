// 上記のようにすることで名前空間を限定できる

"use strict";

// ---------------------------------------------------------------------------
// 共通変数定義
// ---------------------------------------------------------------------------

// ---------------------------------------------------------------------------
// イベントハンドラ関数定義
// ---------------------------------------------------------------------------

/**
 * イベントハンドラ
 */
function onClickBurgerToggle(e) {
  console.log("test");
  document.querySelector(".navbar-burger").classList.toggle("is-active");
  document.querySelector(".navbar-menu").classList.toggle("is-active");
}

// ---------------------------------------------------------------------------
// 初期化関数定義 (ページの DOM ツリー構築完了後に行う初期処理)
// ---------------------------------------------------------------------------

/**
 * 初期化関数。
 * - イベントハンドラを設定する。
 * - アラートを表示する。
 */
$(function init() {

  // var burgerBtn = document.getElementById("toggleBurger");
  // burgerBtn.addEventListener("click", handlers.onClickBurgerToggle, false);

  // TODO:ひとまず全pをフェードイン
  // const fadeTargets = document.querySelectorAll("p");
  // fadeTargets.forEach(function (target) {
  // 監視の開始
  // target.classList.add("fadein");
  // });

  // IntersectionObserverオブジェクトを作成する。
  // 交差時に実行するコールバック関数を渡す。
  const options = { threshold: [0.01] };

  const observer = new IntersectionObserver((entries) => {
    for (const e of entries) {
      // 交差していない
      if (!e.isIntersecting) continue;

      e.target.classList.remove("unscroll");
    }
  }, options);

  // 監視したい要素をobserveする。
  const targets = document.querySelectorAll(".fade.unscroll");
  targets.forEach(function (target) {
    // 監視の開始
    observer.observe(target);
  });
});

// ---------------------------------------------------------------------------
// 関数定義 (イベントハンドラ以外)
// ---------------------------------------------------------------------------
