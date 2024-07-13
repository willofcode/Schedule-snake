"use client";

import React from "react";
import CourseItem from "./courses";
import { Newsreader } from "next/font/google";
import { useState } from "react";

const newsreader = Newsreader({ subsets: ["latin"] });

const Cart = () => {
  const [courses, setCourses] = useState([
    {
      id: 1,
      title: "Course 1",
      description: "Description for course 1",
      daysOfWeek: "Monday",
      startTime: 1200,
      endTime: 1300,
    },
    {
      id: 2,
      title: "Course 2",
      description: "Description for course 2",
      daysOfWeek: "Monday",
      startTime: 1200,
      endTime: 1300,
    },
    {
      id: 3,
      title: "Course 3",
      description: "Description for course 3",
      daysOfWeek: "Monday",
      startTime: 1200,
      endTime: 1300,
    },
    {
      id: 4,
      title: "Course 4",
      description: "Description for course 4",
      daysOfWeek: "Tuesday/Thursday",
      startTime: 800,
      endTime: 1300,
    },
    {
      id: 5,
      title: "Course 5",
      description: "Description for course 5",
      daysOfWeek: "Monday",
      startTime: 1230,
      endTime: 1300,
    },
  ]);

  const handleDeleteCourse = (id: number) => {
    const updatedCourses = courses.filter((course) => course.id !== id);
    setCourses(updatedCourses);
  };

  const handleSubmit = () => {
    console.log("Form submitted!");
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
