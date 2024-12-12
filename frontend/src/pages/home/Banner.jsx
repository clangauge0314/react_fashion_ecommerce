import React from "react";

import Image2 from "../../assets/image2.webp";

const Banner = () => {
  return (
    <div className="bg-white lg:ml-24 xl:px-32 px-4">
      <div className="py-28 flex flex-col md:flex-row justify-between items-center gap-14 md:translate-x-20">
        <div className="md:w-1/2 ml-auto">
          <h1 className="text-6xl sm:text-5xl font-light mb-10">MAMI SELECT</h1>
          <p className="text-base mb-7"></p>
          <div className="flex flex-col items-start gap-4">
            <button className="bg-black hover:bg-gray-700 px-8 py-4 text-white font-semibold rounded-sm flex items-center gap-2">
              <span className="block text-center">サイトの商品を見る</span>
            </button>
            <button className="bg-red-500 hover:bg-red-700 px-8 py-4 text-white font-semibold rounded-sm flex items-center gap-2">
              メルカリへ移動
            </button>
          </div>
        </div>
        <div className="md:w-1/2 lg:mr-24 flex justify-center items-center">
          <div
            className="bg-white flex justify-center items-center overflow-hidden rounded-lg relative"
            style={{
              aspectRatio: "3 / 4",
              maxWidth: "600px",
              maxHeight: "800px",
            }}
          >
            <img
              src={Image2}
              alt="Banner Image"
              className="w-full h-full object-contain"
              loading="lazy"
            />
            <div className="absolute inset-0 flex flex-col justify-center items-center text-white p-4 bg-black bg-opacity-50">
              <p className="text-lg font-bold mb-4">
                ・正規ルートから仕入れた海外並行輸入品を直接ご提供しているため、超☆低価格
              </p>
              <p className="text-lg font-bold mb-4">
                ・完全新品、検品済み、商品不備の場合は返品交換あり♪
              </p>
              <p className="text-lg font-bold">
                ・メルカリを通じてご購入いただけるため、安心安全♡
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Banner;
