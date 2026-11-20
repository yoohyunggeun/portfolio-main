type WorkType = { id: string; label: string; projects: readonly string[] };

export const workTypes: readonly WorkType[] = [
  { id: "integration", label: "개발/API 연동", projects: [
    "mes-label", "poscodx-safety", "poscodx-motor", "lgcns-aws-migration", "lgcns-wms", "lh-education", "kari-api",
  ] },
  { id: "infrastructure", label: "서버·환경 구축", projects: [
    "poscodx-safety", "poscodx-chemical", "lh-education", "naval-cloud",
  ] },
  { id: "cloud-migration", label: "클라우드 이관", projects: [
    "ndms-migration", "lgcns-aws-migration", "naval-cloud",
  ] },
  { id: "support", label: "운영·기술 지원", projects: [
    "mes-label", "poscodx-safety", "poscodx-chemical", "poscodx-motor", "ndms-migration",
    "lgcns-aws-migration", "lgcns-wms", "lh-education", "naval-cloud", "kari-api",
  ] },
];
