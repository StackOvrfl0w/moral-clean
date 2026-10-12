import type { PostgrestError } from "@supabase/supabase-js";
import { PageOutOfRangeError } from "@/lib/pagination";

type PageResponse<Row> = { data: Row[] | null; count: number | null; error: PostgrestError | null };

// Bounds are checked by the caller before this function and before result caching.
// A concurrent deletion can still invalidate the checked range. Do not cache it
// or disguise permission/connectivity errors as empty results.
export async function readPage<Row>(
  range: (from: number, to: number) => PromiseLike<PageResponse<Row>>,
  page: number, perPage: number,
): Promise<PageResponse<Row>> {
  const from = (page - 1) * perPage;
  const result = await range(from, from + perPage - 1);
  if (result.error?.code !== "PGRST103") return result;
  if (page === 1 && result.count === 0) return { ...result, data: [], error: null };
  throw new PageOutOfRangeError("Results changed after pagination validation");
}
