"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";

const SignIn = () => {
  const router = useRouter();

  const [customers, setCustomers] = useState({
    customerEmail: "",
    customerPasswords: "",
  });

  const [error, setError] = useState(null);

  const handleSignIn = async () => {
    const { customerEmail, customerPasswords } = customers; // Extract values

    try {
      console.log("Attempting sign-in with credentials:", {
        customerEmail,
        customerPasswords,
        role: "customer",
      });

      const result = await signIn("credentials", {
        redirect: false,
        email: customerEmail,
        password: customerPasswords,
        role: "customer",
      });

      console.log("SignIn result", result);

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

      <div className="mb-4">
        <label className="block text-gray-700">Password</label>
        <input
          value={customers.customerPasswords}
          onChange={(e) =>
            setCustomers({ ...customers, customerPasswords: e.target.value })
          }
          type="password"
          className="w-full mt-1 p-2 border border-gray-300 rounded-lg focus:border-[#eab174] outline-none"
          placeholder="Enter your password"
          required
        />
      </div>

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
