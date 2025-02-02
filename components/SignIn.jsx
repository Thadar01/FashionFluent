"use client";
import { useSearchParams, useRouter } from "next/navigation";
import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";

const SignIn = () => {
  const [email, setEmail] = useState("");
  const [passwords, setPasswords] = useState("");
  const [show, setShow] = useState(false);

  const Param = useSearchParams();
  const role = Param.get("role");
  const router = useRouter();

  const handleSignIn = async () => {
    try {
      const res = await fetch("/api/signin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, passwords, role }),
      });

      const data = await res.json();

      if (!res.ok) {
        // Display error alert
        alert(data.error || "An error occurred during sign-in");
        setEmail(""); // Clear email
        setPasswords(""); // Clear passwords

        return;
      }

      const sessionData = data.staff;
      console.log(sessionData);
      // Sign-in successful
      alert("Sign-In successful");
      sessionStorage.setItem("userData", JSON.stringify(sessionData));
      router.push("/MainDashboard");
    } catch (err) {
      alert("An unexpected error occurred. Please try again later.");
    }
  };

  return (
    <div className="flex h-[728px]">
      <div className="bg-[#FFD2A2] flex justify-end flex-col w-[70%] h-full p-14">
        <p className="text-[110px] font-semibold">Fashion Fluent</p>
        <p className="text-[30px] font-semibold">{role} Sign In</p>
      </div>
      <div className="flex h-full flex-col gap-10 justify-center items-center w-[30%]">
        <p className="text-[50px] font-semibold">Sign In</p>
        <div className="w-[90%] flex flex-col gap-5">
          <div>
            <p>Email</p>
            <input
              className="border-x-0 border-t-0 border-b-2 border-black w-full pt-4 px-1 pb-1 mb-4 bg-transparent focus:outline-none"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div>
            <p>Passwords</p>
            <div className="relative">
              <Image
                src={"/assets/eye.png"}
                width={20}
                height={20}
                alt="openEye"
                className="absolute right-7 bottom-10 cursor-pointer"
                onClick={() => setShow((prev) => !prev)} // Toggle visibility
              />
              <input
                type={show ? "text" : "password"}
                className="border-x-0 border-t-0 border-b-2 border-black w-full pt-4 px-1 pb-1 mb-4 bg-transparent focus:outline-none"
                value={passwords}
                onChange={(e) => setPasswords(e.target.value)}
              />
            </div>
          </div>

          <Link
            href={{ pathname: "/SignUp", query: { role: role } }}
            className="underline mt-[-20px] hover:text-[#a14d31]"
          >
            Don't have an account? Sign Up
          </Link>
        </div>
        <button
          onClick={handleSignIn}
          className="border-4 border-[#4C4135] rounded-lg py-2 px-6 text-[16px] hover:bg-[#ffd2a267] font-semibold"
        >
          Sign In
        </button>
      </div>
    </div>
  );
};

export default SignIn;
