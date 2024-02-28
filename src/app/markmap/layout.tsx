import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "mindmap",
  description: "mindmap",
};

export default function MarkMapLayout({
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
