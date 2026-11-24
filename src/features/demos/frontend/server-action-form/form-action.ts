"use server";
import { canReadProjects } from "@/server/access/session";

export type FormDemoState = {
  status: "idle" | "invalid" | "retry" | "success";
  message: string;
};

export async function submitDemoForm(
  previous: FormDemoState,
  formData: FormData,
): Promise<FormDemoState> {
  if (!(await canReadProjects()))
    return {
      status: "invalid",
      message: "프로젝트 열람 권한을 다시 확인해 주세요.",
    };
  const raw = formData.get("topic");
  const topic = typeof raw === "string" ? raw.trim() : "";
  if (topic.length < 3 || topic.length > 60) {
    return {
      status: "invalid",
      message: "주제를 3자 이상 60자 이하로 입력해 주세요.",
    };
  }

  // A short delay makes the pending state observable in the demo.
  await new Promise<void>((resolve) => setTimeout(resolve, 900));

  if (formData.get("simulateFailure") === "on" && previous.status !== "retry") {
    return {
      status: "retry",
      message:
        "일시적인 제출 실패를 재현했어요. 같은 내용으로 다시 시도할 수 있어요.",
    };
  }

  return { status: "success", message: `‘${topic}’ 검증을 통과했어요.` };
}
