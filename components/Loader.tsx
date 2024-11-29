import { LoaderPinwheelIcon } from "lucide-react";
import React from "react";

const Loader = () => {
  return (
    <div className="flex-center h-screen w-full text-white">
      <LoaderPinwheelIcon size={50} className="animate-spin"/>
    </div>
  );
};

export default Loader;
