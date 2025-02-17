"use client";
import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useSearchParams, useRouter } from "next/navigation";

const SignUp = () => {
  const [staffName, setStaffName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [passwords, setPasswords] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const Param = useSearchParams();
  const role = Param.get("role");
  const router = useRouter();

  const handleSignUp = async () => {
    if (!staffName || !passwords || !confirmPassword) {
      alert("All fields are required");
      return;
    }

    const passwordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

    if (!passwordRegex.test(passwords)) {
      alert(
        "Password must contain at least 8 characters, including an uppercase letter, a lowercase letter, a number, and a special character."
      );
      return;
    }

    if (passwords !== confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    if (!email.includes("@gmail.com")) {
      alert("Please enter a valid Gmail address");
      return;
    }

    if (phone.length < 12) {
      alert("Your phone number is not valid");
      return;
    }
    try {
      const res = await fetch("/api/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ staffName, email, phone, passwords, role }),
      });

      const data = await res.json();

      if (!res.ok) {
        // Display error alert
        alert(data.error || "An error occurred during sign-in");
        setStaffName(""); // Clear staffName
        setPasswords(""); // Clear passwords
        setConfirmPassword("");
        setEmail("");
        setPhone("");

        return;
      }

      // Sign-in successful
      alert("Sign-Up successful");

      router.push(`/Admin/SignIn?role=${role}`);
    } catch (err) {
      alert("An unexpected error occurred. Please try again later.");
    }
  };

  return (
    <div className="flex h-[728px]">
      <div className="bg-[#FFD2A2] flex justify-end flex-col w-[70%] h-full p-14">
        <p className="text-[110px] font-semibold">Fashion Fluent</p>
        <p className="text-[30px] font-semibold">Staff Sign Up</p>
      </div>
      <div className="flex h-full flex-col gap-5 justify-center items-center w-[30%]">
        <p className="text-[30px] font-semibold">Sign Up</p>
        <div className="w-[90%] flex flex-col gap-3">
          <div>
            <p>User Name</p>
            <input
              className="border-x-0 border-t-0 border-b-2 border-black w-full pt-4 px-1 pb-1 mb-4 bg-transparent focus:outline-none"
              value={staffName}
              onChange={(e) => setStaffName(e.target.value)}
            />
          </div>
          <div>
            <p>Email</p>
            <input
              className="border-x-0 border-t-0 border-b-2 border-black w-full pt-4 px-1 pb-1 mb-4 bg-transparent focus:outline-none"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div>
            <p>Phone Number</p>
            <input
              className="border-x-0 border-t-0 border-b-2 border-black w-full pt-4 px-1 pb-1 mb-4 bg-transparent focus:outline-none"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />
          </div>
          <div>
            <p>Passwords</p>
            <div className="relative">
              <Image
                src={showPassword ? "/assets/eye-off.png" : "/assets/eye.png"}
                width={20}
                height={20}
                alt={showPassword ? "hideEye" : "showEye"}
                className="absolute right-7 bottom-10 cursor-pointer"
                onClick={() => setShowPassword((prev) => !prev)}
              />
              <input
                type={showPassword ? "text" : "password"}
                className="border-x-0 border-t-0 border-b-2 border-black w-full pt-4 px-1 pb-1 mb-4 bg-transparent focus:outline-none"
                value={passwords}
                onChange={(e) => setPasswords(e.target.value)}
              />
            </div>
          </div>
          <div>
            <p>Confirm Passwords</p>
            <div className="relative">
              <Image
                src={
                  showConfirmPassword
                    ? "/assets/eye-off.png"
                    : "/assets/eye.png"
                }
                width={20}
                height={20}
                alt={showConfirmPassword ? "hideEye" : "showEye"}
                className="absolute right-7 bottom-10 cursor-pointer"
                onClick={() => setShowConfirmPassword((prev) => !prev)}
              />
              <input
                type={showConfirmPassword ? "text" : "password"}
                className="border-x-0 border-t-0 border-b-2 border-black w-full pt-4 px-1 pb-1 mb-4 bg-transparent focus:outline-none"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
            </div>
          </div>

          <Link
            href={{ pathname: "/SAdmin/ignIn", query: { role: "Staff" } }}
            className="underline mt-[-20px] hover:text-[#a14d31]"
          >
            Already Have An Account? Sign In
          </Link>
        </div>

        <button
          onClick={handleSignUp}
          className="border-4 border-[#4C4135] rounded-lg py-2 px-6 text-[16px] hover:bg-[#ffd2a267] font-semibold"
        >
          Sign Up
        </button>
      </div>
    </div>
  );
};

export default SignUp;
