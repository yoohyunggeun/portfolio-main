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
    id: "ui-v33-production",
    date: "2026-11-25",
    title: "UI v3.3 운영 반영과 실제 화면 확인",
    status: "운영 반영·읽기 검증 완료",
    works: [{
      id: "ui-v33-production-readonly",
      area: "운영·검증",
      title: "두 테마·새 홈·기존 권한 경계 확인",
      background: "개발·합성 검증을 마친 제품 변경만 운영에 반영했습니다.",
      change: "블랙·화이트 테마와 움직이는 텍스트 손잡이, 중앙 카드·입자·로딩을 적용했습니다. Storybook과 합성 시험 환경은 운영에 포함하지 않았습니다.",
      version: "FE bcb142d · 운영 확인 2026-11-25 20:03–20:06 KST · 서울 icn1",
      verified: "운영 PC1440·모바일390의 두 테마와 일반 방문 권한·HTML/RSC·캐시·상태 경로를 확인했습니다. 정상 Google 관리자의 기존 네 목록·설정·새 홈 조회와 로그아웃 후 새 일반 방문 접근 차단을 확인했습니다. 기존 고객 데이터·초대·권한은 생성·변경·삭제하지 않았습니다. 역할별 양성 기능과 전체 모션 검사는 앞선 개발·합성 결과이며 물리 모바일·전체 접근성 인증을 뜻하지 않습니다.",
      related: "/",
    }],
  },
  {
    id: "ui-v33-development",
    date: "2026-11-25",
    title: "UI v3.3 개발과 직접 확인 가능한 미리보기",
    status: "개발·검증 완료 · 운영 보류",
    works: [
      {
        id: "ui-v33-development-screens",
        area: "화면·기능",
        title: "두 테마·중앙 카드·입자·로딩",
        background: "기존 경력·기술 설명과 실행 기능을 유지하며 화면 표현을 정리했습니다.",
        change: "블랙·화이트 테마, 여섯 역량의 중앙·양옆 세 카드, 장식용 입자와 로딩을 적용했습니다. 테마 스위치는 문구가 든 손잡이가 움직이며 현재 테마를 Black/White로 표시합니다. 헤더 배지와 크기·모서리를 맞추고 간격은 8px로 정리했습니다.",
        version: "UI v3.3 개발본 · 개발·검증 2026-11-25 · 운영 미반영",
        verified: "320~2560px 다섯 폭과 두 테마, 키보드·스와이프·자동재생·일시정지·모션 줄이기, 미지원·저장 실패 환경을 확인했습니다. 기존 콘텐츠와 34개 기록·12개 기능의 원본을 보존했습니다. 물리 모바일·운영의 새 UI 검증은 하지 않았습니다.",
        related: "/",
      },
      {
        id: "ui-v33-development-storybook",
        area: "운영·검증",
        title: "실제 컴포넌트와 분리된 검증",
        background: "시안 이미지뿐 아니라 직접 조작할 수 있는 개발 화면이 필요했습니다.",
        change: "페이지에서 쓰는 컴포넌트 7개를 Storybook·문서·동작 검사로 연결했습니다. 개발 미리보기의 관리자·전체 초대·제한 초대는 합성 자료로 분리했습니다.",
        version: "UI v3.3 · Next/Storybook 개발 빌드 완료 · 2026-11-25",
        verified: "Storybook 실제 play와 두 테마 14개 자동 접근성 검사에서 위반이 없었고, 실제 Next와 합성 API의 역할·모션 8개 시나리오를 확인했습니다. 전체 접근성 인증이나 실제 Google·운영 DB 재시험을 뜻하지 않습니다. 개발 완료 후 운영 반영은 보류했습니다.",
        related: "/build-log/tasks",
      },
    ],
  },
  {
    id: "role-url-production",
    date: "2026-11-25",
    title: "관리자·방문자 역할 분리와 안전한 링크 조회",
    status: "운영 반영·읽기 검증 완료",
    works: [{
      id: "role-url-production-boundary",
      area: "인증·권한",
      title: "명시적 역할 전환과 초대 URL 관리",
      background: "같은 브라우저에 남은 관리자 인증이 초대 열람에 묵시적으로 섞이지 않도록 정리했습니다.",
      change: "초대 열람과 관리자 로그인을 분리하고 열람 종료 후 일반 방문으로 돌아가도록 했습니다. 새 링크는 암호화해 유효 상태에서 관리자만 재조회할 수 있게 했으며, 취소 후 필터·목록 배치를 유지했습니다. 전체 초대는 홈, 제한 초대는 허용된 자료로 연결합니다.",
      version: "운영 FE cb3f533 / BE 83afe56 · 반영·확인 2026-11-25",
      verified: "분리된 실제 백엔드·DB·Next에서 기능 8개를 확인한 뒤, 운영의 일반 방문 권한·캐시와 정상 관리자 읽기·로그아웃을 검증했습니다. 기존 링크는 모두 종료 상태여서 운영 URL 복호 조회·새 초대 발급은 하지 않았습니다. 원문을 보관하지 않은 이전 링크는 복원할 수 없습니다. 기존 고객 데이터를 변경·삭제하지 않았습니다.",
      related: "/access/status",
    }],
  },
  {
    id: "never-issued-production",
    date: "2026-11-25",
    title: "초대를 발급하지 않은 대상의 종료 흐름 보완",
    status: "운영 반영·읽기 검증 완료",
    works: [{
      id: "never-issued-production-lifecycle",
      area: "서버·DB",
      title: "확인된 신규 대상의 종료·정리 기준",
      background: "한 번도 권한을 발급하지 않은 신규 대상에 과거 권한의 종료 시각을 요구하는 모순을 해결했습니다.",
      change: "완전한 신규 이력이 확인된 경우만 별도 처리하고, 실제로 없었던 권한 종료 시각을 만들지 않았습니다. 화면 안내와 API·시간별 정리 기준을 함께 맞췄습니다.",
      version: "당시 운영 FE d23e270 / BE 10a79cc · 반영 2026-11-25",
      verified: "분리된 실제 백엔드·DB·Next의 7개 기능 검증과 운영 읽기·권한 경계 확인을 구분했습니다. 실제 고객의 대상 취소·목적 종료·삭제나 기간 경과 파기를 새로 실행하지 않았으며, 불완전한 과거 이력을 임의로 허용하지 않았습니다.",
      related: "/privacy",
    }],
  },
  {
    id: "admin-v32-production",
    date: "2026-11-24",
    title: "관리자 UI v3.2와 연결 기록 정리",
    status: "당시 운영 반영·읽기 검증 완료",
    works: [{
      id: "admin-v32-production-management",
      area: "화면·기능",
      title: "대상·요청·링크·세션의 관계를 명확하게",
      background: "승인된 요청과 실제 초대 대상, 연결된 권한 기록을 혼동하지 않도록 정리했습니다.",
      change: "회사 아래 이메일·지원 건·대상을 구분하고 전체 필터·최신 등록순을 맞췄습니다. 실제 동의 증적 표시, 정확한 승인 대상 수정 연결, 접근 취소와 영구 삭제의 영향 미리보기를 구분했습니다. 링크의 연결 세션부터 명시적으로 정리하도록 안내했습니다.",
      version: "UI v3.2 및 관리자 UX 후속 · 운영 반영 2026-11-24",
      verified: "생성·수정·삭제 양성 동작은 분리된 DB·실제 앱에서 검증했습니다. 운영에서는 정상 관리자 조회·수정 화면 진입·미리보기·로그아웃과 일반 방문자 캐시 경계를 확인했으며 기존 데이터에 대한 저장·발급·취소·삭제는 실행하지 않았습니다.",
      related: "/build-log",
    }],
  },
  {
    id: "ui-v31-production",
    date: "2026-11-24",
    title: "UI v3.1 운영 반영과 실제 권한 검증",
    status: "운영 검증 완료",
    works: [
      {
        id: "ui-v31-production-screens",
        area: "화면·기능",
        title: "승인 화면 반영과 PC·모바일 확인",
        background:
          "기존 기능과 지난 제작 기록을 유지하며 승인한 UI를 반영했습니다.",
        change:
          "경력·교육·기술 역량, 홈 카드, 반응형 관리자 화면과 제작 기록 탐색을 정리했습니다.",
        version: "FE 79a4618 · 반영 2026-11-24 18:11 KST · 서울 icn1",
        verified:
          "실제 운영의 PC·모바일 배치, 교육 연결, 프로젝트 필터·페이지 이동과 기존 실행 기능을 확인했습니다. 개발 단계에서는 기존 12개 기능과 과거 기록 보존도 확인했습니다.",
        related: "/experience",
      },
      {
        id: "ui-v31-production-access",
        area: "인증·권한",
        title: "프로젝트 범위와 방문자 자기 종료",
        background:
          "서버의 실제 권한과 만료 시각을 화면·자료·실행 경계에서 일관되게 사용합니다.",
        change:
          "관리자와 전체 열람 방문자의 프로젝트 접근, 서버 기준 남은 시간·절대 만료와 자기 종료를 연결했습니다.",
        version:
          "FE 79a4618 / BE adac22f · 실제 확인 2026-11-24 18:31–18:32 KST",
        verified:
          "독립 모바일390·PC1360 두 세션에서 정상 열람, 자기 종료와 다른 세션 보존, 종료 토큰·뒤로가기·다른 탭 차단, HTML/RSC 캐시 방지와 서버 액션3개 무권한 거부를 확인했습니다. 제한 초대·만료 경계는 개발·합성 근거이며, 자연 1시간 경과는 운영에서 재현하지 않았습니다.",
        related: "/access/status",
      },
    ],
  },
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
const currentResults: Record<string, string> = {
  "auth-design": "Google 관리자 인증·초대 범위·발급·만료·연장·취소·자기 종료 규칙 구현 및 검증 완료",
  "build-log": "날짜·분야·작업 탐색과 원본 보존 · v3.3 개발·운영 결과와 과거 원문을 분리해 최신화",
  "access-api": "요청·승인·동의·대상·링크·세션과 보호 자료의 서버 인증 연동 완료",
  "release": "1차 운영과 후속 관리자·권한 개선 검증 완료 · UI v3.3 반영·관리자 읽기와 로그아웃 후 캐시 경계 확인 완료",
};
const recentTasks: typeof tasks = [
  { id: "admin-v32", phase: "구현", title: "관리자 UI·대상과 연결 기록 관리", status: "완료", result: "v3.2 및 후속 관리자 UX 반영·운영 읽기 검증 완료 · 기존 데이터 보존" },
  { id: "role-url", phase: "검증·공개", title: "관리자·초대 역할 분리와 안전한 URL 조회", status: "완료", result: "분리 환경 기능8·운영 권한/관리자 읽기·캐시 검증 완료 · 이전 미보관 URL 복원 불가 안내" },
  { id: "ui-v33", phase: "구현", title: "UI v3.3·테마·모션·Storybook", status: "완료", result: "개발·빌드·반응형·합성 역할·Storybook 검사 완료 · 운영 반영 완료" },
  { id: "ui-v33-production", phase: "검증·공개", title: "UI v3.3 운영 반영", status: "완료", result: "2026-11-25 서울 운영 반영 · 두 테마·권한·관리자 읽기·로그아웃 후 캐시 확인 완료" },
];
// The original task array is retained unchanged as a historical snapshot.
export const currentTasks = [...tasks.map((task) =>
  completed.has(task.id)
    ? {
        ...task,
        status: "완료" as const,
        result: currentResults[task.id],
      }
    : task,
), ...recentTasks];

