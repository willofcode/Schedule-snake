"use client";
import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";

interface FormData {
  email: string;
  password: string;
}

export default function SignIn() {
  const router = useRouter();
  const [formData, setFormData] = useState<FormData>({
    email: "",
    password: "",
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
    const apiCall = `/api/select?table=student&columns=email,password&condition=email='${formData.email}';`;
    try {
      const response = await fetch(apiCall, {
        method: "GET",
      });
      if (!response.ok) {
        throw new Error("Error with the network response");
      }
      const result = await response.json(); // after applying .json() conversion, we checkout the logic below:
      if (result.results.length === 0) {
        throw new Error(
          "Credentials do not exist. Please sign up or try again.",
        );
      }
      if (result.results[0].password !== formData.password) {
        throw new Error("Password is incorrect. Please try again.");
      }
      localStorage.setItem("email", formData.email);
      localStorage.setItem("password", formData.password);
      console.log("Login Successful", result.results.password);
      router.push("/");
      window.location.reload();
    } catch (error) {
      console.log("Login was not successful", error);
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
            Student Email
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
        <button
          type="submit"
          className="mt-4 w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-black hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          Sign In
        </button>
      </form>
    </main>
  );
}
