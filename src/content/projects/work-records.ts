import { canReadProjects } from "@/server/access/session";
import "server-only";
import { api, springAccess } from "@/server/access/backend";
import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { isLocalPreview } from "@/server/access/local";

type PublicRecord = {
  id: number;
  slug: string;
  title: string;
  task: string;
  flow: string;
  tools: string;
  roles: readonly Role[];
};
type PrivateRecord = {
  id: number;
  organization: string;
  title: string;
  task: string;
  summary?: string;
};

export const workRoles = [
  { id: "dev", label: "개발·연동" },
  { id: "build", label: "구축·이관" },
  { id: "security", label: "보안" },
  { id: "report", label: "보고서·데이터" },
  { id: "support", label: "교육·지원" },
] as const;

type Role = (typeof workRoles)[number]["id"];

const records: readonly PublicRecord[] = [
  {
    id: 1,
    slug: "record-1",
    title: "제조 공정 라벨 보고서",
    task: "데이터 가공과 화면 연동 API를 개발하고 라벨 보고서를 제작했습니다.",
    flow: "MES 입력 데이터 → 가공 브로커 → 화면 연동 → 라벨 보고서",
    tools: "JSON 입력, 가공 브로커, 화면 연동 API",
    roles: ["dev", "report"],
  },
  {
    id: 2,
    slug: "record-2",
    title: "통합정보시스템 보고서 고도화",
    task: "통합정보시스템용 보고서를 개발했습니다.",
    flow: "업무 데이터에 맞춰 보고서 양식 개발",
    tools: "보고서 양식",
    roles: ["report"],
  },
  {
    id: 3,
    slug: "record-3",
    title: "공공 공간정보 플랫폼 클라우드 이관",
    task: "서버 이관과 모듈 업그레이드, 보고서 마이그레이션을 수행했습니다.",
    flow: "서버 이관 · 모듈 갱신 · 보고서 이전",
    tools: "서버 환경과 보고서 이전",
    roles: ["build", "report"],
  },
  {
    id: 4,
    slug: "record-4",
    title: "대학 졸업관리시스템 모듈 설치",
    task: "졸업관리시스템 모듈을 설치했습니다.",
    flow: "졸업관리시스템에 모듈 설치",
    tools: "업무 모듈 설치",
    roles: ["build"],
  },
  {
    id: 5,
    slug: "record-5",
    title: "물류 시스템 전환",
    task: "창고관리시스템 전환에 필요한 화면을 개발했습니다.",
    flow: "전환 대상 업무 화면 개발",
    tools: "창고관리 화면",
    roles: ["dev"],
  },
  {
    id: 6,
    slug: "record-6",
    title: "구매·법무 시스템 클라우드 이관",
    task: "업무 화면과 거래명세서 보고서를 개발하고 모듈을 설치했습니다.",
    flow: "업무 화면 개발 · 명세서 작성 · 법무 모듈 설치",
    tools: "화면, 거래명세서 양식, 업무 모듈",
    roles: ["build", "dev", "report"],
  },
  {
    id: 7,
    slug: "record-7",
    title: "유통 업무 모듈 설치",
    task: "업무 시스템 모듈을 설치했습니다.",
    flow: "업무 시스템 모듈 설치",
    tools: "업무 모듈 설치",
    roles: ["build"],
  },
  {
    id: 8,
    slug: "record-8",
    title: "문서 출력 보안 강화",
    task: "출력물 보호와 복사·캡처 방지, PDF 암호화 기능을 적용했습니다.",
    flow: "출력물 보호 · 화면 복제 제한 · PDF 암호화 적용",
    tools: "워터마크, 복사·캡처 방지, PDF 암호화",
    roles: ["security"],
  },
  {
    id: 9,
    slug: "record-9",
    title: "배출시설관리 보고서",
    task: "DB 작업과 보고서 개발, 모듈 설치를 수행했습니다.",
    flow: "DB 작업 · 보고서 개발 · 모듈 설치",
    tools: "DB와 보고서, 업무 모듈",
    roles: ["report", "build"],
  },
  {
    id: 10,
    slug: "record-10",
    title: "의회 업무 보고서",
    task: "업무 모듈을 설치하고 보고서를 개발했습니다.",
    flow: "모듈 설치 · 보고서 개발",
    tools: "업무 모듈 및 보고서 양식",
    roles: ["report", "build"],
  },
  {
    id: 11,
    slug: "record-11",
    title: "조합 업무 보고서",
    task: "업무 모듈을 설치하고 보고서를 개발했습니다.",
    flow: "모듈 설치 · 보고서 개발",
    tools: "업무 모듈 및 보고서 양식",
    roles: ["report", "build"],
  },
  {
    id: 12,
    slug: "record-12",
    title: "해외 법인 구축 지원",
    task: "모듈을 설치하고 보고서를 개발했으며 현지 개발자를 교육했습니다.",
    flow: "모듈 설치 · 보고서 개발 · 개발자 교육",
    tools: "업무 모듈과 보고서 양식",
    roles: ["support", "build", "report"],
  },
  {
    id: 13,
    slug: "record-13",
    title: "회계 보고서 개발",
    task: "회계 보고서를 개발하고 브로커를 연동했습니다.",
    flow: "보고서 개발 · 호출 브로커 연동",
    tools: "보고서 양식과 브로커",
    roles: ["report", "dev"],
  },
  {
    id: 14,
    slug: "record-14",
    title: "전자문서 업무 개발",
    task: "보고서와 호출 화면을 개발하고 DB 프로시저를 작성했습니다.",
    flow: "보고서 · 호출 화면 · 저장 프로시저 개발",
    tools: "화면과 DB 프로시저",
    roles: ["dev", "report"],
  },
  {
    id: 15,
    slug: "record-15",
    title: "연구기관 업무 시스템 웹 전환",
    task: "보고서를 개발하고 웹 환경을 구성했으며 개발자를 교육했습니다.",
    flow: "보고서 개발 · 인증 및 웹 환경 구성 · 교육",
    tools: "웹 인증, WAS, 전송 보안",
    roles: ["build", "security", "report", "support"],
  },
  {
    id: 16,
    slug: "record-16",
    title: "산업 현장 안전보건 시스템",
    task: "WAS 설치와 배포 연동을 구현하고 쿼리를 수정했습니다.",
    flow: "WAS 설치 · 배포 연동 · 쿼리 수정",
    tools: "WAS, 버전 관리 기반 배포, DB 쿼리",
    roles: ["build", "dev", "report"],
  },
  {
    id: 17,
    slug: "record-17",
    title: "화학물질유통관리 시스템",
    task: "클라우드에 애플리케이션 환경을 구축하고 저장소와 버전 관리 도구를 연동했습니다.",
    flow: "클라우드 환경 구성 · 저장소 및 버전 관리 연동",
    tools: "클라우드 서버, 애플리케이션 실행 환경, 저장소 연동",
    roles: ["build", "dev"],
  },
  {
    id: 18,
    slug: "record-18",
    title: "전동기 진단 보고서",
    task: "진단 시스템 모듈을 설치하고 보고서를 개발했습니다.",
    flow: "업무 모듈 설치 · 진단 보고서 개발",
    tools: "진단 모듈과 보고서 양식",
    roles: ["report", "build"],
  },
  {
    id: 19,
    slug: "record-19",
    title: "교육기관 정보체계 클라우드 전환",
    task: "WAS, 방화벽, DB 연결 설정을 구성하고 모듈을 갱신했습니다.",
    flow: "WAS·방화벽·DB 연결 설정 · 모듈 갱신",
    tools: "WAS, 방화벽, DB 연결 풀",
    roles: ["build", "security"],
  },
  {
    id: 20,
    slug: "record-20",
    title: "해운 업무 시스템 클라우드 이관",
    task: "모듈을 업그레이드하고 재해복구 서버와 웹 버전을 구성했습니다.",
    flow: "기존 모듈 갱신 · 복구 서버 구성 · 웹 버전 설치",
    tools: "재해복구 서버와 웹 모듈",
    roles: ["build"],
  },
  {
    id: 21,
    slug: "record-21",
    title: "공공기관 클라우드 서버 이관",
    task: "클라우드 서버 이관 작업을 수행했습니다.",
    flow: "클라우드 서버 이관",
    tools: "클라우드 서버 환경",
    roles: ["build"],
  },
  {
    id: 22,
    slug: "record-22",
    title: "사업관리 시스템 보고서",
    task: "보고서를 개발하고 DB 쿼리를 수정했습니다.",
    flow: "업무 보고서 개발 · 쿼리 수정",
    tools: "보고서 양식과 조회 쿼리",
    roles: ["report"],
  },
  {
    id: 23,
    slug: "record-23",
    title: "진단기관 관리시스템 보고서",
    task: "보고서를 개발하고 DB 쿼리를 수정했습니다.",
    flow: "업무 보고서 개발 · 쿼리 수정",
    tools: "보고서 양식과 조회 쿼리",
    roles: ["report"],
  },
  {
    id: 24,
    slug: "record-24",
    title: "차량 견적서 PDF 생성",
    task: "차량 견적서를 PDF로 변환하는 API를 개발했습니다.",
    flow: "차량 견적 데이터 → PDF 변환 API → 견적서",
    tools: "PDF 변환 API",
    roles: ["dev", "report"],
  },
  {
    id: 25,
    slug: "record-25",
    title: "연구 문서 PDF 저장·암호화 연동",
    task: "PDF 저장 경로와 암호화 API를 연결하는 브로커를 개발했습니다.",
    flow: "PDF 저장 경로 → 연동 브로커 → 암호화 API",
    tools: "PDF 저장과 암호화 API",
    roles: ["security", "dev"],
  },
  {
    id: 26,
    slug: "record-26",
    title: "연구 문서 출력 연동",
    task: "보고서를 작업하고 출력 데이터를 생성했으며 XML 파싱 브로커를 개발했습니다.",
    flow: "출력 데이터 생성 · XML 파싱 · 보고서 작업",
    tools: "HTML 출력 데이터, XML 파싱 브로커",
    roles: ["report", "dev"],
  },
  {
    id: 27,
    slug: "record-27",
    title: "학사 보고서 이관·접근 제어",
    task: "보고서를 이관하고 WAS를 설치했으며 보고서 서버 접근 제어 API를 개발했습니다.",
    flow: "보고서 이전 · WAS 설치 · 접근 제어 API 개발",
    tools: "WAS와 접근 제어 API",
    roles: ["security", "build", "dev"],
  },
  {
    id: 28,
    slug: "record-28",
    title: "전자문서 통합관리 시스템 개선",
    task: "PDF 저장과 외부 API 콜백을 연결하고 보고서·쿼리 작업과 교육을 진행했습니다.",
    flow: "PDF 저장 → 외부 API 호출 → 콜백 / 보고서·쿼리 작업과 교육",
    tools: "외부 API, 콜백, 보고서와 조회 쿼리",
    roles: ["dev", "report", "support"],
  },
  {
    id: 29,
    slug: "record-29",
    title: "통합교육포털 구축",
    task: "WAS와 모듈을 설치하고 보고서·쿼리 작업과 개발자 교육을 수행했습니다.",
    flow: "WAS·모듈 설치 · 보고서 및 쿼리 작업 · 교육",
    tools: "WAS, 업무 모듈, 보고서와 조회 쿼리",
    roles: ["build", "report", "support"],
  },
  {
    id: 30,
    slug: "record-30",
    title: "강사관리 전자문서화",
    task: "전자문서 보고서와 XML 파싱 API를 개발했습니다.",
    flow: "전자문서 보고서 개발 · XML 파싱 연동",
    tools: "보고서 양식과 XML 파싱 API",
    roles: ["dev", "report"],
  },
  {
    id: 31,
    slug: "record-31",
    title: "재난관리 시스템 클라우드 이관",
    task: "이관 사업에서 보고서를 개발하고 설치했습니다.",
    flow: "보고서 개발 · 설치",
    tools: "보고서 양식과 설치 환경",
    roles: ["build", "report"],
  },
  {
    id: 32,
    slug: "record-32",
    title: "의회외교정보시스템 고도화",
    task: "보고서와 쿼리를 개발하고 개발자를 교육했습니다.",
    flow: "보고서·쿼리 개발 · 개발자 교육",
    tools: "보고서 양식과 조회 쿼리",
    roles: ["support", "report"],
  },
  {
    id: 33,
    slug: "record-33",
    title: "품질·설비 안전관리",
    task: "서비스 환경을 구축하고 품질·설비 보고서와 쿼리를 개발했습니다.",
    flow: "서비스 환경 구성 · 품질·설비 보고서 및 쿼리 개발",
    tools: "SaaS 환경, 보고서, 관계형 DB 쿼리",
    roles: ["report", "build"],
  },
  {
    id: 34,
    slug: "record-34",
    title: "안전관리 양식·통계 보고서",
    task: "안전관리 양식과 쿼리, 조회·통계 보고서를 개발했습니다.",
    flow: "안전관리 양식 작성 · 쿼리 및 조회·통계 보고서 개발",
    tools: "업무 양식과 관계형 DB 쿼리",
    roles: ["report"],
  },
];

