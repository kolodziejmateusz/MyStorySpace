import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "My Story Space",
  description: "My Story Space",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
