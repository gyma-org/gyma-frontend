import NavigationBar from "@/components/navigation_bar";
import { Typography } from "@mui/material";
import dynamic from "next/dynamic";

const Map = dynamic(() => import("@/components/map"), { ssr: false });

export default function Home() {
  return (
    <div className="flex relative h-screen w-screen flex-col items-center justify-between overflow-hidden">
      <div>
        {/* <Map /> */}
        <Typography>{process.env.NODE_ENV}</Typography>
      </div>
      {/* <div className="absolute z-50 bottom-0 left-0 right-0">
				<NavigationBar />
			</div> */}
    </div>
  );
}
