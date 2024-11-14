import React from "react";
import { Card, CardHeader, CardBody, Button } from "@material-tailwind/react";
import { FaArrowRight } from "react-icons/fa";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination, Navigation } from "swiper/modules";
import { useNavigate } from "react-router-dom";

import "swiper/css";
import "swiper/css/pagination";

const categoryData = [
  {
    id: 1,
    productName: "人気商品 1",
    image: "https://docs.material-tailwind.com/img/team-1.jpg",
    category: "category_1",
  },
  {
    id: 2,
    productName: "人気商品 2",
    image: "https://docs.material-tailwind.com/img/team-2.jpg",
    category: "category_2",
  },
  {
    id: 3,
    productName: "人気商品 3",
    image: "https://docs.material-tailwind.com/img/team-3.jpg",
    category: "category_3",
  },
  {
    id: 4,
    productName: "人気商品 4",
    image: "https://docs.material-tailwind.com/img/team-1.jpg",
    category: "category_4",
  },
  {
    id: 5,
    productName: "人気商品 5",
    image: "https://docs.material-tailwind.com/img/team-2.jpg",
    category: "category_5",
  },
  {
    id: 6,
    productName: "人気商品 6",
    image: "https://docs.material-tailwind.com/img/team-3.jpg",
    category: "category_6",
  },
  {
    id: 7,
    productName: "人気商品 7",
    image: "https://docs.material-tailwind.com/img/team-1.jpg",
    category: "category_7",
  },
  {
    id: 8,
    productName: "人気商品 8",
    image: "https://docs.material-tailwind.com/img/team-2.jpg",
    category: "category_8",
  },
];

const Category = () => {
  const navigate = useNavigate();

  return (
    <div className="max-w-screen-2xl mx-auto container xl:px-28 px-4 py-20">
      {/* 모바일 Swiper */}
      <div className="block lg:hidden">
        <Swiper
          slidesPerView={1}
          spaceBetween={20}
          centeredSlides={true}
          pagination={{ clickable: true }}
          loop={true}
          autoplay={{
            delay: 2000,
            disableOnInteraction: false,
          }}
          modules={[Autoplay, Pagination, Navigation]}
          breakpoints={{
            640: {
              slidesPerView: 1,
              spaceBetween: 10,
            },
            768: {
              slidesPerView: 2,
              spaceBetween: 20,
            },
          }}
          className="mySwiper"
          style={{ display: "flex", justifyContent: "center" }}
        >
          {categoryData.map((item) => (
            <SwiperSlide key={item.id} className="flex justify-center">
              <Card className="bg-white p-4 rounded-lg shadow-2xl hover:shadow-[0px_15px_30px_rgba(0,0,0,0.3)] transition-shadow duration-300 mx-auto">
                <CardHeader floated={false} className="h-60">
                  <img
                    src={item.image}
                    alt={`profile-${item.id}`}
                    className="w-full h-full object-cover rounded-lg"
                  />
                </CardHeader>
                <CardBody className="text-center mt-4">
                  <p className="text-2xl font-semibold text-blue-gray-700 mb-2">
                    {item.productName}
                  </p>
                  <div className="flex justify-center mt-4">
                    <Button
                      color="blue"
                      variant="filled"
                      className="flex items-center gap-2 bg-blue-500 text-white rounded-lg px-4 py-2 hover:bg-blue-600 transition-colors duration-300"
                      onClick={() => navigate("/category/all")} 
                    >
                      すべての商品を見る
                      <FaArrowRight />
                    </Button>
                  </div>
                </CardBody>
              </Card>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>

      {/* 태블릿 그리드 */}
      <div className="grid grid-cols-2 gap-4 md:hidden mt-8">
        {categoryData.map((item) => (
          <Card
            key={item.id}
            className="bg-white p-4 rounded-lg shadow-2xl hover:shadow-[0px_15px_30px_rgba(0,0,0,0.3)] transition-shadow duration-300"
          >
            <CardHeader floated={false} className="h-40">
              <img
                src={item.image}
                alt={`profile-${item.id}`}
                className="w-full h-full object-cover rounded-lg"
              />
            </CardHeader>
            <CardBody className="text-center mt-2">
              <p className="text-lg font-semibold text-blue-gray-700 mb-2">
                {item.category}
              </p>
              <div className="flex justify-center mt-2">
                <Button
                  color="blue"
                  variant="filled"
                  className="flex items-center gap-2 bg-blue-500 text-white rounded-lg px-4 py-2 hover:bg-blue-600 transition-colors duration-300"
                  onClick={() => navigate(`/category/${item.category}`)}
                >
                  このカテゴリーを見る
                  <FaArrowRight />
                </Button>
              </div>
            </CardBody>
          </Card>
        ))}
      </div>

      <div className="hidden lg:grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 justify-center">
        {categoryData.map((item) => (
          <Card
            key={item.id}
            className="w-full bg-white p-4 rounded-lg shadow-2xl hover:shadow-[0px_15px_30px_rgba(0,0,0,0.3)] transition-shadow duration-300 mx-auto"
          >
            <CardHeader floated={false} className="h-60">
              <img
                src={item.image}
                alt={`profile-${item.id}`}
                className="w-full h-full object-cover rounded-lg"
              />
            </CardHeader>
            <CardBody className="text-center mt-4">
              <p className="text-2xl font-semibold text-blue-gray-700 mb-2">
                {item.category}
              </p>
              <div className="flex justify-center mt-4">
                <Button
                  color="blue"
                  variant="filled"
                  className="flex items-center gap-2 bg-blue-500 text-white rounded-lg px-4 py-2 hover:bg-blue-600 transition-colors duration-300"
                  onClick={() => navigate(`/category/${item.category}`)}
                >
                  このカテゴリーを見る
                  <FaArrowRight />
                </Button>
              </div>
            </CardBody>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default Category;
