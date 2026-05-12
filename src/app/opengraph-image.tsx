import { ImageResponse } from "next/og";

export const runtime = "edge";
export const size = {
  width: 1200,
  height: 630,
};

export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "72px",
          background:
            "linear-gradient(135deg, #0A2540 0%, #0E2C4D 60%, #10365E 100%)",
          color: "#FFFFFF",
          position: "relative",
          fontFamily: "Arial, sans-serif",
        }}
      >
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            height: 10,
            background: "#0EA5E9",
          }}
        />
        <div
          style={{
            fontSize: 82,
            fontWeight: 800,
            letterSpacing: 2,
          }}
        >
          MORAL CLEAN
        </div>
        <div
          style={{
            marginTop: 18,
            fontSize: 34,
            fontWeight: 500,
            color: "#D7EEFF",
          }}
        >
          Commercial Cleaning Equipment & Service
        </div>
        <div
          style={{
            marginTop: 32,
            width: 420,
            height: 6,
            borderRadius: 999,
            background: "#0EA5E9",
          }}
        />
      </div>
    ),
    size,
  );
}
