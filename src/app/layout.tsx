import type { Metadata } from "next";
import { Vazirmatn } from "next/font/google";
import "./globals.css";
import Footer from '@/components/Footer';

const vazirmatn = Vazirmatn({ subsets: ["arabic"] });


export const metadata: Metadata = {
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
			<div className="flex flex-col min-h-screen">
			<Footer />
		  	</div>
		</html>
	);
}
