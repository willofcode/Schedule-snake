"use client";
import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

const Navbar = () => {
  const [navText, setNavText] = useState("Sign In");
  const [navLink, setNavLink] = useState("/pages/sign-in");
  const router = useRouter();

  useEffect(() => {
    const email = localStorage.getItem("email");
    if (email) {
      setNavText("Log Out");
      setNavLink("/");
    }
  }, []);

  const handleLogOut = () => {
    localStorage.removeItem("email");
    localStorage.removeItem("password");
    localStorage.removeItem('userID');
    localStorage.removeItem("userType");
    setNavText("Sign In");
    setNavLink("/pages/sign-in");
    router.push("/");
  };

  return (
    <nav className="bg-white border-b-2 border-black fixed top-0 w-full z-50 py-4">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center">
          <div className="flex-shrink-0">
            <Link href="/" className="text-[32px] font-bold text-[#2D9DB6] font-newsreader">
              Schedule Snake
            </Link>
          </div>
          <div className="flex space-x-4 items-center">
            <Link
                href="/pages/course-search"
                className="text-[20px] text-gray-800 hover:text-teal-500 px-3 py-2 rounded-md font-medium"
              >
                Course Search
              </Link>
            <Link
              href="/pages/my-schedule"
              className="text-[20px] text-gray-800 hover:text-teal-500 px-3 py-2 rounded-md font-medium"
            >
              My Schedule
            </Link>
            <Link
              href="/pages/cart"
              className="text-[20px] text-gray-800 hover:text-teal-500 px-3 py-2 rounded-md font-medium"
            >
              Cart
            </Link>
            <Link
              href="/pages/settings"
              className="text-[20px] text-gray-800 hover:text-teal-500 px-3 py-2 rounded-md font-medium"
            >
              Settings
            </Link>
            <Link
              href={navLink}
              className="text-[20px] text-gray-800 hover:text-teal-500 px-3 py-2 rounded-md font-medium"
              onClick={navText === "Log Out" ? handleLogOut : undefined}
            >
              {navText}
            </Link>
            <div className="flex items-center">
              <Image
                src="/snakelogo.png"
                alt="Schedule Snake Logo"
                width={106}
                height={91}
              />
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
