import NavigationBar from "@/components/navigation_bar";
import dynamic from "next/dynamic";

const Map = dynamic(() => import("@/components/map"), { ssr: false });
<<<<<<< HEAD
const Footer = dynamic(() => import("@/components/Footer"), { ssr: false });
=======
>>>>>>> b0a01eb90408b4f555e3a74079add9668bf969a9

export default function Home() {
	return (
		<div className="flex relative h-screen w-screen flex-col items-center justify-between overflow-hidden">
			<div>
				<Map />
			</div>
<<<<<<< HEAD
=======
			{/* <div className="absolute z-50 bottom-0 left-0 right-0">
				<NavigationBar />
			</div> */}
>>>>>>> b0a01eb90408b4f555e3a74079add9668bf969a9
		</div>
	);
}
