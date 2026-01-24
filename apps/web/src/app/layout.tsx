import type { Metadata, Viewport } from "next";
import "./globals.css";
import { ErrorBoundary } from "@/components/error-boundary";

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
    // Dark mode is hardcoded for now. The 'dark' class enables Tailwind dark mode utilities.
    // The color-scheme CSS property ensures native browser UI elements (scrollbars, form controls) match the dark theme.
    // 'lang="en"' is critical for accessibility to allow screen readers to correctly pronounce content.
    <html lang="en" className="dark" style={{ colorScheme: "dark" }}>
      <body>
        <ErrorBoundary>{children}</ErrorBoundary>
      </body>
    </html>
  );
}
