import { ImageResponse } from "next/og";

export const alt = "SmartInspect — диагностика дорог и мостов";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "flex-end",
          padding: 80,
          background: "linear-gradient(145deg, #001733 0%, #003366 45%, #006aed 100%)",
          color: "#ffffff",
          fontFamily: "system-ui, sans-serif",
        }}
      >
        <div
          style={{
            width: 64,
            height: 4,
            borderRadius: 2,
            background: "linear-gradient(90deg, #18dcdc, #006aed)",
            marginBottom: 32,
          }}
        />
        <div
          style={{
            fontSize: 72,
            fontWeight: 600,
            letterSpacing: -2,
            lineHeight: 1,
          }}
        >
          SmartInspect
        </div>
        <div
          style={{
            fontSize: 34,
            marginTop: 24,
            maxWidth: 900,
            lineHeight: 1.35,
            color: "rgba(255, 255, 255, 0.9)",
          }}
        >
          Автоматизированная диагностика дорог и мостов с ИИ
        </div>
      </div>
    ),
    { ...size },
  );
}
