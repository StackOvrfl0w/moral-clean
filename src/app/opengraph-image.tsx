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
        tw="relative flex h-full w-full flex-col justify-center bg-[linear-gradient(135deg,rgb(var(--color-navy))_0%,rgb(var(--color-brand-gradient-deep))_60%,rgb(var(--color-brand-gradient-darker))_100%)] p-[72px] text-white"
      >
        <div
          tw="absolute left-0 right-0 top-0 h-[10px] bg-[rgb(var(--color-brand-accent))]"
        />
        <div
          tw="text-[82px] font-extrabold tracking-[2px]"
        >
          MORAL CLEAN
        </div>
        <div
          tw="mt-[18px] text-[34px] font-medium text-[#D7EEFF]"
        >
          Commercial Cleaning Equipment & Service
        </div>
        <div
          tw="mt-8 h-[6px] w-[420px] rounded-full bg-[rgb(var(--color-brand-accent))]"
        />
      </div>
    ),
    size,
  );
}
