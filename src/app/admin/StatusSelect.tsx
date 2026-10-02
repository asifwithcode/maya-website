"use client";

import { PREORDER_STATUSES } from "@/db/statuses";
import { setPreorderStatus } from "./actions";

/** Saves as soon as a new status is picked. */
export default function StatusSelect({ id, status }: { id: number; status: string }) {
  return (
    <form action={setPreorderStatus}>
      <input type="hidden" name="id" value={id} />
      <select
        name="status"
        defaultValue={status}
        onChange={(e) => e.currentTarget.form?.requestSubmit()}
        className="rounded-full border border-ink/15 bg-card px-2.5 py-1 text-xs capitalize"
      >
        {PREORDER_STATUSES.map((s) => (
          <option key={s} value={s}>
            {s}
          </option>
        ))}
      </select>
    </form>
  );
}
