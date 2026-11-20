export const shellgame = {
  slug: "shellgame", title: "ShellGame", tech: "JavaScript · CSS",
  language: "javascript",
  summary: "공이 든 컵을 기억하고, 교환을 따라가며 레벨에 도전하는 게임",
  capture: { width: 528, height: 451 },
  topic: "비동기",
  technologies: [
    { name: "배열과 컵 ID", usage: "자리 배열만 교환하고 공이 든 컵 ID는 유지합니다. 같은 자리 쌍을 연속 선택하지 않아 첫 두 교환에서 세 컵이 모두 움직입니다." },
    { name: "React useEffect · 타이머", usage: "공개, 덮기, 교환, 선택을 단계로 관리합니다. 교환 간격이 끝나면 다음 이동을 시작하고 단계가 바뀌거나 화면을 떠날 때 타이머를 정리합니다." },
    { name: "CSS transform · keyframes", usage: "한 판 위에서 컵을 좌우로 이동시키고, 교환할 두 컵에 서로 다른 높이의 경로를 줍니다. 모션 줄이기에서는 위치만 갱신합니다." },
    { name: "localStorage", usage: "최근 기록과 정답 횟수를 브라우저에 저장하고 새로고침 후 복원합니다." },
  ],
  features: ["공이 든 컵을 먼저 공개한 뒤 세 컵을 차례로 교환", "정답이면 다음 레벨로 자동 진행, 오답이면 공 공개 후 재시작", "레벨별 교환 횟수·속도 조절과 최근 플레이 기록 저장"],
  architecture: "JavaScript에서 컵 순서를 교환하고, React에서 공 공개·셔플·선택 단계에 따라 화면을 렌더링합니다. 공은 처음 들어간 컵에 그대로 남습니다.",
  troubleshooting: "마지막 교환이 끝나면 컵 선택을 활성화합니다. 화면을 떠나거나 기록을 초기화하면 대기 중인 진행을 정리합니다.",
  checks: "시작 후 공이 들어간 컵을 따라가세요. 정답이면 다음 레벨로 넘어가고 오답이면 레벨 1부터 다시 시작할 수 있습니다.",
};
