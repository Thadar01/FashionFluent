"use client";
import React, { use, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

const SignUp = () => {
  const router = useRouter();

  const [customers, setCustomers] = useState({
    customerName: "",
    customerEmail: "",
    customerPasswords: "",
    confirmPasswords: "",
  });

  const handleRegister = async () => {
    const { customerName, customerEmail, customerPasswords, confirmPasswords } =
      customers;

    const passwordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

    if (!passwordRegex.test(customerPasswords)) {
      alert(
        "Password must contain at least 8 characters, including an uppercase letter, a lowercase letter, a number, and a special character."
      );
      return;
    }

    if (customerPasswords !== confirmPasswords) {
      alert("Passwords do not match");
      return;
    }

    if (!customerEmail.includes("@gmail.com")) {
      alert("Please enter a valid Email address");
      return;
    }

    try {
      const res = await fetch("/api/customer", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(customers),
      });

      const data = await res.json();

      if (!res.ok) {
        // Display error alert
        alert(data.error || "An error occurred during sign-in");
        setCustomers({
          customerName: "",
          customerEmail: "",
          customerPasswords: "",
          confirmPasswords: "",
        });

        return;
      }

      // Sign-in successful
      alert("Register successful");

      router.push(`/User`);
    } catch (err) {
      alert("An unexpected error occurred. Please try again later.");
    }
  };
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        handleRegister();
      }}
      className="bg-white shadow-xl p-6 rounded-lg w-96 mx-auto"
    >
      <h1 className="text-2xl font-semibold text-center mb-4">Register</h1>

      <div className="mb-4">
        <label className="block text-gray-700">User Name</label>
        <input
          value={customers.customerName}
          onChange={(e) =>
            setCustomers({ ...customers, customerName: e.target.value })
          }
          type="text"
          className="w-full mt-1 p-2 border border-gray-300 rounded-lg focus:border-[#eab174] outline-none"
          placeholder="Enter your username"
          required
        />
      </div>

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

      <div className="mb-4">
        <label className="block text-gray-700">Confirm Password</label>
        <input
          value={customers.confirmPasswords}
          onChange={(e) =>
            setCustomers({ ...customers, confirmPasswords: e.target.value })
          }
          type="password"
          className="w-full mt-1 p-2 border border-gray-300 rounded-lg focus:border-[#eab174] outline-none"
          placeholder="Confirm your password"
          required
        />
      </div>
      <Link
        href={"/User/SignIn"}
        className="underline mt-[-20px] hover:text-[#a14d31]"
      >
        Already Have An Account? Sign In
      </Link>
      <button
        type="submit"
        className="w-full bg-[#c88d4e]  p-2 rounded-lg hover:bg-[#a07445] mt-4"
      >
        Register
      </button>
    </form>
  );
};

export default SignUp;
