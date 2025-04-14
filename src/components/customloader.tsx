"use client";
import { Loader } from "lucide-react";
import React from "react";

const CustomLoader: React.FC = () => {
  return (
    <div className="flex justify-center items-center h-screen">
      <Loader />
    </div>
  );
};

export default CustomLoader;
