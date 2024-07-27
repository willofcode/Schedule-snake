"use client";
import { useState, useEffect } from "react";
import Navbar from "./Navbar";
import NavbarProf from "./NavbarProf";
import NavbarDef from "./NavbarDef";

const MainNavbar = () => {
  const [userType, setUserType] = useState<string | null>(null);

  useEffect(() => {
    const storedUserType = localStorage.getItem("userType");
    setUserType(storedUserType);
  }, []);

  if (userType === null) {
    return <NavbarDef />;
  } else if (userType === "professor") {
    return <NavbarProf />;
  } else {
    return <Navbar />;
  }
};

export default MainNavbar;
