import NavigationBar from "@/components/navigation_bar";
import dynamic from "next/dynamic";

const Map = dynamic(() => import("@/components/map"), { ssr: false });
const Footer = dynamic(() => import("@/components/Footer"), { ssr: false });

export default function Home() {
	return (
		<div className="flex relative h-screen w-screen flex-col items-center justify-between overflow-hidden">
			<div>
				<Map />
			</div>
		</div>
	);
}
