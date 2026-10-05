(function () {
  "use strict";

  const $ = id => document.getElementById(id);
  const num = id => Number($(id).value);
  const now = () => new Date().toLocaleString("ko-KR");
  const esc = s => String(s || "").replace(/[&<>"']/g, c => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
  let latestId = null;
  SilverGuardStorage.load();

  function readData() {
    return {
      name: $("name").value.trim() || "대상자",
      inactive: num("inactive"), heart: num("heart"),
      night: num("night"), door: num("door"),
      outside: num("outside"), response: num("response"),
      memo: $("memo").value.trim()
    };
  }

  function renderResult(result, notified) {
    const { level, score, reasons, actions } = result;
    $("statusBox").className = "statusBox " + (level === "NORMAL" ? "normal" : level === "WARNING" ? "warning" : "danger");
    $("statusText").textContent = level;
    $("scoreText").textContent = score + " / 100";
    $("timeText").textContent = now();
    $("reasonText").innerHTML = "<b>판단:</b> " + (reasons.length ? reasons.join(", ") : "특이 위험징후 없음") + "<br><br><b>행동 계획:</b> " + actions.join(" → ");
    $("pills").innerHTML = ["Goal 이해","Reasoning","Tool Use","Memory/State","Feedback", notified ? "브라우저 알림 실행" : "로컬 사건기록"].map(x => '<span class="pill">' + x + '</span>').join("");
  }

  function saveEvent(data, result, notifyStatus, confirmStatus) {
    const ev = {
      id: Date.now() + "_" + Math.random().toString(16).slice(2),
      time: now(), data,
      level: result.level, score: result.score, reasons: result.reasons,
      notifyStatus, smsStatus: "NOT_REQUESTED", confirmStatus
    };
    latestId = ev.id;
    SilverGuardStorage.saveEvent(ev);
    renderLog();
    return ev;
  }

  async function maybeSendSms(ev, options) {
    if (!ev || options.skipSms || ev.level !== "DANGER" || !$("smsEnabled")?.checked) return;
    SilverGuardStorage.updateEvent(ev.id, { smsStatus: "SENDING" });
    renderLog();
    const result = await SilverGuardSms.sendIncident(ev);
    SilverGuardStorage.updateEvent(ev.id, { smsStatus: result.ok ? "SENT" : ("FAILED: " + result.message) });
    renderLog();
    $("smsState").textContent = result.ok ? "SMS Backend: 발송 성공" : "SMS Backend: " + result.message;
  }

  function analyze(options = {}) {
    const data = readData();
    const result = SilverGuardRisk.evaluateRisk(data);
    const shouldAlert = result.level !== "NORMAL" && !result.dataQualityError;
    const notified = shouldAlert ? SilverGuardNotify.sendBrowserAlert(data.name, result.level, result.score, result.reasons) : false;
    renderResult(result, notified);

    if (!options.silent) {
      const notifyStatus = result.dataQualityError ? "NOT_SENT" : (notified ? "SENT" : "LOCAL_LOG");
      const confirmStatus = result.dataQualityError ? "재확인 필요" : "미확인";
      const ev = saveEvent(data, result, notifyStatus, confirmStatus);
      maybeSendSms(ev, options);
    }
    return result;
  }

  async function requestNotify() {
    const p = await SilverGuardNotify.requestPermission();
    if (p === "unsupported") alert("이 브라우저는 알림 기능을 지원하지 않습니다.");
    else alert(p === "granted" ? "브라우저 알림이 허용되었습니다." : "알림 권한이 허용되지 않았습니다.");
  }

  function confirmLatest() {
    const events = SilverGuardStorage.all();
    if (!events.length) return alert("확인할 사건이 없습니다.");
    const ev = latestId ? events.find(x => x.id === latestId) : events[0];
    if (!ev) return;
    SilverGuardStorage.updateEvent(ev.id, { confirmStatus: "보호자 확인/조치완료" });
    renderLog();
    alert("사건 상태를 '보호자 확인/조치완료'로 변경했습니다.");
  }

  function retryAlert() {
    const events = SilverGuardStorage.all();
    if (!events.length) return alert("재알림할 사건이 없습니다.");
    const ev = latestId ? events.find(x => x.id === latestId) : events[0];
    if (!ev) return;
    SilverGuardNotify.sendBrowserAlert(ev.data.name, ev.level, ev.score, ev.reasons);
    SilverGuardStorage.updateEvent(ev.id, { notifyStatus: "RETRY_SENT" });
    renderLog();
  }

  function renderLog() {
    $("logBody").innerHTML = SilverGuardStorage.all().map(e => `<tr>
      <td>${e.time}</td><td>${esc(e.data.name)}</td>
      <td><span class="tag ${e.level}">${e.level}</span></td>
      <td>${e.score}</td><td>${esc(e.reasons.join(", "))}</td>
      <td>${e.notifyStatus}</td><td>${esc(e.smsStatus || "NOT_REQUESTED")}</td><td>${e.confirmStatus}</td>
    </tr>`).join("");
  }

  function loadCase(n) {
    const c = SilverGuardTests.TEST_CASES[n];
    if (!c) return;
    ["inactive","heart","night","door","outside","response","memo"].forEach(k => { if ($(k)) $(k).value = c[k]; });
    analyze();
  }

  function runAllTests() {
    const results = [];
    Object.keys(SilverGuardTests.TEST_CASES).forEach(key => {
      const c = SilverGuardTests.TEST_CASES[key];
      ["inactive","heart","night","door","outside","response","memo"].forEach(k => { if ($(k)) $(k).value = c[k]; });
      const actual = analyze({ skipSms: true });
      results.push({ test: c.name, expectedLevel: c.expectedLevel, actualLevel: actual.level, expectedScore: c.expectedScore, actualScore: actual.score, pass: c.expectedLevel === actual.level && Math.abs(c.expectedScore - actual.score) < 0.01 });
    });
    const passCount = results.filter(x => x.pass).length;
    alert(`대표 Test Case ${results.length}건 실행: ${passCount}/${results.length} PASS\n※ 자동 Test에서는 실제 SMS를 발송하지 않습니다.`);
    console.table(results);
    return results;
  }

  function exportJSON() {
    const blob = new Blob([JSON.stringify(SilverGuardStorage.all(), null, 2)], { type: "application/json" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob); a.download = "SilverGuard_event_log.json"; a.click();
    setTimeout(() => URL.revokeObjectURL(a.href), 1000);
  }

  function resetAll() {
    if (!confirm("사건기록을 모두 삭제할까요?")) return;
    SilverGuardStorage.clear(); latestId = null; renderLog();
    $("statusBox").className = "statusBox neutral";
    $("statusText").textContent = "대기"; $("scoreText").textContent = "0 / 100"; $("timeText").textContent = "분석 전";
    $("reasonText").innerHTML = "왼쪽에서 상태 값을 입력하고 <b>AI Agent 분석 실행</b>을 누르세요."; $("pills").innerHTML = "";
  }

  if ($("smsState")) $("smsState").textContent = SilverGuardConfig.apiBase() ? "SMS Backend: 설정됨 (발송 OFF)" : "SMS Backend: 미설정";
  Object.assign(globalThis, { analyze, requestNotify, confirmLatest, retryAlert, loadCase, runAllTests, exportJSON, resetAll });
  renderLog();
})();