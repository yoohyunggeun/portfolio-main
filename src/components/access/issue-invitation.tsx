import Link from "next/link";
import { ManageForm } from "./management";
export function IssueInvitation({
  targets,
  selected,
  remote,
}: {
  targets: { id: string; company: string; email?: string | null; application?: string|null }[];
  selected?: string;
  remote: boolean;
}) {
  return (
    <div className="access-card">
      <p className="muted">
        먼저 등록된 대상을 선택합니다. 새 대상은 별도로 등록한 뒤 해당 대상의
        상세 화면에서 링크를 발급합니다.
      </p>
      <Link className="text-link" href="/admin/recipients">
        새 초대 대상 등록 →
      </Link>
      <ManageForm operation="issue" label="링크 생성">
        <label>
          기존 초대 대상
          <select name="recipient" required defaultValue={selected ?? ""}>
            <option value="" disabled>
              대상을 선택해 주세요
            </option>
            {targets.map((t) => (
              <option key={t.id} value={t.id}>
                {t.company}
                {t.email ? ` · ${t.email}` : ""} · {t.application || "지원 건 미등록"} · {t.id.slice(0, 8)}
              </option>
            ))}
          </select>
        </label>
        {!targets.length && (
          <p>
            등록된 대상이 없습니다. 위 대상 등록 화면에서 먼저 등록해 주세요.
          </p>
        )}
        {remote ? (
          <label>
            유효 기간 (일)
            <input
              name="days"
              type="number"
              min={1}
              max={30}
              defaultValue={7}
              required
            />
          </label>
        ) : (
          <label>
            링크 만료 시각 (KST)
            <input name="expiry" type="datetime-local" required />
          </label>
        )}
        <label>
          재사용 정책
          <select name="policy" defaultValue="once">
            <option value="once">1회 사용</option>
            <option value="reusable">재사용 허용</option>
          </select>
        </label>
      </ManageForm>
    </div>
  );
}
