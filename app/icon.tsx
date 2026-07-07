import { ImageResponse } from "next/og";

export const size = { width: 32, height: 32 };
export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#ea580c",
          borderRadius: 8,
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 3,
          }}
        >
          <div
            style={{
              width: 7,
              height: 9,
              background: "rgba(255,255,255,0.92)",
              borderRadius: 2,
            }}
          />
          <div
            style={{
              width: 5,
              height: 2,
              background: "rgba(255,255,255,0.92)",
              borderRadius: 1,
            }}
          />
          <div
            style={{
              width: 7,
              height: 9,
              background: "rgba(255,255,255,0.92)",
              borderRadius: 2,
            }}
          />
        </div>
      </div>
    ),
    { ...size },
  );
}
