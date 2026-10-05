const assert = require("node:assert/strict");
const { evaluateRisk } = require("../src/js/risk-engine.js");

const cases = [
  {id:"TC1",data:{inactive:20,heart:74,night:0,door:0,outside:0,response:1},level:"NORMAL",score:2.0},
  {id:"TC2",data:{inactive:210,heart:78,night:0,door:0,outside:0,response:1},level:"WARNING",score:48.4},
  {id:"TC3",data:{inactive:40,heart:122,night:0,door:0,outside:0,response:0},level:"DANGER",score:74.2},
  {id:"TC4",data:{inactive:15,heart:82,night:1,door:1,outside:1,response:1},level:"WARNING",score:34.6},
  {id:"TC5",data:{inactive:300,heart:128,night:1,door:1,outside:1,response:0},level:"DANGER",score:100},
  {id:"TC6",data:{inactive:50,heart:0,night:0,door:0,outside:0,response:1},level:"WARNING",score:25.0}
];

for (const tc of cases) {
  const result = evaluateRisk(tc.data);
  assert.equal(result.level, tc.level, `${tc.id} level`);
  assert.equal(result.score, tc.score, `${tc.id} score`);
  console.log(`PASS ${tc.id}: ${result.level} / ${result.score}`);
}
console.log(`\n${cases.length}/${cases.length} test cases PASS`);
