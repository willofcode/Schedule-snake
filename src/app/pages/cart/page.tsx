"use client";

import React, { useState, useEffect } from "react";
import CourseItem from "./courses";
import { Newsreader } from "next/font/google";

const newsreader = Newsreader({ subsets: ["latin"] });

const Cart = () => {
  const [courses, setCourses] = useState([]);

  useEffect(() => {
    const savedCourses = localStorage.getItem("cart");
    if (savedCourses) {
      setCourses(JSON.parse(savedCourses));
    }
  }, []);

  const handleSubmit = async (e: any) => {
    e.preventDefault();

    const studentId = localStorage.getItem("userID");
    const courseIds = courses.map((course) => course.id);

    try {
      for (const courseId of courseIds) {
        const apiUrl = `/api/insertInto?table=enrollment&category=student_id&category=class_id&value=${studentId}&value=${courseId}`;
        const response = await fetch(apiUrl, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
        });

        if (!response.ok) {
          throw new Error("Error occurred in the network response");
        }

        const result = await response.json();
        console.log(`Course ID ${courseId} inserted:`, result);
      }

      console.log("All course IDs submitted successfully!");
    } catch (error) {
      console.error("Error occurred during insertions:", error);
    }
  };

  const handleDeleteCourse = (id: number) => {
    const updatedCourses = courses.filter((course) => course.id !== id);
    setCourses(updatedCourses);
    localStorage.setItem("cart", JSON.stringify(updatedCourses));
  };

  return (
    <>
      <div className="scrollable-container pt-20 bg-white min-h-screen">
        <div className="px-6 max-w-screen-xl mx-auto">
          <div className="flex justify-between items-center">
            <h1
              className={`${newsreader.className} text-6xl text-black text-left `}
            >
              Selected Courses
            </h1>
            <p className="text-lg text-gray-600 pr-6">
              Total Courses: <strong>{courses.length}</strong>
            </p>
          </div>
          <hr className="border-1 border-black flex-grow " />
          <div className="bg-white rounded-md mt-8">
            {courses.map((course) => (
              <div key={course.id} className="border-b border-gray-200">
                <CourseItem course={course} onDelete={handleDeleteCourse} />
              </div>
            ))}
          </div>
          <div className="mt-8 flex justify-end pb-6">
            <button
              onClick={handleSubmit}
              className="px-6 py-3 bg-[#2D9DB6] text-white rounded-md hover:bg-[#1SAAAAA] focus:outline-none focus:ring-2 focus:ring-blue-400"
            >
              <strong>Submit</strong>
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default Cart;
