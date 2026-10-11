import type { PostgrestError } from "@supabase/supabase-js";

type PageResponse<Row> = {
  data: Row[] | null;
  error: PostgrestError | null;
  count: number | null;
};

// Valid pages make one request. Only an unsatisfiable range needs count recovery.
export async function readPage<Row>(
  range: (from: number, to: number) => PromiseLike<PageResponse<Row>>,
  page: number,
  perPage: number,
): Promise<PageResponse<Row>> {
  const from = (page - 1) * perPage;
  const result = await range(from, from + perPage - 1);
  if (result.error?.code !== "PGRST103") return result;
  if (result.count === 0) return { ...result, error: null, data: [] };
  if (page === 1) return result;
  const first = await range(0, 0);
  if (first.error?.code === "PGRST103" && first.count === 0) {
    return { ...first, error: null, data: [] };
  }
  // Never hide permissions, connectivity or SQL failures in the recovery query.
  return { ...first, data: [] };
}
