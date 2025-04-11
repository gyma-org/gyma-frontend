"use client";

import { Navigation } from "@/components/layout";
import React, { useState } from "react";
import { Map, Favorite, Reservation, Profile } from "@/components/routes";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { SnackbarProvider } from "notistack";

const pages = [<Map key={0} />, <Favorite key={1} />, <Reservation key={2} />, <Profile key={3} />];

export default function Home() {
  const [pageIndex, setPageIndex] = useState<number>(0);
  const { user, loading } = useAuth();
  const router = useRouter();

  // Redirect to login if unauthenticated user tries to access any page other than Map
  if (!loading && !user && pageIndex !== 0) {
    router.push("/auth");
    return null;
  }

  // Update page index conditionally
  const handleNavigation: React.Dispatch<React.SetStateAction<number>> = (index) => {
    if (typeof index === "number" && (index === 0 || user)) {
      setPageIndex(index);
    } else if (!user) {
      router.push("/auth");
    }
  };

  return (
    <div>
      <SnackbarProvider />
      {pages[pageIndex]}
      <Navigation
        value={pageIndex}
        setValue={handleNavigation}
      />
    </div>
  );
}