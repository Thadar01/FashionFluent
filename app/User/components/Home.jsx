import React from "react";
import NavBar from "./commom/NavBar";
import Footer from "./commom/Footer";
import Link from "next/link";

const Home = () => {
  return (
    <div>
      <NavBar />
      {/* First Section with Background Image */}
      {/* First Section with Background Image */}
      <div
        className="h-screen bg-cover bg-center flex flex-col items-center justify-center gap-3 px-4 text-center"
        style={{ backgroundImage: "url('/assets/registerBg.svg')" }}
      >
        <p
          className="text-3xl sm:text-5xl md:text-7xl lg:text-[100px] xl:text-[140px] font-bold text-[#FFF1E2]"
          style={{
            WebkitTextStroke: "1px #FF7C09",
            textStroke: "1px #FF7C09",
          }}
        >
          Grab Our Promotions
        </p>
        <Link
          href={""}
          className="text-white text-xl sm:text-2xl md:text-3xl lg:text-4xl underline font-bold"
        >
          Register Now
        </Link>
      </div>

      {/* Second Section with Background Image */}
      <div
        className="h-screen bg-cover bg-center flex flex-col items-center sm:items-start justify-center sm:justify-end p-6 sm:p-10 text-center sm:text-left"
        style={{ backgroundImage: "url('/assets/secondBg.jpg')" }}
      >
        <div className="flex flex-col items-center sm:items-start">
          <Link
            href={""}
            className="text-white text-3xl sm:text-5xl md:text-6xl lg:text-[70px] font-bold"
            style={{
              WebkitTextStroke: "1px black",
              textStroke: "1px black",
            }}
          >
            Women's Wear Collection
          </Link>
          <p className="font-bold text-sm sm:text-lg md:text-xl p-2">
            Prefer your Smart and Comfort
          </p>
        </div>
      </div>

      {/* Third Section with Background Image */}
      <div
        className="h-screen bg-cover bg-center flex flex-col items-center sm:items-start justify-center sm:justify-end p-6 sm:p-10 text-center sm:text-left"
        style={{ backgroundImage: "url('/assets/thirdBg.svg')" }}
      >
        <div className="flex flex-col items-center sm:items-start">
          <Link
            href={""}
            className="text-white text-3xl sm:text-5xl md:text-6xl lg:text-[70px] font-bold"
          >
            Men's Wear Collection
          </Link>
          <p className="text-white font-bold text-sm sm:text-lg md:text-xl p-2">
            Shine with Our Fashions
          </p>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Home;
