import NavigationBar from "@/components/navigation_bar";
import dynamic from "next/dynamic";

const Map = dynamic(() => import("@/components/map"), { ssr: false });

export default function Home() {
	return (
		<div className="flex relative h-screen w-screen flex-col items-center justify-between overflow-hidden">
			<div>
				<Map />
			</div>
			{/* <div className="absolute z-50 bottom-0 left-0 right-0">
				<NavigationBar />
			</div> */}
		</div>
	);
}
