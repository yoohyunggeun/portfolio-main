export const todolist = {
  slug: "todolist", title: "TodoList", tech: "JavaScript · DOM",
  summary: "할 일 추가·수정·삭제, 완료 처리와 상태별 필터",
  preview: "□ 프로젝트 정리 · □ 필터 확인",
  features: ["할 일 추가·수정·삭제", "완료 상태 전환과 전체·진행 중·완료 필터", "브라우저에 목록 저장 및 복원"],
  architecture: "TSX에서 폼과 목록을 렌더링하고, JavaScript 함수에서 항목 변경과 상태 필터를 처리합니다.",
  troubleshooting: "빈 입력은 저장하지 않고, 수정과 삭제는 목록 위치 대신 항목 ID를 기준으로 처리합니다.",
  checks: "항목을 추가하고 수정한 뒤 완료 필터에서 확인하세요. 새로고침으로 저장 복원을 확인할 수 있습니다.",
};
