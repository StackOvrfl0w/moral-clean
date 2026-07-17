"use client";

import { Fragment, useMemo, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { Search, Download, ChevronLeft, ChevronRight } from "lucide-react";

import { ConfirmActionButton } from "@/components/admin/ConfirmActionButton";
import { Button } from "@/components/ui/button";
import { deleteSubmission } from "@/lib/actions/admin/submissions";

type Submission = {
  id: string;
  name: string;
  phone: string | null;
  email: string | null;
  message: string;
  created_at: string | null;
};

type SubmissionsInboxProps = {
  submissions: Submission[];
  page: number;
  totalPages: number;
  totalCount: number;
};

function formatDate(value: string | null) {
  if (!value) return "—";
  return new Date(value).toLocaleString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function parseSource(message: string) {
  const subjectMatch = message.match(/^\[(Subject|Category):\s*([^\]]+)\]/i);
  return subjectMatch?.[2] ?? "General";
}

function cleanMessage(message: string) {
  return message.replace(/^\[(Subject|Category):\s*[^\]]+\]\n?/i, "").trim();
}

function escapeCsv(value: string) {
  return `"${value.replace(/"/g, '""')}"`;
}

export function SubmissionsInbox({
  submissions,
  page,
  totalPages,
  totalCount,
}: SubmissionsInboxProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [query, setQuery] = useState("");
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const filtered = useMemo(() => {
    if (!query.trim()) return submissions;
    const q = query.toLowerCase();
    return submissions.filter((s) =>
      `${s.name} ${s.email ?? ""} ${s.phone ?? ""}`.toLowerCase().includes(q),
    );
  }, [submissions, query]);

  function goToPage(p: number) {
    const params = new URLSearchParams();
    params.set("page", String(p));
    router.push(`${pathname}?${params.toString()}`);
  }

  function exportCsv() {
    const headers = ["Date", "Name", "Phone", "Email", "Source", "Message"];
    const lines = filtered.map((item) =>
      [
        formatDate(item.created_at),
        item.name,
        item.phone ?? "",
        item.email ?? "",
        parseSource(item.message),
        cleanMessage(item.message),
      ]
        .map((cell) => escapeCsv(cell))
        .join(","),
    );
    const csv = [headers.join(","), ...lines].join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = "contact-submissions.csv";
    anchor.click();
    URL.revokeObjectURL(url);
  }

  const startEntry = (page - 1) * 50 + 1;
  const endEntry = Math.min(page * 50, totalCount);

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-3 rounded-md border bg-white p-4">
        <div className="relative">
          <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search name/email/phone"
            className="h-9 w-72 rounded-md border border-input bg-background pl-9 pr-3 text-sm"
          />
        </div>
        <Button type="button" variant="outline" onClick={exportCsv}>
          <Download className="size-4" />
          Export CSV
        </Button>
      </div>

      <div className="rounded-lg border bg-white overflow-hidden">
        <div className="overflow-auto max-h-[600px]">
          <table className="w-full text-left text-sm">
            <thead className="sticky top-0 bg-muted/80 text-xs uppercase tracking-wide text-muted-foreground">
              <tr>
                <th className="px-3 py-3">Date</th>
                <th className="px-3 py-3">Name</th>
                <th className="px-3 py-3">Phone</th>
                <th className="px-3 py-3">Email</th>
                <th className="px-3 py-3">Subject/Source</th>
                <th className="px-3 py-3">Message</th>
                <th className="px-3 py-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td
                    className="px-3 py-8 text-center text-muted-foreground"
                    colSpan={7}
                  >
                    No submissions found.
                  </td>
                </tr>
              ) : (
                filtered.map((submission) => {
                  const message = cleanMessage(submission.message);
                  const expanded = expandedId === submission.id;
                  return (
                    <Fragment key={submission.id}>
                      <tr
                        className="cursor-pointer border-t hover:bg-muted/40"
                        onClick={() =>
                          setExpandedId(expanded ? null : submission.id)
                        }
                      >
                        <td className="px-3 py-3">
                          {formatDate(submission.created_at)}
                        </td>
                        <td className="px-3 py-3 font-medium">
                          {submission.name}
                        </td>
                        <td className="px-3 py-3">{submission.phone || "—"}</td>
                        <td className="px-3 py-3">{submission.email || "—"}</td>
                        <td className="px-3 py-3">
                          {parseSource(submission.message)}
                        </td>
                        <td className="px-3 py-3 text-muted-foreground">
                          <span>
                            {message.length > 90
                              ? `${message.slice(0, 90)}...`
                              : message}
                          </span>

                          {message.length > 90 && !expanded && (
                            <span className="ml-2 text-xs font-semibold text-primary">
                              View more
                            </span>
                          )}
                        </td>
                        <td
                          className="px-3 py-3"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <ConfirmActionButton
                            label="Delete"
                            message="Delete this submission?"
                            action={deleteSubmission}
                            values={{ id: submission.id }}
                          />
                        </td>
                      </tr>
                      {expanded && (
                        <tr className="border-t bg-muted/20">
                          <td
                            className="px-3 py-3 text-sm text-muted-foreground"
                            colSpan={7}
                          >
                            <div className="whitespace-pre-wrap">{message}</div>
                            <button
                              className="mt-2 text-xs font-semibold text-primary hover:underline"
                              onClick={(e) => {
                                e.stopPropagation();
                                setExpandedId(null);
                              }}
                            >
                              View less
                            </button>
                          </td>
                        </tr>
                      )}
                    </Fragment>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {totalPages > 1 && (
        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <span>
            {startEntry}–{endEntry} of {totalCount}
          </span>
          <div className="flex items-center gap-1">
            <Button
              variant="outline"
              size="icon"
              onClick={() => goToPage(page - 1)}
              disabled={page <= 1}
            >
              <ChevronLeft className="size-4" />
            </Button>
            {Array.from({ length: totalPages }, (_, i) => i + 1)
              .filter(
                (p) => p === 1 || p === totalPages || Math.abs(p - page) <= 1,
              )
              .reduce<(number | "...")[]>((acc, p, idx, arr) => {
                if (idx > 0 && p - (arr[idx - 1] as number) > 1)
                  acc.push("...");
                acc.push(p);
                return acc;
              }, [])
              .map((p, idx) =>
                p === "..." ? (
                  <span key={`ellipsis-${idx}`} className="px-2">
                    ...
                  </span>
                ) : (
                  <Button
                    key={p}
                    variant={p === page ? "default" : "outline"}
                    size="icon"
                    onClick={() => goToPage(p as number)}
                  >
                    {p}
                  </Button>
                ),
              )}
            <Button
              variant="outline"
              size="icon"
              onClick={() => goToPage(page + 1)}
              disabled={page >= totalPages}
            >
              <ChevronRight className="size-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
