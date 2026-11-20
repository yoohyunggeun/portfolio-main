import { LoadingPanel } from "@/components/access/loading-panel";

export default function Loading() {
  return <LoadingPanel title="열람 요청 불러오는 중" description="요청 목록과 처리 상태를 확인하고 있습니다." list />;
}
