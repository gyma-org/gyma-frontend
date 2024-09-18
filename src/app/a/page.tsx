"use client";

import { Navigation } from "@/components/layout";
import React, { useState } from "react";

import { Map, Favorite, Reservation, Profile } from "@/components/routes";

const pages = [<Map />, <Favorite />, <Reservation />, <Profile />];

const Application = () => {
  const [pageIndex, setPageIndex] = useState<number>(0);
  return (
    <div>
      {pages[pageIndex]}
      <Navigation value={pageIndex} setValue={setPageIndex} />
    </div>
  );
};

export default Application;
