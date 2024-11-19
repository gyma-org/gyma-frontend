"use client";

import { Navigation } from "@/components/layout";
import React, { useState } from "react";
import { Map, Favorite, Reservation, Profile } from "@/components/routes";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";

const pages = [
  <Map key={0} />,
  <Favorite key={1} />,
  <Reservation key={2} />,
  <Profile key={3} />
];

const Application = () => {
  const [pageIndex, setPageIndex] = useState<number>(0);
  const { user, loading } = useAuth();
  const router = useRouter();

  // Redirect to login if trying to access restricted pages without authentication
  if (!loading && !user && pageIndex !== 0) {
    router.push("/auth");
    return null;
  }

  return (
    <div>
      {/* Show the current page based on the user's selected tab */}
      {pageIndex === 0 || user ? (
        pages[pageIndex]
      ) : (
        <Map /> // Default to showing the Map if user is not logged in
      )}
      <Navigation value={pageIndex} setValue={setPageIndex} />
    </div>
  );
};

export default Application;
