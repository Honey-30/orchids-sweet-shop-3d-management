import type { Metadata } from "next";
import "./globals.css";
import VisualEditsMessenger from "../visual-edits/VisualEditsMessenger";
import ErrorReporter from "@/components/ErrorReporter";
import Script from "next/script";
import { AuthProviderWrapper } from "@/components/AuthProviderWrapper";
import { Toaster } from "sonner";

export const metadata: Metadata = {
  title: "Luxe Sweet Shop | Premium Artisan Confections",
  description: "Discover the finest handcrafted sweets and artisan confections. Premium chocolates, pastries, and candies curated for the discerning palate.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className="antialiased">
        <Script
          id="orchids-browser-logs"
          src="https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/scripts/orchids-browser-logs.js"
          strategy="afterInteractive"
          data-orchids-project-id="70fcfbfc-f36d-4c48-a0e3-105355d03f58"
        />
        <ErrorReporter />
        <Script
          src="https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/scripts//route-messenger.js"
          strategy="afterInteractive"
          data-target-origin="*"
          data-message-type="ROUTE_CHANGE"
          data-include-search-params="true"
          data-only-in-iframe="true"
          data-debug="true"
          data-custom-data='{"appName": "YourApp", "version": "1.0.0", "greeting": "hi"}'
        />
        <AuthProviderWrapper>
          {children}
        </AuthProviderWrapper>
        <Toaster 
          position="top-right" 
          toastOptions={{
            style: {
              background: 'rgba(18, 18, 28, 0.95)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              color: '#fff',
              backdropFilter: 'blur(20px)',
            },
          }}
        />
        <VisualEditsMessenger />
      </body>
    </html>
  );
}