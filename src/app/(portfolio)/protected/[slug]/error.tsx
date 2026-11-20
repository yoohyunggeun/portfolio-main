"use client";

import { AccessRouteError } from "@/components/access/route-error";

export default function Error() {
  return <AccessRouteError title="열람 권한을 확인할 수 없습니다" href="/work/mes-label" linkLabel="공개 프로젝트 소개" />;
}
