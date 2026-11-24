"use server";
import { canReadProjects } from "@/server/access/session";

export type NoteResult = {
  status: "idle" | "invalid" | "success";
  message: string;
};

export async function validateNote(
  _previous: NoteResult,
  formData: FormData,
): Promise<NoteResult> {
  if (!(await canReadProjects()))
    return {
      status: "invalid",
      message: "프로젝트 열람 권한을 다시 확인해 주세요.",
    };
  const value = formData.get("note");
  const note = typeof value === "string" ? value.trim() : "";
  if (note.length < 3 || note.length > 60) {
    return {
      status: "invalid",
      message: "메모는 3자 이상 60자 이하로 입력해 주세요.",
    };
  }
  return {
    status: "success",
    message: `서버 검증 완료 · 메모 ${note.length}자`,
  };
}
