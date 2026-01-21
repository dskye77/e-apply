import { Roboto } from "next/font/google";
import Layout from "@/components/layout";

import "./globals.css";

const roboto = Roboto({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  variable: "--font-roboto",
  display: "swap",
});

export const metadata = {
  title: "e-Residency Application Portal | Republic of Verdis",
  description:
    "Apply for Verdisian e-Residency. Join a global community of digital entrepreneurs and gain access to Verdis' digital services and business opportunities.",
  keywords:
    "e-residency, verdis, digital residency, online business, digital nomad, virtual residency",
  authors: [{ name: "Republic of Verdis" }],
  creator: "Republic of Verdis",
  publisher: "Republic of Verdis",
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://vrdgov.eu",
    title: "e-Residency Application Portal | Republic of Verdis",
    description:
      "Apply for Verdisian e-Residency and join our global digital community.",
    siteName: "Verdis e-Residency",
  },
  twitter: {
    card: "summary_large_image",
    title: "e-Residency Application Portal | Republic of Verdis",
    description:
      "Apply for Verdisian e-Residency and join our global digital community.",
  },
  viewport: {
    width: "device-width",
    initialScale: 1,
    maximumScale: 5,
  },
  themeColor: "#2563eb",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
        <meta name="format-detection" content="telephone=no" />
      </head>
      <body className={`${roboto.variable} antialiased`}>
        <Layout>{children}</Layout>
      </body>
    </html>
  );
}
