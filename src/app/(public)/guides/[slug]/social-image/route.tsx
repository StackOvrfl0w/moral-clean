import { ImageResponse } from "next/og";
import { guides } from "@/content/guides";
import { getGuidePresentation } from "@/content/guide-presentation";
import { absoluteUrl } from "@/lib/seo";

export const runtime = "edge";
const size = { width: 1200, height: 630 };

export function GET(request: Request, { params }: { params: { slug: string } }) {
  const guide = guides.find((item) => item.slug === params.slug);
  if (!guide) return new Response("Not found", { status: 404 });
  const visual = getGuidePresentation(guide);
  const requestUrl = new URL(request.url);
  const assetUrl = ["localhost", "127.0.0.1"].includes(requestUrl.hostname)
    ? new URL(visual.image, requestUrl.origin).toString()
    : absoluteUrl(visual.image);
  return new ImageResponse(
    <div style={{ width: "100%", height: "100%", background: "#0a2540", display: "flex", padding: "52px", color: "white", fontFamily: "sans-serif", borderTop: "12px solid #00defc" }}>
      <div style={{ display: "flex", width: "65%", flexDirection: "column", paddingRight: "35px", justifyContent: "center" }}>
        <div style={{ display: "flex", fontSize: 23, color: "#9cecff", letterSpacing: 3 }}>MORAL CLEAN / EQUIPMENT GUIDES</div>
        <div style={{ display: "flex", marginTop: 35, fontSize: 43, fontWeight: 700, lineHeight: 1.18 }}>{guide.title}</div>
        <div style={{ display: "flex", marginTop: 35, fontSize: 22, color: "#cbd5e1" }}>Practical equipment selection for Pakistan</div>
      </div>
      <div style={{ display: "flex", flex: 1, background: "#f8fafc", borderRadius: 22, alignItems: "center", justifyContent: "center", overflow: "hidden" }}>
        {/* The image is an existing public site asset, not a newly claimed model. */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={assetUrl} alt={visual.alt} width={350} height={400} style={{ objectFit: visual.photo ? "cover" : "contain" }} />
      </div>
    </div>, size,
  );
}
