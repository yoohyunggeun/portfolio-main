import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: { default: "Career × Code", template: "%s | Career × Code" },
  description: "Java 기반 기업 시스템 구축·연동·운영 경험과 개인 개발 포트폴리오",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="ko"><body>{children}</body></html>;
}
