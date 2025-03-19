import React from "react";
import NavBar from "./commom/NavBar";
import Footer from "./commom/Footer";
import Link from "next/link";

const Home = () => {
  return (
    <div>
      <NavBar />

      {/* First Section with Background Image */}
      <div
        className=" h-screen bg-cover bg-center flex items-center justify-center flex-col gap-3"
        style={{ backgroundImage: "url('/assets/registerBg.svg')" }}
      >
        <p
          className="text-4xl sm:text-6xl md:text-8xl lg:text-[140px] font-bold text-[#FFF1E2]"
          style={{
            WebkitTextStroke: "1px #FF7C09", // For Safari/Chrome
            textStroke: "1px #FF7C09", // Standard syntax
          }}
        >
          Grab Our Promotions
        </p>
        <Link href={""} className="text-white text-[40px] underline font-bold">
          Register Now
        </Link>
      </div>

      {/* Second Section with Background Image */}
      <div
        className="h-screen bg-cover bg-center flex justify-start items-end p-10 relative"
        style={{ backgroundImage: "url('/assets/secondBg.jpg')" }}
      >
        <div>
          <p
            className="text-white text-[70px] font-bold"
            style={{
              WebkitTextStroke: "1px black", // For Safari/Chrome
              textStroke: "1px black", // Standard syntax
            }}
          >
            Women's Wear Collection
          </p>
          <p className="text-white bg-blue-300 p-2 mt-4 inline-block">
            Prefer your Smart and Comfort
          </p>
        </div>
      </div>

      {/* Third Section with Background Image */}
      <div
        className="h-screen bg-cover bg-center"
        style={{ backgroundImage: "url('/assets/thirdBg.svg')" }}
      ></div>

      <Footer />
    </div>
  );
};

export default Home;
