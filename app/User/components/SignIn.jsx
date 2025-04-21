"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import Link from "next/link";

const SignIn = () => {
  const router = useRouter();

  const [customers, setCustomers] = useState({
    customerEmail: "",
    customerPasswords: "",
  });

  const [error, setError] = useState(null);
  const [showPassword, setShowPassword] = useState(false); // toggle password visibility

  const handleSignIn = async () => {
    const { customerEmail, customerPasswords } = customers;

    try {
      const result = await signIn("credentials", {
        redirect: false,
        email: customerEmail,
        password: customerPasswords,
        role: "customer",
      });

      if (result?.error) {
        setError(result.error);
        return;
      }

      alert("Sign-In successful");
      router.push("/User");
    } catch (err) {
      setError("An unexpected error occurred. Please try again later.");
    }
  };

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        handleSignIn();
      }}
      className="bg-white shadow-xl p-6 rounded-lg w-96 mx-auto"
    >
      <h1 className="text-2xl font-semibold text-center mb-4">Sign In</h1>

      {error && <p className="text-red-500 text-center">{error}</p>}

      <div className="mb-4">
        <label className="block text-gray-700">Email</label>
        <input
          value={customers.customerEmail}
          onChange={(e) =>
            setCustomers({ ...customers, customerEmail: e.target.value })
          }
          type="email"
          className="w-full mt-1 p-2 border border-gray-300 rounded-lg focus:border-[#eab174] outline-none"
          placeholder="Enter your email"
          required
        />
      </div>

      <div className="mb-4 relative">
        <label className="block text-gray-700">Password</label>
        <input
          value={customers.customerPasswords}
          onChange={(e) =>
            setCustomers({ ...customers, customerPasswords: e.target.value })
          }
          type={showPassword ? "text" : "password"}
          className="w-full mt-1 p-2 pr-10 border border-gray-300 rounded-lg focus:border-[#eab174] outline-none"
          placeholder="Enter your password"
          required
        />
        <button
          type="button"
          onClick={() => setShowPassword((prev) => !prev)}
          className="absolute right-2 top-9 text-gray-600 hover:text-gray-900"
        >
          {showPassword ? (
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
      </div>

      <Link
        href={"/User/SignUp"}
        className="underline mt-[-20px] hover:text-[#a14d31]"
      >
        Don't Have An Account? Register
      </Link>

      <button
        type="submit"
        className="w-full bg-[#c88d4e] p-2 rounded-lg hover:bg-[#a07445] mt-4"
      >
        Sign In
      </button>
    </form>
  );
};

export default SignIn;
