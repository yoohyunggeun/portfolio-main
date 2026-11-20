export const phases = ["설계", "준비", "구현", "검증·공개", "확장"] as const;
export const statuses = ["설계 완료", "완료", "진행 중", "예정", "기획 후보"] as const;
type Task = { id: string; phase: typeof phases[number]; title: string; status: typeof statuses[number]; result: string };

export const tasks: readonly Task[] = [
  { id: "visitor-design", phase: "설계", title: "방문자 UI·URL·프로젝트 데이터 설계", status: "설계 완료", result: "통합 UI v0.9와 목록·상세 구조 확정" },
  { id: "platform-design", phase: "설계", title: "Vercel·AWS·DB 역할 정리", status: "설계 완료", result: "화면·API·운영 데이터 책임 구분" },
  { id: "admin-design", phase: "설계", title: "관리자·초대·제작 과정 UI", status: "설계 완료", result: "v0.9에서 접근 흐름과 진행 보드 시안 확정" },
  { id: "auth-design", phase: "설계", title: "운영 인증·초대 세션·DB 상세", status: "예정", result: "운영 로그인, 발급·만료·연장·취소 규칙 정리" },
  { id: "repositories", phase: "준비", title: "저장소 운영과 로컬 개발 환경 구성", status: "완료", result: "개발·공개 저장소 분리 및 VS Code에서 로컬 실행" },
  { id: "visitor", phase: "구현", title: "방문자 페이지와 JavaScript 실행 예제", status: "완료", result: "PC·모바일 탐색 및 TodoList·ShellGame 실행 확인" },
  { id: "local-access", phase: "구현", title: "로컬 보호 상세와 관리자 화면", status: "완료", result: "열람 요청, 승인·거절, 초대와 세션 관리 연결" },
  { id: "build-log", phase: "구현", title: "제작 과정과 전체 작업 목록", status: "진행 중", result: "공개용 진행 기록과 단계·상태 필터 검증" },
  { id: "access-api", phase: "구현", title: "운영 관리 API 연동", status: "예정", result: "보호 상세와 관리자 화면을 운영 인증 API에 연결" },
  { id: "release", phase: "검증·공개", title: "권한·모바일 검증과 최초 공개", status: "예정", result: "권한·만료·링크를 검증하고 첫 공개 준비" },
  { id: "services", phase: "확장", title: "개별 백엔드·AI 실행 예제 연결", status: "예정", result: "각 프로젝트의 코드·실행 결과 연결" },
  { id: "ai-summary", phase: "확장", title: "AI 제작 로그 요약", status: "기획 후보", result: "기록 기반 요약을 제작자가 확인한 뒤 게시" },
];
