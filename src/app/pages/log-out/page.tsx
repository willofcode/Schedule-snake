"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function Logout() {
  const router = useRouter();

  useEffect(() => {
    localStorage.removeItem("email");
    localStorage.removeItem("password");
    localStorage.removeItem("userType");
    localStorage.removeItem("userID");
    localStorage.removeItem("studentID");
    localStorage.removeItem("cart");

    router.push("/sign-in");
  }, [router]);

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24 bg-white">
      <div className="flex flex-col space-y-4 border border-gray-300 px-[24px] py-[24px] rounded-lg">
        <p className="text-lg font-medium text-gray-700">
          Logging out...
        </p>
      </div>
    </main>
  );
}
