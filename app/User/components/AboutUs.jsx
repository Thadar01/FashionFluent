import React from "react";
import NavBar from "./commom/NavBar";
import Footer from "./commom/Footer";
import Image from "next/image";

const AboutUs = () => {
  return (
    <div>
      <NavBar />
      <div className="w-full flex items-center justify-center py-4 mb-7 text-xl font-semibold">
        About Us
      </div>
      <div className="flex flex-col lg:flex-row w-full min-h-screen lg:h-screen justify-around p-4 lg:p-0">
        {/* Text Content (Left Side) */}
        <div className="flex flex-col w-full lg:w-[40%] h-full items-center gap-4 ">
          <h1 className="text-xl md:text-2xl font-semibold">Biography</h1>
          <p className="text-justify w-full md:w-[90%] lg:w-[70%] leading-6 md:leading-7">
            Established on March 10, 2023, Fashion Fluent is more than just a
            clothing website; it's a platform built on the belief that great
            style shouldn't break the bank. We are a locally-founded business
            dedicated to offering a diverse collection of clothing and shoes for
            both men and women, specifically curated for the vibrant tastes of
            young adults and teenagers. Our core mission is to bridge the gap
            between budget-conscious shopping and the desire for high-quality
            fashion. Since our launch, we've strived to provide options that
            meet both needs. This commitment resonated strongly with our
            customers, and in early 2024, Fashion Fluent became widely
            recognized for our ability to consistently deliver premium quality
            products at truly reasonable prices. We are driven by a passion for
            fashion and a dedication to providing value to our community.
          </p>
          <div className="w-full md:w-[90%] lg:w-[70%] mt-3 flex flex-col gap-2 text-xs md:text-sm font-semibold">
            <p>Phone Number: +959647352267</p>
            <p>Gmail: fashionfluent@gmail.com</p>
          </div>
        </div>

        {/* Image (Right Side) */}
        <div className="relative w-full lg:w-[40%] h-[400px] lg:h-[70%] mt-6 lg:mt-0">
          <Image
            src="/assets/aboutUs.jpg"
            alt="about us img"
            fill
            className="object-cover rounded-lg" // or 'object-contain' if needed
            sizes="(max-width: 1024px) 100vw, 50vw" // Optimizes image loading
            priority // If this image is above the fold
          />
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default AboutUs;
