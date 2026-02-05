import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Crytch - Visual Cryptography",
  description: "Create, encrypt and share secret visual messages",
  keywords: ["cryptography", "visual", "encryption", "drawing", "messaging"],
  openGraph: {
    title: "Crytch",
    description: "Create, encrypt and share secret visual messages",
    type: "website",
    url: "https://crytch.com",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Roboto+Mono:wght@400;500&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