const contexts: Record<number, string> = {
  1: "MES에서 전달되는 데이터를 라벨 보고서에 연결하는 작업입니다.",
  2: "기존 통합정보시스템에서 사용하는 보고서를 고도화하는 사업입니다.",
  3: "공간정보 서비스와 국토정보 플랫폼을 클라우드 환경으로 옮기는 사업입니다.",
  4: "대학의 졸업관리 업무 시스템에 필요한 모듈을 설치하는 작업입니다.",
  5: "기존 물류 업무를 창고관리시스템으로 전환하는 사업입니다.",
  6: "구매 업무와 법무 포털 시스템의 클라우드 이전 사업입니다.",
  7: "유통기관의 업무 시스템에 모듈을 설치하는 작업입니다.",
  8: "문서 출력과 PDF에 보안 기능을 적용하는 사업입니다.",
  9: "배출시설 관리 업무에 사용하는 데이터와 보고서를 구성하는 사업입니다.",
  10: "의회 업무에서 사용할 모듈과 보고서를 구성하는 작업입니다.",
  11: "조합 업무에 사용하는 모듈과 보고서를 구성하는 작업입니다.",
  12: "해외 법인 환경의 시스템 설치와 교육을 지원한 사업입니다.",
  13: "회계 데이터로 보고서를 생성하고 호출 연동을 구성하는 작업입니다.",
  14: "종이 업무를 전자문서로 처리할 수 있도록 관련 화면과 보고서를 개발하는 사업입니다.",
  15: "연구기관 통합정보시스템의 웹 전환 사업입니다.",
  16: "현장 안전보건 업무를 지원하는 통합 시스템 구축 사업입니다.",
  17: "화학물질 유통 정보를 관리하는 애플리케이션의 실행 환경을 구성하는 사업입니다.",
  18: "전동기 진단 시스템에 사용할 모듈과 보고서를 구성하는 사업입니다.",
  19: "교육기관의 종합 정보체계를 클라우드 환경으로 전환하는 사업입니다.",
  20: "해운 업무 시스템을 클라우드 환경으로 이관하는 사업입니다.",
  21: "공공기관이 사용하는 서버를 클라우드로 옮기는 작업입니다.",
  22: "사업관리 시스템의 조회와 보고서 기능을 개발하는 작업입니다.",
  23: "진단기관 관리 업무에 쓰는 보고서를 개발하는 작업입니다.",
  24: "홈페이지에서 차량 견적서를 PDF로 제공하는 기능을 구축하는 사업입니다.",
  25: "연구 문서의 PDF 저장 과정에 암호화를 연결하는 작업입니다.",
  26: "기술 평가 및 연구 자료를 보고서로 출력하는 작업입니다.",
  27: "학사시스템의 보고서를 이관하고 보고서 서버에 대한 접근을 제어하는 사업입니다.",
  28: "전자문서 통합관리 시스템의 문서 저장과 외부 연동을 개선하는 사업입니다.",
  29: "통합교육포털 운영에 필요한 서버 환경과 보고서를 구성하는 사업입니다.",
  30: "강사관리 업무의 전자문서와 데이터 연동을 개발하는 사업입니다.",
  31: "재난관리 시스템의 클라우드 이관 과정에 보고서를 적용하는 작업입니다.",
  32: "의회외교정보시스템의 보고·조회 기능을 고도화하는 사업입니다.",
  33: "품질·설비 안전관리 업무에 사용하는 서비스 환경과 보고서를 구성하는 사업입니다.",
  34: "안전관리 업무에서 사용하는 양식과 조회·통계 보고서를 개발하는 사업입니다.",
};

