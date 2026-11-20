const kst = new Intl.DateTimeFormat("ko-KR", {
  year: "numeric", month: "2-digit", day: "2-digit", hour: "2-digit", minute: "2-digit",
  hourCycle: "h23", timeZone: "Asia/Seoul",
});

export function formatKst(timestamp: number | null) {
  return timestamp ? kst.format(timestamp * 1000) : "—";
}
