// src/app/layout.tsx

import type { Metadata } from "next";
import { Vazirmatn } from "next/font/google";
import "./globals.css";
import '../styles/custom.css';
import Footer from '@/components/Footer';

const vazirmatn = Vazirmatn({ subsets: ["arabic"] });

export const metadata: Metadata = {
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
