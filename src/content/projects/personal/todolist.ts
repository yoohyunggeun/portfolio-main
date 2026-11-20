export const todolist = {
  slug: "todolist", title: "TodoList", tech: "JavaScript · React",
  language: "javascript",
  summary: "할 일 추가·수정·삭제, 완료 처리와 상태별 필터",
  capture: { width: 528, height: 431 },
  topic: "이벤트",
  technologies: [
    { name: "React 상태 · 폼 이벤트", usage: "입력값과 수정 중인 항목 ID는 별도 상태에 둡니다. 추가·수정·완료 토글은 함수형 상태 갱신을 사용해 최신 목록에 적용합니다." },
    { name: "JavaScript 배열 · 항목 ID", usage: "항목 ID로 수정 대상을 찾습니다. 필터는 원본 배열을 보존하고 각 항목의 완료 여부로 표시할 목록을 계산합니다." },
    { name: "localStorage", usage: "마운트 후 브라우저에서 목록을 읽고, 복원이 끝난 뒤부터 변경을 저장합니다. 초기 빈 목록이 기존 데이터를 덮는 일을 막습니다." },
  ],
  features: ["할 일 추가·수정·삭제", "완료 상태 전환과 전체·진행 중·완료 필터", "브라우저에 목록 저장 및 복원"],
  architecture: "TSX에서 폼과 목록을 렌더링하고, JavaScript 함수에서 항목 변경과 상태 필터를 처리합니다.",
  troubleshooting: "빈 입력은 저장하지 않고, 수정과 삭제는 목록 위치 대신 항목 ID를 기준으로 처리합니다.",
  checks: "항목을 추가하고 수정한 뒤 완료 필터에서 확인하세요. 새로고침으로 저장 복원을 확인할 수 있습니다.",
};
