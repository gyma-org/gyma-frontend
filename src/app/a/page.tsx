"use client";

import { Navigation } from "@/components/layout";
import React, { useState } from "react";

const Application = () => {
  const [pageIndex, setPageIndex] = useState<number>(0);
  return (
    <div>
      Application
      <Navigation value={pageIndex} setValue={setPageIndex} />
    </div>
  );
};

export default Application;
