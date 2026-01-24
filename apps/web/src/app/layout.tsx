import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Vibe Trading",
  description: "Advanced Trading Platform",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    // The 'dark' class and color-scheme 'dark' are applied here to maintain consistency with the previous Vite setup.
    // 'lang="en"' is critical for accessibility to allow screen readers to correctly pronounce content.
    <html lang="en" className="dark" style={{ colorScheme: "dark" }}>
      <body>
        {children}
      </body>
    </html>
  );
}
