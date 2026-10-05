# SilverGuard

**독거노인 실시간 위기알림 AI Agent**  
2026 제4회 경남 AI·SW 경진대회 제출을 위한 Level 3 MVP 소스 구조입니다.

> SilverGuard는 질문에 답하는 챗봇이 아니라, 상태 데이터를 분석하고 위험을 판단한 뒤 Tool을 실행하고 사건 상태를 기억하며 보호자 확인을 Feedback으로 반영하는 실행형 AI Agent MVP입니다.

## 1. 핵심 Workflow

```text
상태 데이터 입력
→ 데이터 유효성 검사
→ 통계적 이상징후 분석
→ 복합 위험판정
→ NORMAL / WARNING / DANGER
→ Browser Notification Tool
→ 사건 Memory 저장
→ 보호자 확인 또는 재알림
→ 상태 갱신 / Feedback
```

## 2. 기술 구성

| 구분 | 구현 |
|---|---|
| Frontend | HTML5 / CSS3 / Vanilla JavaScript |
| Reasoning | 통계적 기준선 편차 + 규칙 기반 복합 위험점수 |
| Tool | Browser Notification API |
| Memory / State | Web Storage(LocalStorage) |
| Feedback | 보호자 확인 / 미확인 재알림 |
| Test | 대표 Test Case 6건 |
| Server | 없음 |
| External API Key | 없음 |

현재 MVP는 **학습된 의료 AI 모델이나 LLM이 아닙니다.** 설명 가능한 Hybrid Risk Reasoning Engine을 사용합니다.

## 3. 가장 빠른 실행 방법

### GitHub Pages
저장소를 GitHub Pages로 배포하면 별도 설치 없이 웹에서 실행할 수 있습니다.

`Settings → Pages → Deploy from a branch → main / root`

### 로컬 실행
`index.html`을 Edge 또는 Chrome에서 열면 됩니다. Python, 서버, 설치가 필요 없습니다.

> 일부 브라우저는 `file://`에서 Notification 권한을 제한할 수 있습니다. 이 경우에도 판단, 사건기록, Memory/Feedback 기능은 동작합니다.

## 4. Test Case

| Case | 설명 | 기대 결과 | 기대 점수 |
|---|---|---:|---:|
| TC1 | 정상 | NORMAL | 2.0 |
| TC2 | 장시간 미활동 | WARNING | 48.4 |
| TC3 | 심박 이상 + 무응답 | DANGER | 74.2 |
| TC4 | 야간 외출 | WARNING | 34.6 |
| TC5 | 복합 고위험 | DANGER | 100 |
| TC6 | 데이터 오류 | WARNING | 25.0 |

Node.js가 있다면 다음 명령으로 순수 Risk Engine을 검증할 수 있습니다.

```bash
node tests/risk-engine.test.js
```

GitHub Actions에서도 동일 테스트를 자동 실행합니다.

## 5. Repository Structure

```text
silverguard-ai-agent/
├─ index.html
├─ README.md
├─ assets/css/style.css
├─ src/js/
│  ├─ risk-engine.js
│  ├─ storage.js
│  ├─ notification.js
│  ├─ test-cases.js
│  └─ app.js
├─ tests/risk-engine.test.js
├─ docs/
│  ├─ ARCHITECTURE.md
│  ├─ WORKFLOW.md
│  ├─ SAFETY_LIMITATIONS.md
│  └─ SUBMISSION_CHECKLIST.md
├─ offline/SilverGuard_Offline_v0.3.html
└─ .github/workflows/test.yml
```

## 6. 원본과 GitHub v1.0의 관계

- `offline/SilverGuard_Offline_v0.3.html`: 기존 단일 HTML 원본 보존
- GitHub v1.0: 동일 핵심 로직을 기능별 모듈로 분리해 심사·검증·유지보수가 쉽도록 재구성
- 위험판정 수치와 핵심 Rule은 원본 v0.3과 일치하도록 유지

## 7. Safety / Limitations

본 프로젝트는 경진대회/교육용 MVP이며 의료진단 프로그램이 아닙니다. 실제 현장 적용 전에는 실센서 연동, 개인정보 보호, 인증·권한관리, 기관 연계, 실데이터 검증 및 응급대응정책 검토가 필요합니다. 자세한 내용은 [`docs/SAFETY_LIMITATIONS.md`](docs/SAFETY_LIMITATIONS.md)를 참고하세요.

## 8. Source Disclosure

- 비밀키/API Key 없음
- 외부 학습 모델 가중치 없음
- 직접 학습한 모델 없음
- 모든 핵심 위험판정 로직은 `src/js/risk-engine.js`에서 확인 가능

## 9. License

현재 이 제출본에는 별도의 오픈소스 라이선스를 지정하지 않았습니다. 공개 배포·재사용 라이선스는 권리자가 별도로 결정해야 합니다.
