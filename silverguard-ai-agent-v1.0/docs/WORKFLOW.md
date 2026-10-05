# End-to-End Workflow

1. **Goal**: 독거노인 위험상황 조기 감지 및 보호자 알림
2. **Data**: 미활동 시간, 심박, 시간대, 현관문 이벤트, 외부 위치, 사용자 응답, 메모
3. **Validation**: 비정상/누락 데이터 확인
4. **Reasoning**: 기준선 편차 + 위험 규칙 + 복합위험 점수
5. **Decision**: NORMAL / WARNING / DANGER
6. **Tool Use**: 위험 시 Browser Notification API 호출
7. **Memory**: LocalStorage에 사건·점수·근거·알림·확인상태 저장
8. **Feedback**: 보호자 확인/조치완료 또는 미확인 재알림
9. **Verification**: 대표 Test Case 6건 실행 및 결과 확인

## Action Policy
- NORMAL: 정상 상태 기록 → 지속 모니터링
- WARNING: 주의 알림 → 30분 이내 재확인
- DANGER: 즉시 알림 → 담당자 확인 권고 → 미확인 시 재알림
