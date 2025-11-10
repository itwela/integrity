import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ConvexClientProvider } from "./providers/ConvexContextProvider";
import AudioContextProvider from "./providers/AudioContextProvider";
import ShippingToolProvider from "./providers/ShippingToolProvider";
import StockProvider from "./providers/StockProvider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Integrity New Drop - Stic & Young Noble",
  description: "New Album, New Fragrance, New Audiobook",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="js-focus-visible" data-js-focus-visible="">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased overflow-x-hidden`}
      >
        <ConvexClientProvider>
          <AudioContextProvider>
            <ShippingToolProvider>
              <StockProvider>
                {children}
              </StockProvider>
            </ShippingToolProvider>
          </AudioContextProvider>
        </ConvexClientProvider>
      </body>
    </html>
  );
}
