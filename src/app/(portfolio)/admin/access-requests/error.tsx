"use client";

import { AccessRouteError } from "@/components/access/route-error";

export default function Error() {
  return <AccessRouteError title="열람 요청을 불러올 수 없습니다" href="/admin" linkLabel="대시보드" />;
}
