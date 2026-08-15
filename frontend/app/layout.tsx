import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Book Search",
  description: "Search Open Library and Google Books at the same time.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className="h-full">
      <body className="min-h-full flex flex-col bg-gray-50 text-gray-900">
        {children}
      </body>
    </html>
  );
}
