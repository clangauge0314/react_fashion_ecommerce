import React, { useState } from "react";
import { IoMdClose } from "react-icons/io";
import { IoMegaphoneOutline } from "react-icons/io5";

const Announce = () => {
  const [isVisible, setIsVisible] = useState(true);

  if (!isVisible) return null;

  return (
    <div className="w-full bg-blue-100 border-y border-blue-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-10 sm:h-12">
          <div className="flex-1" />
          <div className="flex items-center gap-2 text-blue-800">
            <IoMegaphoneOutline className="h-5 w-5" />
            <p className="text-base font-medium sm:text-sm">
              신규 회원가입 시 10% 할인 쿠폰 즉시 지급!
            </p>
          </div>
          <div className="flex-1 flex justify-end">
            <button
              onClick={() => setIsVisible(false)}
              className="p-1 hover:bg-blue-200 rounded-full transition-colors"
            >
              <IoMdClose className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Announce;
