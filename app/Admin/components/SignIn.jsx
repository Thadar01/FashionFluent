"use client";
import { useSearchParams, useRouter } from "next/navigation";
import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { signIn } from "next-auth/react";

const SignIn = () => {
  const [email, setEmail] = useState("");
  const [passwords, setPasswords] = useState("");
  const [show, setShow] = useState(false);

  const Param = useSearchParams();
  const role = Param.get("role");
  const router = useRouter();

  const handleSignIn = async () => {
    try {
      console.log("Attempting sign-in with credentials:", {
        email,
        passwords,
        role,
      });
      const result = await signIn("credentials", {
        redirect: false,
        email,
        password: passwords,
        role,
      });

      console.log("SignIn result", result); // Debugging log
      if (result?.error) {
        alert(result.error);
        setEmail("");
        setPasswords("");
        return;
      }

      alert("Sign-In successful");
      router.push("/Admin/MainDashboard");
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
            href={{ pathname: "/Admin/SignUp", query: { role: role } }}
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
