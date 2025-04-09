// app/page.tsx
"use client";

import { Navigation } from "@/components/layout";
import React, { useState } from "react";
import { Map, Favorite, Reservation, Profile } from "@/components/routes";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";

const pages = [
  <Map key="map" />,
  <Favorite key="fav" />,
  <Reservation key="res" />,
  <Profile key="pro" />,
];

export default function Home() {
  const [pageIndex, setPageIndex] = useState<number>(0);
  const { user, loading } = useAuth();
  const router = useRouter();

  if (!loading && !user && pageIndex !== 0) {
    router.push("/auth");
    return null;
  }

  const handleNavigation = (index: number) => {
    if (index === 0 || user) {
      setPageIndex(index);
    } else {
      router.push("/auth");
    }
  };

  return (
    <>
      {pages[pageIndex]}
      <Navigation value={pageIndex} setValue={handleNavigation} />
    </>
  );
}
