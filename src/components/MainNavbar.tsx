"use client";
import { useState, useEffect } from "react";
import Navbar from "./Navbar";
import NavbarProf from "./NavbarProf";

const MainNavbar = () => {
  const [isProf, setIsProf] = useState(false);

  useEffect(() => {
    const userType = localStorage.getItem("userType");
    if (userType === "professor") {
      console.log(userType);
      setIsProf(true);
    }
  }, []);

  return isProf ? <NavbarProf /> : <Navbar />;
};

export default MainNavbar;
