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
        const getCall = `/api/select?table=course&columns=course.courseID,course.courseName,course.courseDesc,course.startTime,course.endTime,GROUP_CONCAT(days.dayName) AS dayNames&inner_join=course_days&on_inner=course.courseID=course_days.courseID&inner_join=days&on_inner=course_days.dayID=days.dayID&group_by=course.courseID,course.courseName,course.courseDesc,course.startTime,course.endTime`;

        const response = await fetch(getCall, {
          method: "GET",
        });
        if (!response.ok) {
          throw new Error("Could not retrieve courses");
        }
        const data = await response.json();
        const fetchedDetails: Course[] = data.results.map((item: any) => ({
          id: item.courseID,
          title: item.courseName,
          desc: item.courseDesc,
          days: item.dayNames,
          startTime: item.startTime,
          endTime: item.endTime,
        }));
        setCourses(fetchedDetails);
      } catch (error) {
        console.log("Error querying the courses", error);
      }
    };

    getCourses();
  }, []);

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
        <div className=" w-full scrollable-container pt-20 bg-white min-h-screen">
          <div className="px-6 max-w-screen-xl mx-auto">
            <div className="flex justify-between items-center">
              <h1
                  className={`${newsreader.className} text-6xl text-black text-left `}
              >
                Course Search
              </h1>
            </div>
            <hr className="border-1 border-black flex-grow " />
            <div className="bg-white scrollable-containe rounded-md mt-8">
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