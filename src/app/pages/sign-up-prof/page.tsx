"use client";
import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

interface FormData {
  signUpCode: string;
  email: string;
  password: string;
  fullName: string;
}

export default function SignUp() {
  const router = useRouter();
  const [formData, setFormData] = useState<FormData>({
    signUpCode: "",
    email: "",
    password: "",
    fullName: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    localStorage.removeItem("cart");
    try {
      if (formData.signUpCode !== "A8b2C5dX7F") {
        throw new Error("Error, wrong sign up code.");
      }
      const userTableCall = `/api/insertInto?table=users&category=userType&category=email&category=password&value='professor'&value='${formData.email}'&value='${formData.password}'`;
      const userTableResponse = await fetch(userTableCall, {
        method: "POST",
      });
      if (!userTableResponse.ok) {
        throw new Error("Error with the users table");
      }
      const userTableResult = await userTableResponse.json();
      const userID = userTableResult.results.insertId;
      if (!userID) {
        throw new Error("Failed to retrieve the user ID");
      }

      const apiCall = `/api/insertInto?table=professor&category=userID&category=email&category=password&category=fullname&value='${userID}'&value='${formData.email}'&value='${formData.password}'&value='${formData.fullName}'`;
      const response = await fetch(apiCall, {
        method: "POST",
      });
      if (!response.ok) {
        throw new Error("Error occurred in the network response");
      }
      localStorage.setItem("email", formData.email);
      localStorage.setItem("password", formData.password);
      localStorage.setItem("userType", "professor");
      localStorage.setItem("userID", userID);
      const result = await response.json();
      console.log("Form submitted", result);
      router.push("/");
      setTimeout(() => {
        window.location.reload();
      }, 100);
    } catch (error) {
      console.error("Could not complete insert into query", error);
    }
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24 bg-white">
      <form
        className="flex flex-col space-y-4 border border-gray-300 px-[24px] py-[24px] rounded-lg"
        onSubmit={handleSubmit}
      >
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Sign Up Code
          </label>
          <input
            type="text"
            id="signUpCode"
            name="signUpCode"
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            placeholder="Value"
            value={formData.signUpCode}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Email
          </label>
          <input
            type="text"
            id="email"
            name="email"
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            placeholder="Value"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Password
          </label>
          <input
            type="password"
            id="password"
            name="password"
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            placeholder="Value"
            value={formData.password}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Full Name
          </label>
          <input
            type="text"
            id="fullName"
            name="fullName"
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            placeholder="Value"
            value={formData.fullName}
            onChange={handleChange}
            required
          />
        </div>
        <button
          type="submit"
          className="mt-4 w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-black hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          Sign Up
        </button>
      </form>
      <div className="mt-4 text-[#1329E9] text-sm">
        <Link href="/pages/sign-up">Click to register as a student</Link>
      </div>
    </main>
  );
}
