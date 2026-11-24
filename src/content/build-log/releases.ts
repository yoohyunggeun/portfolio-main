import { tasks } from "./tasks";
export const areas = [
  "전체",
  "화면·기능",
  "인증·권한",
  "서버·DB",
  "운영·검증",
] as const;
export type LogArea = (typeof areas)[number];
export type ReleaseWork = {
  id: string;
  area: LogArea;
  title: string;
  background: string;
  change: string;
  version: string;
  verified: string;
  related: string;
};
export const releases: {
  id: string;
  date: string;
  title: string;
  status: string;
  works: ReleaseWork[];
}[] = [
  {
    id: "ui-v31",
    date: "2026-11-24",
    title: "UI v3.1 개편",
    status: "구현·검증 중",
    works: [
      {
        id: "ui-v31-screens",
        area: "화면·기능",
        title: "화면과 제작 기록의 탐색 개선",
        background: "승인한 UI v3.1을 기존 기능 위에 적용합니다.",
        change:
          "경력·교육·기술 역량, 반응형 관리 화면과 날짜별 제작 기록을 정리합니다.",
        version: "UI v3.1 · 최종 승인 2026-11-24",
        verified: "개발·운영 검증 결과는 완료 후 새 기록으로 남깁니다.",
        related: "/experience",
      },
      {
        id: "ui-v31-access",
        area: "인증·권한",
        title: "열람 상태와 프로젝트 권한 일관성",
        background:
          "로그인 상태와 실제 열람 범위를 같은 기준으로 확인해야 합니다.",
        change:
          "서버 만료 시각 표시, 프로젝트 목록·상세·실행과 서버 액션의 권한 검증을 연결합니다.",
        version: "UI v3.1 · 구현 중",
        verified: "이 항목의 운영 검증은 아직 완료로 표시하지 않습니다.",
        related: "/access/status",
      },
    ],
  },
  {
    id: "phase1-production",
    date: "2026-11-24",
    title: "1차 운영 릴리스",
    status: "운영 검증 완료",
    works: [
      {
        id: "phase1-consent",
        area: "화면·기능",
        title: "개인정보 안내와 동의 접수",
        background:
          "열람 요청의 목적·항목·보관 기준을 확인하도록 구성했습니다.",
        change: "명시 동의와 정책 버전, 서버 접수 시각을 연결했습니다.",
        version: "public 3a8d47a · 반영 2026-11-24",
        verified: "모바일 제출·완료 포커스와 실제 DB 동의 증적을 확인했습니다.",
        related: "/privacy",
      },
      {
        id: "phase1-purpose",
        area: "인증·권한",
        title: "목적 종료와 재발급 연동",
        background: "열람 종료와 자료 제공 목적의 종료는 서로 다른 상태입니다.",
        change:
          "활성 권한이 있으면 목적 종료를 차단하고, 재발급 시 종료 표시를 해제합니다.",
        version: "FE 3a8d47a / BE e94986b · 반영 2026-11-24",
        verified:
          "실제 관리자·독립 방문자 두 세션에서 종료와 다른 세션 보존을 확인했습니다.",
        related: "/access/status",
      },
      {
        id: "phase1-server",
        area: "서버·DB",
        title: "DB 변경과 최소 권한",
        background: "신규 데이터의 보관 기산과 처리 권한을 분리했습니다.",
        change:
          "마이그레이션, 제한된 실행 권한과 암호화 최소 이력을 연결했습니다.",
        version: "DB V001–V004 · 반영 2026-11-24",
        verified:
          "실제 TLS·권한·읽기 전용 점검과 안전한 집계 결과를 확인했습니다.",
        related: "/build-log",
      },
      {
        id: "phase1-operations",
        area: "운영·검증",
        title: "시간별 정리와 실패·복구 알림",
        background:
          "정리 실패와 확인이 필요한 상태를 놓치지 않도록 준비했습니다.",
        change: "시간별 작업, 범위 검사와 고정된 최소 알림을 연결했습니다.",
        version: "1차 운영 · 반영 2026-11-24",
        verified:
          "오분류를 보정한 뒤 정상 실행과 실제 실패·복구 메일 수신을 확인했습니다. 실제 기간 경과 업무 파기와 운영 DB 장애 주입은 하지 않았습니다.",
        related: "/privacy",
      },
    ],
  },
  {
    id: "reader-end-production",
    date: "2026-11-23",
    title: "인증·초대·열람 종료와 운영 기반",
    status: "당시 운영 검증 완료",
    works: [
      {
        id: "reader-end",
        area: "인증·권한",
        title: "방문자 직접 열람 종료",
        background:
          "초대받은 방문자가 이 기기의 열람을 직접 끝낼 수 있도록 했습니다.",
        change: "자기 세션 종료와 쿠키·화면 캐시 처리를 연결했습니다.",
        version: "public fc0f658 · 반영 2026-11-23",
        verified:
          "당시 PC·모바일 화면에서 이전 토큰 차단과 다른 방문자·관리자 권한 보존을 확인했습니다.",
        related: "/access/status",
      },
    ],
  },
  {
    id: "first-production",
    date: "2026-11-21",
    title: "첫 운영 기동·DB 연결",
    status: "당시 운영 확인",
    works: [
      {
        id: "first-health",
        area: "운영·검증",
        title: "최초 기동과 접근 차단 확인",
        background: "개발과 운영을 분리하고 실제 서버 연결을 준비했습니다.",
        change: "서버·DB 실행과 인증이 필요한 접근 경계를 확인했습니다.",
        version: "첫 운영 기동 기록 · 2026-11-21",
        verified:
          "최초 기동·연결·무권한 차단을 확인한 기록입니다. 이후 릴리스의 결과와 구분합니다.",
        related: "/build-log",
      },
    ],
  },
];
const completed = new Set([
  "auth-design",
  "build-log",
  "access-api",
  "release",
]);
// The original task array is retained unchanged as a historical snapshot.
export const currentTasks = tasks.map((task) =>
  completed.has(task.id)
    ? {
        ...task,
        status: "완료" as const,
        result: task.result + " · 후속 완료 근거: 2026-11-24 1차 운영 릴리스",
      }
    : task,
);