export const workRecordCount = records.length;
const legacySlugs: Record<string, number> = {
  "mes-label": 1,
  "poscodx-safety": 16,
  "poscodx-chemical": 17,
  "poscodx-motor": 18,
  "ndms-migration": 31,
  "lgcns-aws-migration": 6,
  "lgcns-wms": 5,
  "lh-education": 29,
  "naval-cloud": 19,
  "kari-api": 25,
};

export async function workRecords(admin: boolean) {
  if (!(await canReadProjects())) return [];
  let privateRecords: PrivateRecord[] = [];
  if (admin) {
    if (springAccess()) {
      privateRecords = (
        await api<{ items: PrivateRecord[] }>("content/projects/work-records")
      ).items;
    } else if (await isLocalPreview()) {
      privateRecords = JSON.parse(
        await readFile(
          join(process.cwd(), ".local/private-content/work-records.json"),
          "utf8",
        ),
      ).items;
    }
  }
  return records.map((record) => {
    const privateRecord = privateRecords.find(({ id }) => id === record.id);
    return {
      ...record,
      organization: privateRecord?.organization,
      title: privateRecord?.title ?? record.title,
      task: privateRecord?.task ?? record.task,
      summary: privateRecord?.summary ?? record.task,
      context: contexts[record.id],
    };
  });
}

export async function findWorkRecord(slug: string, admin: boolean) {
  return (await workRecords(admin)).find(
    (record) => record.slug === slug || record.id === legacySlugs[slug],
  );
}

export async function representativeWork(admin: boolean) {
  const selected = new Set([1, 17, 25, 33]);
  return (await workRecords(admin)).filter(({ id }) => selected.has(id));
}

export type WorkRecord = Awaited<ReturnType<typeof workRecords>>[number];
export const workRoleLabel = (role: Role) =>
  workRoles.find(({ id }) => id === role)?.label;
