"use client";

import { Fragment, useMemo, useState } from "react";
import { Search, Download } from "lucide-react";

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

export function SubmissionsInbox({ submissions }: { submissions: Submission[] }) {
  const [range, setRange] = useState("all");
  const [query, setQuery] = useState("");
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const filtered = useMemo(() => {
    const now = Date.now();
    const rangeMs =
      range === "7"
        ? 7 * 24 * 60 * 60 * 1000
        : range === "30"
          ? 30 * 24 * 60 * 60 * 1000
          : null;

    return submissions.filter((submission) => {
      if (rangeMs && submission.created_at) {
        const age = now - new Date(submission.created_at).getTime();
        if (age > rangeMs) return false;
      }

      if (!query.trim()) return true;
      const haystack = `${submission.name} ${submission.email ?? ""} ${submission.phone ?? ""}`.toLowerCase();
      return haystack.includes(query.toLowerCase());
    });
  }, [submissions, range, query]);

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

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-3 rounded-md border bg-white p-4">
        <div className="relative">
          <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search name/email/phone"
            className="h-9 w-72 rounded-md border border-input bg-background pl-9 pr-3 text-sm"
          />
        </div>
        <select
          value={range}
          onChange={(event) => setRange(event.target.value)}
          className="h-9 rounded-md border border-input bg-background px-3 text-sm"
        >
          <option value="all">All</option>
          <option value="7">Last 7 days</option>
          <option value="30">Last 30 days</option>
        </select>
        <Button type="button" variant="outline" onClick={exportCsv}>
          <Download className="size-4" />
          Export CSV
        </Button>
      </div>

      <div className="overflow-x-auto rounded-lg border bg-white">
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
                <td className="px-3 py-8 text-center text-muted-foreground" colSpan={7}>
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
                      onClick={() => setExpandedId(expanded ? null : submission.id)}
                    >
                      <td className="px-3 py-3">{formatDate(submission.created_at)}</td>
                      <td className="px-3 py-3 font-medium">{submission.name}</td>
                      <td className="px-3 py-3">{submission.phone || "—"}</td>
                      <td className="px-3 py-3">{submission.email || "—"}</td>
                      <td className="px-3 py-3">{parseSource(submission.message)}</td>
                      <td className="px-3 py-3 text-muted-foreground">
                        {message.length > 90 ? `${message.slice(0, 90)}...` : message}
                      </td>
                      <td className="px-3 py-3" onClick={(event) => event.stopPropagation()}>
                        <ConfirmActionButton
                          label="Delete"
                          message="Delete this submission?"
                          action={deleteSubmission}
                          values={{ id: submission.id }}
                        />
                      </td>
                    </tr>
                    {expanded ? (
                      <tr className="border-t bg-muted/20">
                        <td className="px-3 py-3 text-sm text-muted-foreground" colSpan={7}>
                          {message}
                        </td>
                      </tr>
                    ) : null}
                  </Fragment>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
