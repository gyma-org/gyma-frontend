<<<<<<< HEAD
// src/app/layout.tsx

import type { Metadata } from "next";
import { Vazirmatn } from "next/font/google";
import "./globals.css";
import '../styles/custom.css';
import Footer from '@/components/Footer';
=======
import type { Metadata } from "next";
import { Vazirmatn } from "next/font/google";
import "./globals.css";
>>>>>>> b0a01eb90408b4f555e3a74079add9668bf969a9

const vazirmatn = Vazirmatn({ subsets: ["arabic"] });

export const metadata: Metadata = {
<<<<<<< HEAD
  title: "Gyma",
  description: "",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
	return (
	  <html lang="fa-IR">
		<body className={vazirmatn.className}>
		  <div className="flex flex-col min-h-screen">
			<main className="flex-grow">{children}</main>
			<Footer />
		  </div>
		</body>
	  </html>
	);
  }
=======
	title: "Gyma",
	description: "",
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="fa-IR">
			<head>
        {/* Meta Tags for PWA */}
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#000000" />
        <link rel="icon" href="/icons/192x192.png" />
        <link rel="apple-touch-icon" href="/icons/512x512.png" />
      </head>
			<body className={vazirmatn.className}>{children}</body>
		</html>
	);
}
>>>>>>> b0a01eb90408b4f555e3a74079add9668bf969a9
