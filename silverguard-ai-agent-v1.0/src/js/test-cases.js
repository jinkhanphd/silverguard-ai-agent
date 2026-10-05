(function (root) {
  "use strict";

  const TEST_CASES = Object.freeze({
    1:{name:"TC1 정상",inactive:20,heart:74,night:0,door:0,outside:0,response:1,memo:"정상 활동 상태",expectedLevel:"NORMAL",expectedScore:2.0},
    2:{name:"TC2 장시간 미활동",inactive:210,heart:78,night:0,door:0,outside:0,response:1,memo:"장시간 미활동 감지",expectedLevel:"WARNING",expectedScore:48.4},
    3:{name:"TC3 심박 이상 + 무응답",inactive:40,heart:122,night:0,door:0,outside:0,response:0,memo:"심박 이상과 무응답",expectedLevel:"DANGER",expectedScore:74.2},
    4:{name:"TC4 야간 외출",inactive:15,heart:82,night:1,door:1,outside:1,response:1,memo:"야간 외출 시나리오",expectedLevel:"WARNING",expectedScore:34.6},
    5:{name:"TC5 복합 고위험",inactive:300,heart:128,night:1,door:1,outside:1,response:0,memo:"복합 고위험 시나리오",expectedLevel:"DANGER",expectedScore:100},
    6:{name:"TC6 데이터 누락/비정상",inactive:50,heart:0,night:0,door:0,outside:0,response:1,memo:"센서 데이터 오류",expectedLevel:"WARNING",expectedScore:25.0}
  });

  root.SilverGuardTests = { TEST_CASES };
})(globalThis);
