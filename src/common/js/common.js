
"use strict";

// ---------------------------------------------------------------------------
// 共通変数定義
// ---------------------------------------------------------------------------

// ---------------------------------------------------------------------------
// 初期化関数定義 (ページの DOM ツリー構築完了後に行う初期処理)
// ---------------------------------------------------------------------------

/**
 * 初期化関数。
 * - イベントハンドラを設定する。
 * - アラートを表示する。
 */
(function () {

  // ===== スクロール時にふわっと現れる演出スクリプト ======
  // IntersectionObserverオブジェクトを作成する。
  // 交差時に実行するコールバック関数を渡す。

  // しきい値を viewport に要素の高さ1%が入っていることする
  const options = { threshold: [0.01] };

  const observer = new IntersectionObserver((entries) => {
    for (const e of entries) {
      // 交差していないならskip
      if (!e.isIntersecting) continue;

      e.target.classList.remove("unscroll");
    }
  }, options);

  // 監視対象である特定class要素をobserveする。
  const targets = document.querySelectorAll(".fade.unscroll");
  targets.forEach(function (target) {
    // 監視を開始する.
    observer.observe(target);
  });

  // ===== コンテンツのバージョン確認用スクリプト ======
  // htmlのdata属性にビルド時のコミットIdを埋め込む
  const htmlContent = document.querySelector("html");
  htmlContent.dataset.appCommitId = process.env.COMMIT_REF;

})();
