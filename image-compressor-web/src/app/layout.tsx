import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Container from "@mui/material/Container";
import { ToastContainer } from "react-toastify";

import { ResponsiveAppBar } from "@/components";

import "./globals.css";
import "react-toastify/dist/ReactToastify.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Image Compressor",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ResponsiveAppBar />
        <Container>
          <ToastContainer position="top-right" />
          <div className="container">{children}</div>
        </Container>
      </body>
    </html>
  );
}
