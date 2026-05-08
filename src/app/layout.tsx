import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "ARTEVOOM | 프리미엄 시그니처 향수",
  description: "향기로 기억되는 순간, ARTEVOOM. 당신의 가장 빛나는 순간을 위한 프리미엄 시그니처 컬렉션을 만나보세요.",
  keywords: "향수, 프리미엄 향수, 아르보움, ARTEVOOM, 니치향수, 조향, 선물",
};

import Providers from "@/components/Providers";
import Navigation from "@/components/Navigation/Navigation";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <head>
        <script src="https://cdn.portone.io/v2/browser-sdk.js"></script>
      </head>
      <body>
        <Providers>
          <Navigation />
          {children}
        </Providers>
      </body>
    </html>


  );
}
