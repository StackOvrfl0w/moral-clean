import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "Moral Clean — Commercial Cleaning Equipment & Service in Pakistan";
export const size = {
  width: 1200,
  height: 630,
};

export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        tw="relative flex h-full w-full flex-col justify-center bg-[#0a2540] p-[72px] text-white"
      >
        <div
          tw="absolute left-0 right-0 top-0 h-[10px] bg-[#0ea5e9]"
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
          tw="mt-8 h-[6px] w-[420px] rounded-full bg-[#0ea5e9]"
        />
      </div>
    ),
    size,
  );
}
