import Link from "next/link";

export default function NotFound() {
  return <main className="site page-section">
    <h1>페이지를 찾을 수 없습니다.</h1>
    <div className="actions"><Link className="button primary" href="/">홈으로 돌아가기 →</Link></div>
  </main>;
}
