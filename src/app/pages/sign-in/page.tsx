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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
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
      const checkStudent = `/api/select?table=student&columns=studentID,userID,email,password&condition=email='${formData.email}';`;
      const studentResponse = await fetch(checkStudent, {
        method: "GET",
      });
      if (!studentResponse.ok) {
        throw new Error("Error with the network response");
      }
      const studentResult = await studentResponse.json(); // after applying .json() conversion, we checkout the logic below:
      if (studentResult.results.length > 0) {
        const userID = studentResult.results[0].userID;
        if (studentResult.results[0].password !== formData.password) {
          throw new Error("Password is incorrect. Please try again.");
        }
        localStorage.setItem("email", formData.email);
        localStorage.setItem("password", formData.password);
        localStorage.setItem("userType", "student");
        localStorage.setItem("userID", userID);
        const studentID = studentResult.results[0].studentID;
        localStorage.setItem("studentID", studentID);
        console.log("Login Successful", studentResult.results[0].password);
        router.push("/");
        setTimeout(() => {
          window.location.reload();
        }, 100);
        return;
      }

      const professorApiCall = `/api/select?table=professor&columns=userID,email,password&condition=email='${formData.email}'`;
      const professorResponse = await fetch(professorApiCall, {
        method: "GET",
      });

      if (!professorResponse.ok) {
        throw new Error("Error with the network response");
      }

      const professorResult = await professorResponse.json();

      if (professorResult.results.length > 0) {
        const userID = professorResult.results[0].userID;
        if (professorResult.results[0].password !== formData.password) {
          throw new Error("Password is incorrect. Please try again.");
        }
        localStorage.setItem("email", formData.email);
        localStorage.setItem("password", formData.password);
        localStorage.setItem("userType", "professor");
        localStorage.setItem("userID", userID);
        console.log("Login Successful", professorResult.results[0].password);
        router.push("/");
        setTimeout(() => {
          window.location.reload();
        }, 100);
        return;
      }

      // If no user is found in either table
      throw new Error("Credentials do not exist. Please sign up or try again.");
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
