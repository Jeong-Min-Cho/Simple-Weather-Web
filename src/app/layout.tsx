import type { Metadata, Viewport } from "next";
import { Providers } from "./providers";
import "./globals.css";

export const metadata: Metadata = {
  title: "Weather App - 한국 날씨 정보",
  description: "한국 지역 기반의 실시간 날씨 정보를 제공합니다. 현재 날씨, 시간대별 예보, 즐겨찾기 기능을 지원합니다.",
  keywords: ["날씨", "기상", "한국 날씨", "일기예보", "weather", "korea"],
  authors: [{ name: "Weather App" }],
  openGraph: {
    title: "Weather App - 한국 날씨 정보",
    description: "한국 지역 기반의 실시간 날씨 정보를 제공합니다.",
    type: "website",
    locale: "ko_KR",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#fafaf9" },
    { media: "(prefers-color-scheme: dark)", color: "#1c1917" },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko" suppressHydrationWarning>
      <body className="min-h-screen antialiased">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
