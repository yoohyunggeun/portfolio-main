"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import type { ReaderEndState } from "@/components/access/reader-end-form";
import { api, setBackendCookie, springAccess } from "./backend";
import { db, isLocalPreview, now, readerCookie, validToken } from "./local";

export async function endReading(_: ReaderEndState): Promise<ReaderEndState> {
  try {
    if (springAccess()) {
      await api("reader/auth/logout", { method: "POST" });
      await setBackendCookie("reader", "", 0);
      // Clear this browser's old administrator credential without revoking other sessions.
      await setBackendCookie("admin", "", 0);
    } else {
      if (!await isLocalPreview()) return { error: "현재는 열람을 종료할 수 없습니다." };
      const jar = await cookies();
      const value = jar.get(readerCookie)?.value;
      if (validToken(value)) {
        db().prepare("UPDATE sessions SET ended = COALESCE(ended, ?) WHERE token = ? AND role = 'reader'").run(now(), value!);
      }
      jar.set(readerCookie, "", { httpOnly: true, sameSite: "strict", path: "/", maxAge: 0 });
    }
  } catch {
    return { error: "열람을 종료하지 못했습니다. 잠시 후 다시 시도해 주세요." };
  }
  revalidatePath("/", "layout");
  redirect("/access?reason=ended");
}
