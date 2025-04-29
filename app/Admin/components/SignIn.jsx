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
    <form
      onSubmit={(e) => {
        e.preventDefault(); // Prevents default form submission
        handleSignIn();
      }}
      className="flex h-[728px]"
    >
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
              className="border-x-0 border-t-0 border-b-2 border-black w-full pt-4 px-1 pb-1 mb-4 bg-transparent focus:outline-none focus:border-[#f8a285]"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div>
            <p>Passwords</p>
            <div className="relative">
              <button
                type="button"
                onClick={() => setShow(!show)}
                className="absolute right-2 t text-gray-500"
              >
                {show ? (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path d="M10 3C5 3 1.73 7.11 1 10c.73 2.89 4 7 9 7s8.27-4.11 9-7c-.73-2.89-4-7-9-7zm0 12c-2.76 0-5-2.24-5-5s2.24-5 5-5a5 5 0 110 10z" />
                    <path d="M10 7a3 3 0 100 6 3 3 0 000-6z" />
                  </svg>
                ) : (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                  >
                    <path d="M12 5c-7 0-11 7-11 7s2.042 3.357 5.47 5.207l1.444-1.444C5.444 14.369 4 12.19 4 12c0-.148 3.598-5 8-5s8 4.852 8 5c0 .185-1.362 2.222-3.94 3.706l1.445 1.445C20.058 15.26 23 12 23 12s-4-7-11-7zM12 15a3 3 0 110-6 3 3 0 010 6z" />
                    <path d="M2.293 2.293l19.414 19.414-1.414 1.414L.879 3.707z" />
                  </svg>
                )}
              </button>
              <input
                type={show ? "text" : "password"}
                className="border-x-0 border-t-0 border-b-2 border-black w-full pt-4 px-1 pb-1 mb-4 bg-transparent focus:outline-none focus:border-[#f8a285]"
                value={passwords}
                onChange={(e) => setPasswords(e.target.value)}
                required
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
          type="submit"
          className="border-4 border-[#4C4135] rounded-lg py-2 px-6 text-[16px] hover:bg-[#ffd2a267] font-semibold"
        >
          Sign In
        </button>
      </div>
    </form>
  );
};

export default SignIn;
