export const privacyVersion = "2026-11-23.v1";

// Policy targets, not a claim that production purge jobs are enabled.
export const retentionRules = [
  ["대기 중인 열람 요청", "접수 후 30일"],
  ["거절된 열람 요청", "거절 결정 후 30일"],
  ["승인된 대상의 정보", "제공 목적 종료와 최종 권한 종료가 모두 확인된 뒤 30일"],
  ["관리자·열람 세션 기록", "종료 또는 만료 후 7일"],
  ["초대 링크 기록", "링크가 종료되고 연결된 모든 열람 세션이 종료된 후 7일"],
  ["Google 로그인 임시 인증 기록", "만료 즉시 정리 대상, 24시간 이내 정리 목표. 사용 시 즉시 소비·삭제 유지"],
  ["최소 관리자 감사 기록", "90일"],
] as const;
