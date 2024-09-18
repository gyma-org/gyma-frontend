import { Button, Container } from "@mui/material";
import Link from "next/link";
// import dynamic from "next/dynamic";

// const Map = dynamic(() => import("@/components/map"), { ssr: false });

export default function Home() {
  return (
    <Container
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
        width: "100vw",
      }}>
      <Link href={"/a"}>
        <Button variant="contained">{"ورود به برنامه"}</Button>
      </Link>
    </Container>
  );
}
