import type { Metadata, Viewport } from "next";
import "./globals.css";
import { ErrorBoundary } from "@/components/error-boundary";
import { ThemeProvider } from "@/components/theme-provider";

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
    // 'lang="en"' is critical for accessibility to allow screen readers to correctly pronounce content.
    // suppressHydrationWarning is required by next-themes to prevent hydration mismatch warnings.
    <html lang="en" suppressHydrationWarning>
      <body>
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem={false}
          disableTransitionOnChange
        >
          <ErrorBoundary>{children}</ErrorBoundary>
        </ThemeProvider>
      </body>
    </html>
  );
}
