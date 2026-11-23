import type { Metadata } from "next";
import Link from "next/link";
import { privacyVersion, retentionRules } from "@/content/privacy";

export const metadata: Metadata = {
  title: "개인정보 안내",
  description: "열람 요청, 인증, 브라우저 저장 정보의 수집·이용 및 권리 문의 안내",
  robots: { index: false, follow: false },
};

export default function PrivacyPage() {
  return <article className="page-section privacy-page">
    <header className="section-heading"><div>
      <p className="eyebrow">PRIVACY</p><h1>개인정보 안내</h1>
      <p className="muted">정책 버전 {privacyVersion} · 1차 운영 연계 릴리스부터 적용</p>
    </div></header>
    <aside className="panel concept-card privacy-status" aria-labelledby="privacy-status">
      <h2 id="privacy-status">보관 기준과 실제 적용 상태</h2>
      <p>아래 기준으로 신규 실제 사용자 정보를 보관하고, 기한이 지난 기록을 1시간 주기의 정리 작업에서 확인합니다. 활성 권한·확인되지 않은 이력·처리 실패가 있으면 정리를 중단하거나 제외하고 확인합니다. 열람 종료·취소는 접근 권한을 차단하는 기능으로, 개인정보가 즉시 삭제되었다는 뜻은 아닙니다.</p>
      <p>열람 요청은 아래 목적·항목·보관 기준을 확인한 뒤 명시적으로 동의한 경우에 접수합니다. 동의한 정책 버전과 서버 접수 시각을 함께 기록합니다. 동의하지 않아도 일반 공개 페이지를 볼 수 있습니다.</p>
    </aside>
    <nav aria-label="개인정보 안내 목차" className="privacy-toc">
      <a href="#collection">처리하는 정보</a><a href="#retention">보관 기준</a>
      <a href="#storage">쿠키·실습 저장</a><a href="#providers">외부 서비스</a><a href="#rights">권리와 문의</a>
    </nav>
    <section id="collection" className="panel concept-card">
      <h2>어떤 정보를 왜 처리하나요?</h2>
      <dl className="privacy-list">
        <div><dt>열람 요청</dt><dd>회사명과 수신 이메일을 받아 요청을 검토하고, 승인 후 보호 자료 열람 링크를 안내합니다. 두 항목은 요청 처리에 필요하며, 입력하지 않으면 요청을 제출할 수 없습니다. 동의 여부·정책 버전·접수 시각은 동의 내용을 확인하는 근거로 요청 기록과 함께 처리합니다.</dd></div>
        <div><dt>관리자가 등록하는 대상 정보</dt><dd>회사명·이메일과 등록한 지원 항목, 담당자 연락 정보, 공고 주소, 메모를 열람 대상 관리에 사용합니다. 불필요한 개인정보나 민감정보는 입력하지 않습니다.</dd></div>
        <div><dt>인증·권한 관리</dt><dd>관리자의 Google 로그인 확인 정보와 초대·세션 식별 정보, 유효 기간·취소 상태를 이용해 접근 권한을 확인합니다. 일반 방문자에게 Google 로그인을 요구하지 않습니다.</dd></div>
      </dl>
    </section>
    <section id="retention" className="panel concept-card">
      <h2>보관 기준</h2><p className="muted">목적 종료와 최종 권한 종료가 모두 필요한 기록은 더 늦게 확인된 시각을 기준으로 합니다. 활성 권한이 남은 동안에는 그와 연결된 기록을 먼저 삭제하지 않습니다.</p>
      <p>이 기준은 신규 실제 사용자 데이터에 적용합니다. 서비스 운영에 필요한 관리자 계정 정보와 업체 자체의 운영 기록에는 다른 보관 조건이 적용될 수 있습니다.</p>
      <dl className="privacy-list retention-list">{retentionRules.map(([name, period]) => <div key={name}><dt>{name}</dt><dd>{period}</dd></div>)}</dl>
      <p>활성 권한이 남아 있거나 정확한 종료 근거가 확인되지 않은 기록은 정기 파기에서 제외하고 확인합니다. 회사명·이메일이 포함된 대상 정보와 연결된 원래 요청 사본도 함께 처리합니다. 별도 보관하는 최소 취소·파기 근거에는 회사명·이메일·초대 토큰 원문을 넣지 않습니다. 백업은 서비스 DB와 별도 보관 조건을 따르며 복원 시 취소·파기 상태를 재적용하고 검증하기 전에는 보호 자료 접근을 재개하지 않습니다.</p>
    </section>
    <section id="storage" className="panel concept-card">
      <h2>쿠키와 실습 기능의 저장 방식</h2>
      <p>인증 쿠키는 로그인·열람 권한 확인에 사용합니다. 열람 쿠키의 브라우저 보관 설정은 30일이지만 서버의 열람 권한 기간과는 다릅니다. 권한이 종료되면 쿠키가 남아 있어도 보호 자료를 열람할 수 없습니다. 열람 종료가 성공하면 해당 쿠키를 삭제합니다.</p>
      <p>관리자 쿠키는 서버가 정한 유효 기간을 따릅니다. Google 로그인용 임시 쿠키는 5분이며 로그인 응답을 확인할 때 삭제합니다.</p>
      <p>TodoList 입력 목록과 ShellGame 기록은 이 브라우저의 localStorage에 저장하며 자동 만료가 없습니다. 브라우저의 사이트 데이터 삭제 기능으로 지울 수 있습니다. 사이트 데이터 삭제만으로 서버의 열람 요청 정보가 삭제되지는 않습니다.</p>
      <p>Server Action 폼과 서버·클라이언트 역할 예제의 입력은 서버로 전송해 검증합니다. 예제 코드에는 해당 입력을 업무 DB에 저장하는 기능이 없지만, 모든 실습이 브라우저 안에서만 처리되는 것은 아닙니다. 실습에는 실제 개인정보를 입력하지 마세요.</p>
    </section>
    <section id="providers" className="panel concept-card">
      <h2>외부 서비스와 전송</h2>
      <p>열람 요청은 Vercel의 프론트 서버를 거쳐 Cloudflare로 보호된 Spring 서비스와 AWS 데이터베이스에서 처리합니다. Google은 관리자 로그인에 사용합니다. 제공 업체의 서비스 운영 기록이 남을 수 있습니다.</p>
      <dl className="privacy-list">
        <div><dt>Vercel · 웹 호스팅과 요청 중계</dt><dd>회사명·이메일과 요청 정보가 프론트 서버를 통과합니다. 1차 릴리스의 함수 실행 지역은 서울로 설정하며, CDN·운영 로그·지원 처리를 모두 국내로 제한한다는 뜻은 아닙니다. <a href="https://vercel.com/legal/privacy-notice">Vercel 개인정보 안내</a> · <a href="https://vercel.com/legal/terms">이용약관</a></dd></div>
        <div><dt>Cloudflare · 접근 보호와 전송</dt><dd>사이트와 API의 접근을 보호하는 네트워크를 사용합니다. 요청 경로·접속 관련 운영 정보가 처리될 수 있으며 전 세계 보호 네트워크의 처리까지 국내로 한정하지 않습니다. <a href="https://www.cloudflare.com/privacypolicy/">Cloudflare 개인정보 안내</a></dd></div>
        <div><dt>AWS · 서버·데이터베이스·백업</dt><dd>선택한 서버와 데이터베이스는 서울 리전에 있습니다. 계정·지원·알림 등 제공 업체의 모든 처리가 서울에 한정되는 것은 아닙니다. <a href="https://aws.amazon.com/privacy/">AWS 개인정보 안내</a></dd></div>
        <div><dt>Google · 관리자 인증과 문의 이메일</dt><dd>관리자 로그인에는 Google 인증을, 문의에는 Gmail을 사용합니다. 문의 이메일을 보내면 이메일 내용과 회신 주소가 Google 서비스를 통해 처리되며, 개인 Gmail에 Workspace 전용 처리계약이 적용된다고 보장하지 않습니다. <a href="https://policies.google.com/privacy">Google 개인정보 안내</a></dd></div>
      </dl>
      <p>플랫폼의 운영 기록은 각 업체의 조건을 따릅니다. 개인정보의 모든 사본이 위 업무 보관 기간과 같은 날 삭제되거나, 민감한 URL이 항상 자동으로 가려진다고 보장하지 않습니다. 사용 중인 Vercel Hobby에 Pro·Enterprise 대상 처리계약이 동일하게 적용된다는 보장은 하지 않습니다.</p>
    </section>
    <section id="rights" className="panel concept-card">
      <h2>열람·정정·삭제·처리정지 문의</h2>
      <p>본인 정보의 열람·정정·삭제·처리정지를 아래 이메일로 요청할 수 있습니다. 접수한 이메일과 같은 주소로 회신해 본인 여부를 확인하고, 대상과 처리 범위를 확인한 뒤 필요한 조치를 하고 결과를 회신합니다. 바로 처리할 수 없는 사유가 있으면 이유를 안내합니다. 비밀번호, 인증 코드, 초대 링크 원문은 보내지 마세요.</p>
      <p>문의 창구: <a className="text-link" href="mailto:gudrms7328@gmail.com">gudrms7328@gmail.com</a>. 회사명과 회신받을 이메일, 요청 내용을 필요한 범위에서만 알려주세요. 이메일을 보내면 Gmail을 통해 문의가 전달됩니다.</p>
      <p>화면의 ‘열람 종료’는 해당 세션의 접근만 종료합니다. 개인정보 삭제 요청과는 별개입니다.</p>
    </section>
    <Link className="text-link" href="/access">열람 요청으로 돌아가기 →</Link>
  </article>;
}
