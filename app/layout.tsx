import type { Metadata, Viewport } from "next";
import { Quicksand, Outfit } from "next/font/google";
import "./globals.css";

const quicksand = Quicksand({
  subsets: ["latin"],
  variable: "--font-quicksand",
  weight: ["500", "600", "700"],
});

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit",
  weight: ["400", "500", "600", "700", "800"],
});

export const metadata: Metadata = {
  title: "engforbaby 🍼 | Bebekler İçin İngilizce Günlük Rehber",
  description: "0-24 aylık bebekler için sesli telaffuzlu, yaş gruplu ve günlük rutin İngilizce öğrenme asistanı.",
  icons: {
    icon: "/favicon.ico",
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "engforbaby",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: "#FFF1F2",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="tr" className={`${quicksand.variable} ${outfit.variable} h-full antialiased`}>
      <head>
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="mobile-web-app-capable" content="yes" />
      </head>
      <body className="min-h-full flex flex-col bg-[#FFF9F6] text-slate-800 font-sans selection:bg-rose-200 selection:text-rose-900">
        {children}
      </body>
    </html>
  );
}
