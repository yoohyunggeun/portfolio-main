"use server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { api, setBackendCookie, springAccess } from "./backend";
import { logoutPreview } from "./management";
export async function endAdmin(_: {
  error?: string;
}): Promise<{ error?: string }> {
  if (!springAccess()) {
    await logoutPreview();
    return {};
  }
  try {
    await api("admin/auth/logout", { method: "POST" });
    await setBackendCookie("admin", "", 0);
  } catch {
    return {
      error:
        "로그아웃하지 못했습니다. 현재 상태를 유지하며 다시 시도할 수 있습니다.",
    };
  }
  revalidatePath("/", "layout");
  redirect("/admin/login");
}
