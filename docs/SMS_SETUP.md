# SilverGuard 실제 SMS 연동 설정

SilverGuard v1.1은 GitHub Pages 프론트엔드와 별도 Vercel Serverless Function을 이용해 실제 보호자 SMS를 보낼 수 있도록 구성되어 있습니다.

## 보안 원칙
실제 보호자 이름·전화번호, SOLAPI API Key/Secret, 발신번호는 공개 GitHub 저장소에 넣지 않습니다. Vercel 프로젝트의 Environment Variables에만 입력합니다.

## 필요한 환경변수
- SOLAPI_API_KEY
- SOLAPI_API_SECRET
- SOLAPI_FROM: SOLAPI에 사전 등록된 발신번호
- GUARDIAN_NAME: 실제 보호자 이름
- GUARDIAN_PHONE: 실제 수신 휴대폰 번호
- ALLOWED_ORIGIN: https://jinkhanphd.github.io

## 동작 조건
- 사용자 화면에서 '실제 보호자 SMS 발송 활성화'를 직접 체크해야 합니다.
- 위험등급이 DANGER인 경우에만 SMS Backend를 호출합니다.
- '전체 Test Case 자동실행'은 실제 SMS를 발송하지 않습니다.
- 브라우저 알림과 SMS는 별도 Tool입니다.

## 배포
1. 이 GitHub 저장소를 Vercel 프로젝트로 Import합니다.
2. Vercel Settings > Environment Variables에 위 값을 등록합니다.
3. Deploy 후 생성된 https://...vercel.app 주소를 복사합니다.
4. GitHub Pages의 settings.html에서 Backend URL로 저장합니다.
5. TC5 등 DANGER 시나리오에서 SMS 체크박스를 켠 뒤 1회 테스트합니다.

## 주의
현재 관리자 대시보드는 동일 브라우저 LocalStorage 기반입니다. 원격 관리자·다중기기 조회를 위해서는 다음 단계에서 서버 DB(Supabase/Firebase/PostgreSQL 등)를 연결해야 합니다.
