import React from "react";
import { Link } from "react-router-dom";
import { Card, CardHeader, CardBody, Button } from "@material-tailwind/react";
import { FaArrowRight } from "react-icons/fa";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination, Navigation } from "swiper/modules";

import "swiper/css";
import "swiper/css/pagination";

import Image1 from "../../assets/images/image1.png";
import Image2 from "../../assets/images/image2.png";
import Image3 from "../../assets/images/image3.png";
import Image4 from "../../assets/images/image4.png";
import Image5 from "../../assets/images/image5.png";

const Category = () => {
  return (
    <div className="max-w-screen-2xl mx-auto container xl:px-28 px-4 py-20">
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
          {[...Array(8)].map((_, index) => (
            <SwiperSlide key={index} className="flex justify-center">
              <Card className="bg-white p-4 rounded-lg shadow-2xl hover:shadow-[0px_15px_30px_rgba(0,0,0,0.3)] transition-shadow duration-300 mx-auto">
                <CardHeader floated={false} className="h-60">
                  <img
                    src={`https://docs.material-tailwind.com/img/team-${
                      (index % 3) + 1
                    }.jpg`}
                    alt={`profile-${index + 1}`}
                    className="w-full h-full object-cover rounded-lg"
                  />
                </CardHeader>
                <CardBody className="text-center mt-4">
                  <p className="text-2xl font-semibold text-blue-gray-700 mb-2">
                    Natalie Paisley {index + 1}
                  </p>
                  <div className="flex justify-center mt-4">
                    <Button
                      color="blue"
                      variant="filled"
                      className="flex items-center gap-2 bg-blue-500 text-white rounded-lg px-4 py-2 hover:bg-blue-600 transition-colors duration-300"
                    >
                      Go to category
                      <FaArrowRight />
                    </Button>
                  </div>
                </CardBody>
              </Card>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>

      <div className="grid grid-cols-2 gap-4 md:hidden mt-8">
        {[...Array(8)].map((_, index) => (
          <Card
            key={index}
            className="bg-white p-4 rounded-lg shadow-2xl hover:shadow-[0px_15px_30px_rgba(0,0,0,0.3)] transition-shadow duration-300"
          >
            <CardHeader floated={false} className="h-40">
              <img
                src={`https://docs.material-tailwind.com/img/team-${
                  (index % 3) + 1
                }.jpg`}
                alt={`profile-${index + 1}`}
                className="w-full h-full object-cover rounded-lg"
              />
            </CardHeader>
            <CardBody className="text-center mt-2">
              <p className="text-lg font-semibold text-blue-gray-700 mb-2">
                Natalie Paisley {index + 1}
              </p>
              <div className="flex justify-center mt-2">
                <Button
                  color="blue"
                  variant="filled"
                  className="flex items-center gap-2 bg-blue-500 text-white rounded-lg px-3 py-1 hover:bg-blue-600 transition-colors duration-300"
                >
                  Go to category
                  <FaArrowRight />
                </Button>
              </div>
            </CardBody>
          </Card>
        ))}
      </div>

      <div className="hidden lg:grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 justify-center">
        {[...Array(8)].map((_, index) => (
          <Card
            key={index}
            className="w-full bg-white p-4 rounded-lg shadow-2xl hover:shadow-[0px_15px_30px_rgba(0,0,0,0.3)] transition-shadow duration-300 mx-auto"
          >
            <CardHeader floated={false} className="h-60">
              <img
                src={`https://docs.material-tailwind.com/img/team-${
                  (index % 3) + 1
                }.jpg`}
                alt={`profile-${index + 1}`}
                className="w-full h-full object-cover rounded-lg"
              />
            </CardHeader>
            <CardBody className="text-center mt-4">
              <p className="text-2xl font-semibold text-blue-gray-700 mb-2">
                Category {index + 1}
              </p>
              <div className="flex justify-center mt-4">
                <Button
                  color="blue"
                  variant="filled"
                  className="flex items-center gap-2 bg-blue-500 text-white rounded-lg px-4 py-2 hover:bg-blue-600 transition-colors duration-300"
                >
                  Go to category
                  <FaArrowRight />
                </Button>
              </div>
            </CardBody>
          </Card>
        ))}
      </div>

      {/* Image Links Section */}
      <div className="mt-20 flex flex-col md:flex-row items-center gap-4">
        <p className="font-semibold uppercase md:rotate-90 text-center bg-black text-white md:p-1.5 p-2 rounded-sm inline-flex">
          Explore new and popular styles
        </p>
        <div>
          <Link to="/">
            <img
              src={Image1}
              alt=""
              className="w-full hover:scale-105 transition-all duration-200"
            />
          </Link>
        </div>
        <div className="md:w-1/2">
          <div className="grid grid-cols-2 gap-2">
            <Link to="/">
              <img
                src={Image2}
                alt=""
                className="w-full hover:scale-105 transition-all duration-200"
              />
            </Link>
            <Link to="/">
              <img
                src={Image3}
                alt=""
                className="w-full hover:scale-105 transition-all duration-200"
              />
            </Link>
            <Link to="/">
              <img
                src={Image4}
                alt=""
                className="w-full hover:scale-105 transition-all duration-200"
              />
            </Link>
            <Link to="/">
              <img
                src={Image5}
                alt=""
                className="w-full hover:scale-105 transition-all duration-200"
              />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Category;
