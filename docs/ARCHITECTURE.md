# SilverGuard Architecture

## 1. 목적
SilverGuard는 독거노인의 상태 데이터를 입력받아 위험도를 판단하고, 위험 시 알림 Tool을 실행하며, 사건 상태를 저장하고 보호자 확인 결과를 반영하는 경진대회용 AI Agent MVP입니다.

## 2. 구성

```text
User / Recorded Data
        |
        v
[UI: index.html]
        |
        v
[Risk Engine]
  - 데이터 유효성 검사
  - 통계적 기준선 편차
  - 복합 위험 규칙
  - NORMAL/WARNING/DANGER
        |
        +----> [Notification Tool]
        |       Browser Notification API
        |
        +----> [Memory / State]
                LocalStorage
                    |
                    v
             Guardian Feedback
             확인 / 재알림
```

## 3. 주요 파일
- `src/js/risk-engine.js`: 순수 위험판정 엔진
- `src/js/notification.js`: 브라우저 알림 Tool
- `src/js/storage.js`: 사건 상태/Memory 저장
- `src/js/test-cases.js`: 6개 대표 테스트 정의
- `src/js/app.js`: UI와 각 모듈 연결

## 4. AI/Reasoning 성격
현재 MVP는 학습된 의료 AI나 LLM이 아닙니다. 설명 가능한 **통계적 이상징후 + 규칙 기반 복합 위험판정(Hybrid Risk Reasoning Engine)** 구조입니다.
