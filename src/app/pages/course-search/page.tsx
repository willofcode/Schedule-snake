"use client";
import React from "react";
import { Newsreader } from "next/font/google";
import CourseItem from "./courses";
import { useState } from "react";

const newsreader = Newsreader({ subsets: ["latin"] });
const CourseSearch = () => {
  const [courses, setCourses] = useState([
    {
      id: 1,
      title: "Computer Organization",
      description: "VHDL",
      daysOfWeek: "Monday",
      startTime: 900,
      endTime: 1130,
    },
    {
      id: 2,
      title: "Database Fundamentals",
      description: "MySQL",
      daysOfWeek: "Wednesday",
      startTime: 1700,
      endTime: 1930,
    },
  ]);
  const handleAddToCart = (id: number) => {
    const selectedCourse = courses.find((course) => course.id === id);
    if (selectedCourse) {
      const cart = JSON.parse(localStorage.getItem("cart") || "[]");
      cart.push(selectedCourse);
      localStorage.setItem("cart", JSON.stringify(cart));
      console.log("Course added to cart successfully", selectedCourse);
    }
  };
  return (
    <>
      <div className="scrollable-container pt-20 bg-white min-h-screen">
        <div className="p-20 bg-white min-h-screen ">
          <div className="flex justify-between items-center">
            <h1
              className={`${newsreader.className} text-6xl text-black text-left `}
            >
              Course Search
            </h1>
          </div>
          <hr className="border-1 border-black flex-grow " />
          <div className="bg-white rounded-md mt-8">
            {courses.map((course) => (
              <div key={course.id} className="border-b border-gray-200">
                <CourseItem course={course} onAdd={handleAddToCart} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default CourseSearch;
