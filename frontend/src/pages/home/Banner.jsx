import React, { useEffect, useState } from "react";

import Image1 from "../../assets/image1.jpg";
import Image2 from "../../assets/image2.jpg";
import Image3 from "../../assets/image3.jpg";
import Image4 from "../../assets/image4.jpg";
import Image5 from "../../assets/image5.jpg";
import Image6 from "../../assets/image6.jpg";

const images = [Image1, Image2, Image3, Image4, Image5, Image6];

const Banner = () => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 10000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="bg-white lg:ml-24 xl:px-32 px-4">
      <div className="py-28 flex flex-col md:flex-row justify-between items-center gap-14 md:translate-x-20">
        <div className="md:w-1/2 ml-auto">
          <h1 className="text-5xl font-light mb-5">MAMI SELECT</h1>
          <p className="text-sm mb-7">
            当サイトは海外の正規ルートで仕入れた新品の並行輸入品を厳選して販売しています。
            メルカリを通じて安心して購入でき、低価格提供やリクエスト対応も可能です。ファッション好きに満足いただけるラインナップを用意しています。
          </p>
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
            className="bg-white flex justify-center items-center overflow-hidden rounded-lg 
             w-[430px] h-[640px] md:w-[600px] md:h-[800px]"
          >
            <img
              src={images[currentImageIndex]}
              alt={`Banner ${currentImageIndex + 1}`}
              className="w-full h-full object-contain"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Banner;
