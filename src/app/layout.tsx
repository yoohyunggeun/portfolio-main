import type { Metadata } from "next";
import "./globals.css";
import "./ui-v33.css";

export const metadata: Metadata = {
  title: { default: "Geunyfolio", template: "%s | Geunyfolio" },
  description: "Java 기반 기업 시스템 구축·연동·운영 경험과 개인 개발 포트폴리오",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="ko" data-theme="black" suppressHydrationWarning><head><script dangerouslySetInnerHTML={{ __html: `(function(){try{document.documentElement.dataset.theme=localStorage.getItem('portfolio-ui-theme-v33')==='white'?'white':'black'}catch(e){}})()` }} /></head><body>{children}</body></html>;
}
