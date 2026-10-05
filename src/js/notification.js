(function (root) {
  "use strict";

  async function requestPermission() {
    if (!("Notification" in window)) return "unsupported";
    return Notification.requestPermission();
  }

  function sendBrowserAlert(name, level, score, reasons) {
    const body = `${level} ${score}점\n${reasons.slice(0, 2).join(" / ")}`;
    if ("Notification" in window && Notification.permission === "granted") {
      new Notification("SilverGuard 위기 알림 - " + name, { body });
      return true;
    }
    return false;
  }

  root.SilverGuardNotify = { requestPermission, sendBrowserAlert };
})(globalThis);
