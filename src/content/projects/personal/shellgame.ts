export const shellgame = {
  slug: "shellgame", title: "ShellGame", tech: "JavaScript · CSS",
  summary: "컵 선택, 라운드 결과, 점수와 최근 기록",
  preview: "▰　▰　▰",
  features: ["세 컵 중 하나 선택", "공 공개와 라운드별 정답·오답 표시", "점수와 최근 기록 저장 및 초기화"],
  architecture: "JavaScript에서 공의 위치와 라운드 결과를 계산하고, TSX에서 컵·점수·기록을 렌더링합니다.",
  troubleshooting: "한 라운드에서 컵을 한 번만 선택하도록 결과 상태를 확인합니다.",
  checks: "컵을 선택해 공의 위치를 확인하고, 다음 라운드를 시작하거나 기록을 초기화하세요.",
};
