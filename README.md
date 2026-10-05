# SilverGuard

[![SilverGuard CI](https://github.com/jinkhanphd/silverguard-ai-agent/actions/workflows/test.yml/badge.svg)](https://github.com/jinkhanphd/silverguard-ai-agent/actions/workflows/test.yml)

**독거노인 실시간 위기알림 AI Agent**  
2026 제4회 경남 AI·SW 경진대회 제출용 **Level 3 MVP · GitHub v1.1**

> **한 문장 정의**  
> SilverGuard는 질문에 답하는 챗봇이 아니라, 독거노인의 상태 데이터를 분석하고 위험을 판단한 뒤 **Tool을 실행하고, 사건 상태를 Memory에 저장하며, 보호자 확인을 Feedback으로 반영하는 실행형 AI Agent**입니다.

---

## 심사위원 30초 Quick Start

### 1) 실행
- 저장소의 `index.html`을 Chrome 또는 Edge에서 엽니다.
- 별도 Python, 서버, 설치, API Key가 필요하지 않습니다.

### 2) 가장 빠른 시연
1. **TC5 복합 고위험** 선택
2. **AI Agent 분석 실행**
3. **DANGER / 위험점수 / 판단근거** 확인
4. **Tool 실행 상태**와 **사건 Memory** 확인
5. **보호자 확인 / 조치완료**
6. **전체 Test Case 자동실행**으로 6개 시나리오 검증

### 3) 핵심 증거 파일
- 핵심 판단 엔진: [`src/js/risk-engine.js`](src/js/risk-engine.js)
- Agent 전체 제어: [`src/js/app.js`](src/js/app.js)
- Tool: [`src/js/notification.js`](src/js/notification.js), [`src/js/sms.js`](src/js/sms.js), [`api/send-sms.js`](api/send-sms.js)
- Memory/State: [`src/js/storage.js`](src/js/storage.js)
- Test Case: [`src/js/test-cases.js`](src/js/test-cases.js)
- 자동 테스트: [`tests/risk-engine.test.js`](tests/risk-engine.test.js)
- 구조 설명: [`docs/ARCHITECTURE.md`](docs/ARCHITECTURE.md)
- SMS 설정: [`docs/SMS_SETUP.md`](docs/SMS_SETUP.md)

---

## 1. End-to-End Workflow

```text
상태 데이터 입력
→ 데이터 유효성 검사
→ 통계적 이상징후 분석
→ 복합 위험판정
→ NORMAL / WARNING / DANGER
→ Browser Notification Tool 실행
→ (선택) DANGER 시 실제 SMS Backend Tool 실행
→ 사건 Memory 저장
→ 보호자 확인 또는 재알림
→ 상태 갱신 / Feedback
```

---

## 2. AI Agent 6요소 대응

| AI Agent 요소 | SilverGuard 구현 |
|---|---|
| Goal | 독거노인 위험상황 조기 감지 및 대응 연결 |
| Planning / Action Policy | 위험등급에 따라 정상기록 / 주의알림 / 즉시알림·재확인 행동 선택 |
| Reasoning | 통계적 기준선 편차 + 복합 위험규칙 + 위험점수 |
| Tool Use | Browser Notification API + 선택적 실제 SMS Backend Tool |
| Memory / State | LocalStorage에 사건·판정·확인상태 저장 |
| Feedback | 보호자 확인 / 미확인 재알림 / 상태 갱신 |

> 현재 MVP는 **학습된 의료 AI 모델이나 LLM이 아닙니다.**  
> 설명 가능한 **Hybrid Risk Reasoning Engine**을 사용합니다.

---

## 3. 기술 구성

| 구분 | 구현 |
|---|---|
| Frontend | HTML5 / CSS3 / Vanilla JavaScript |
| Reasoning | Statistical Baseline + Rule-based Composite Risk Score |
| Tool | Browser Notification API + 선택적 SOLAPI SMS Backend |
| Memory / State | Web Storage(LocalStorage) |
| Feedback | 보호자 확인 / 미확인 재알림 |
| Test | 대표 Test Case 6건 |
| Server | 기본 기능은 없음 / 실제 SMS 사용 시 Vercel Serverless Function |
| External API Key | 기본 기능 없음 / SMS 사용 시 SOLAPI Key를 Vercel 환경변수로만 저장 |
| Model Weights | 없음 |

---

## 4. 가장 빠른 실행 방법

### 로컬 실행
`index.html`을 Edge 또는 Chrome에서 엽니다.

- Python 불필요
- 서버 불필요
- 설치 불필요
- 인터넷 연결 불필요

> 일부 브라우저는 `file://`에서 Notification 권한을 제한할 수 있습니다. 이 경우에도 **위험판단, 사건기록, Memory, Feedback**은 정상 동작합니다.

### GitHub Pages
GitHub Pages를 활성화하면 별도 설치 없이 웹에서 바로 실행할 수 있습니다.

```text
Settings
→ Pages
→ Build and deployment
→ Deploy from a branch
→ main / root
```

배포 후 예상 주소:

```text
https://jinkhanphd.github.io/silverguard-ai-agent/
```

---

## 5. 대표 Test Case 6건

| Case | 시나리오 | 기대 결과 | 기대 점수 |
|---|---|---:|---:|
| TC1 | 정상 | NORMAL | 2.0 |
| TC2 | 장시간 미활동 | WARNING | 48.4 |
| TC3 | 심박 이상 + 무응답 | DANGER | 74.2 |
| TC4 | 야간 외출 | WARNING | 34.6 |
| TC5 | 복합 고위험 | DANGER | 100 |
| TC6 | 데이터 오류 | WARNING | 25.0 |

Node.js 환경에서는 다음 명령으로 핵심 Risk Engine을 독립 검증할 수 있습니다.

```bash
node tests/risk-engine.test.js
```

GitHub Actions에서도 동일 테스트가 자동 실행됩니다.

**현재 GitHub Actions 자동 테스트: PASS**

---

## 6. 심사평가 항목과 구현 증거

| 심사 관점 | 확인 위치 |
|---|---|
| 문제·대상 사용자 | README / 화면 상단 Goal |
| AI Agent 판단·추론 | `src/js/risk-engine.js` |
| Tool/API 사용 | `src/js/notification.js` |
| End-to-End Workflow | `index.html`, `docs/WORKFLOW.md` |
| Memory / State | `src/js/storage.js` |
| Feedback | 보호자 확인 / 재알림 기능 |
| Test Case 5건 이상 | TC1~TC6, `tests/risk-engine.test.js` |
| 안전·한계 | `docs/SAFETY_LIMITATIONS.md` |
| 실행·검증 가능성 | `index.html` + GitHub Actions |

---

## 7. Repository Structure

```text
silverguard-ai-agent/
├─ index.html
├─ admin.html
├─ settings.html
├─ README.md
├─ NOTICE.md
├─ .gitignore
├─ .nojekyll
├─ .github/
│  └─ workflows/
│     └─ test.yml
├─ assets/
│  └─ css/
│     └─ style.css
├─ src/
│  └─ js/
│     ├─ risk-engine.js
│     ├─ storage.js
│     ├─ notification.js
│     ├─ test-cases.js
│     ├─ app.js
│     ├─ config.js
│     └─ sms.js
├─ tests/
│  └─ risk-engine.test.js
├─ docs/
│  ├─ ARCHITECTURE.md
│  ├─ WORKFLOW.md
│  ├─ SAFETY_LIMITATIONS.md
│  └─ SUBMISSION_CHECKLIST.md
├─ api/
│  └─ send-sms.js
├─ package.json
└─ offline/
   └─ SilverGuard_Offline_v0.3.html
```

---

## 8. 원본과 GitHub v1.0의 관계

- `offline/SilverGuard_Offline_v0.3.html`: 기존 단일 HTML 원본 보존
- GitHub v1.0: 동일 핵심 로직을 기능별 모듈로 분리
- 위험판정 기준과 핵심 Rule은 원본 v0.3과 동일하게 유지
- 목적: **심사·검증·유지보수·재현성 향상**

---

## 9. Safety / Limitations

본 프로젝트는 **경진대회·교육용 MVP**이며 의료진단 프로그램이 아닙니다.

실제 현장 적용 전에는 다음이 추가로 필요합니다.

- 실센서 / 웨어러블 연동
- 개인정보 보호
- 사용자 인증 및 권한관리
- 보호자 / 복지기관 연계
- 실사용자·실데이터 반복 검증
- 응급상황 대응정책 검토

자세한 내용: [`docs/SAFETY_LIMITATIONS.md`](docs/SAFETY_LIMITATIONS.md)

---

## 10. v1.1 선택 기능: 관리자 대시보드 + 실제 SMS

- `admin.html`: 동일 브라우저 LocalStorage 사건 이력 대시보드
- `settings.html`: GitHub Pages 브라우저에 Backend URL만 저장
- `api/send-sms.js`: DANGER에서만 호출되는 SOLAPI Serverless Function
- 실제 보호자 이름·전화번호와 API Key/Secret은 공개 저장소에 저장하지 않고 Vercel Environment Variables에만 등록
- `전체 Test Case 자동실행`에서는 실제 SMS가 발송되지 않도록 차단
- 실제 SMS 연동 방법은 [`docs/SMS_SETUP.md`](docs/SMS_SETUP.md) 참고

---

## 11. Source Disclosure

- 비밀키 / API Key 없음
- 직접 학습한 모델 없음
- 외부 모델 가중치 없음
- 모든 핵심 위험판정 로직은 [`src/js/risk-engine.js`](src/js/risk-engine.js)에서 확인 가능
- Browser Notification은 **로컬 브라우저/OS 알림**입니다.
- v1.1의 실제 SMS는 별도 Backend 배포 및 환경변수 설정을 완료한 경우에만 동작하며, 저장소 자체만으로는 실제 문자가 발송되지 않습니다.

---

## 12. Submission Notes

- 경진대회 제출용 소스는 **실행·검증 가능성**을 우선합니다.
- 개인정보 대신 가명(예: 김OO 어르신)을 사용합니다.
- API Key, 비밀번호, 토큰을 저장소에 포함하지 않습니다.
- 위험점수는 의료적 정확도가 아니라 **MVP 위험판정 로직의 결과**입니다.

---

## 13. License

현재 제출본에는 별도의 오픈소스 라이선스를 지정하지 않았습니다.  
공개 배포·재사용 라이선스는 권리자가 별도로 결정해야 합니다.