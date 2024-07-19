"use client";
import React from "react";
import { Newsreader } from "next/font/google";
import CourseItem from "./courses";
import { useState, useEffect } from "react";

const newsreader = Newsreader({ subsets: ["latin"] });

interface Course {
  id: number;
  title: string;
  desc: string;
  days: string;
  startTime: string;
  endTime: string;
}
const CourseSearch = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  useEffect(() => {
    const getCourses = async () => {
      try {
        const getCall = `/api/select?table=course&columns=courseID,courseName,courseDesc,startTime,endTime`;

        const response = await fetch(getCall, {
          method: "GET",
        });
        if (!response.ok) {
          throw new Error("Could not retrieve courses");
        }
        const data = await response.json();
        const getDays = `/api/select?table=course&columns`
        const fetchedDetails: Course[] = data.map((item: any) => ({
          id:,
          title:,
          desc:,
          days:,
          startTime:,
          endTime:,
        }));
      }
    }
  })

  const handleAddToCart = (id: number) => {
    const selectedCourse = courses.find((course) => course.id === id);

    if (selectedCourse) {
      const cart = JSON.parse(localStorage.getItem("cart") || "[]");
      const isCourseInCart = cart.some(
        (course: { id: number }) => course.id === id,
      );

      if (isCourseInCart) {
        console.log("Already added to cart", selectedCourse);
      } else {
        cart.push(selectedCourse);
        localStorage.setItem("cart", JSON.stringify(cart));
        console.log("Course added to cart successfully", selectedCourse);
      }
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
