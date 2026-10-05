(function (root, factory) {
  const api = factory();
  if (typeof module === "object" && module.exports) module.exports = api;
  else root.SilverGuardRisk = api;
})(typeof globalThis !== "undefined" ? globalThis : this, function () {
  "use strict";

  const CONFIG = Object.freeze({
    inactivityBaseline: 35,
    inactivityScale: 45,
    heartBaseline: 75,
    heartScale: 18,
    anomalyCap: 25,
    warningThreshold: 30,
    dangerThreshold: 60
  });

  function baselineAnomaly(inactive, heart) {
    const zInactive = Math.abs((inactive - CONFIG.inactivityBaseline) / CONFIG.inactivityScale);
    const zHeart = Math.abs((heart - CONFIG.heartBaseline) / CONFIG.heartScale);
    return Math.min(CONFIG.anomalyCap, (zInactive * 5) + (zHeart * 6));
  }

  function validateData(data) {
    if (!Number.isFinite(data.inactive) || data.inactive < 0) return false;
    if (!Number.isFinite(data.heart) || data.heart <= 0 || data.heart > 240) return false;
    return true;
  }

  function actionPlan(level) {
    if (level === "DANGER") {
      return ["즉시 보호자 알림", "복지기관/담당자 확인 권고", "미확인 시 재알림"];
    }
    if (level === "WARNING") {
      return ["보호자에게 주의 알림", "30분 이내 상태 재확인"];
    }
    return ["정상 상태 기록", "지속 모니터링"];
  }

  function evaluateRisk(data) {
    if (!validateData(data)) {
      return {
        level: "WARNING",
        score: 25,
        reasons: ["데이터 품질 오류 또는 누락"],
        actions: ["센서/입력값을 재확인하고 유효 데이터 확보 후 재분석합니다."],
        dataQualityError: true,
        anomaly: null
      };
    }

    let score = 0;
    const reasons = [];
    const anomaly = baselineAnomaly(data.inactive, data.heart);

    if (data.inactive >= 180) { score += 28; reasons.push("3시간 이상 장시간 미활동"); }
    else if (data.inactive >= 120) { score += 18; reasons.push("2시간 이상 미활동"); }
    else if (data.inactive >= 60) { score += 8; reasons.push("평소보다 긴 미활동"); }

    if (data.heart >= 120 || data.heart <= 45) { score += 30; reasons.push("심박수 고위험 범위"); }
    else if (data.heart >= 105 || data.heart <= 55) { score += 16; reasons.push("심박수 주의 범위"); }

    if (data.night && data.door) { score += 12; reasons.push("야간 현관문 이벤트"); }
    if (data.night && data.outside) { score += 18; reasons.push("야간 외부 위치 감지"); }
    if (!data.response) { score += 20; reasons.push("사용자 응답 없음"); }

    score += anomaly;
    if (anomaly >= 14) reasons.push("기준선 대비 통계적 이상징후");

    if (data.inactive >= 180 && !data.response) { score += 8; reasons.push("미활동+무응답 복합위험"); }
    if ((data.heart >= 120 || data.heart <= 45) && !data.response) { score += 8; reasons.push("심박이상+무응답 복합위험"); }

    score = Math.min(100, Math.round(score * 10) / 10);

    let level = "NORMAL";
    if (score >= CONFIG.dangerThreshold) level = "DANGER";
    else if (score >= CONFIG.warningThreshold) level = "WARNING";

    return {
      level,
      score,
      reasons,
      actions: actionPlan(level),
      dataQualityError: false,
      anomaly: Math.round(anomaly * 10) / 10
    };
  }

  return { CONFIG, baselineAnomaly, validateData, evaluateRisk, actionPlan };
});
