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
const myCourse = () => {
  const [courses, setCourses] = useState<Course[]>([]);

  useEffect(() => {
    const getCourses = async () => {
      try {
        var user = localStorage.getItem("userID");
        var userType = localStorage.getItem("userType");
        console.log("user", user);
        const getCall = `/api/select?table=course&columns=course.courseID,course.courseName,course.startTime,course.endTime,GROUP_CONCAT(days.dayName) AS dayNames,course.courseDesc&inner_join=course_days&on_inner=course.courseID=course_days.courseID&inner_join=days&on_inner=course_days.dayID=days.dayID&left_join=professor&on_left=course.profID=professor.profID&left_join=users&on_left=professor.userID=users.userID&condition=users.userType=${'userType'} AND users.userID=${user}&group_by=course.courseID&order_by=course.startTime`;

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

  const modCourse = (id: number) => {
    const selectedCourse = courses.find((course) => course.id === id);
    console.log("selectedCourse", selectedCourse);
    localStorage.setItem("selectedCourse", JSON.stringify(selectedCourse));
  };

  const addCourse = (id: number, title: string, desc: string, days: string, startTime: string, endTime: string) => {
    const newCourse = {
      id: id,
      title: title,
      desc: desc,
      days: days,
      startTime: startTime,
      endTime: endTime,
    };
    const updatedCourses = [...courses, newCourse];
    setCourses(updatedCourses);
    localStorage.setItem("cart", JSON.stringify(updatedCourses));
  }
  
  const id = 0; 
  const title = ""; 
  const desc = ""; 
  const days = ""; 
  const startTime = ""; 
  const endTime = ""; 

  const handleDeleteCourse = (id: number) => {
    const updatedCourses = courses.filter((course) => course.id !== id);
    setCourses(updatedCourses);
    localStorage.setItem("cart", JSON.stringify(updatedCourses));
    }

  return (
    <>
      <div className="scrollable-container pt-20 bg-white min-h-screen">
        <div className="px-6 max-w-screen-xl mx-auto">
          <div className="flex justify-between items-center">
            <h1
              className={`${newsreader.className} text-6xl text-black text-left `}
            >
              My Courses
            </h1>
          </div>
          <hr className="border-1 border-black flex-grow " />
          <div className="bg-white rounded-md mt-8">
            {courses.map((course) => (
              <div key={course.id} className="border-b border-gray-200">
                <CourseItem course={course} onDelete={handleDeleteCourse} onEdit={modCourse}  />
              </div>
            ))}
          </div>
          <button onClick={() => addCourse(id, title, desc, days, startTime, endTime)}>Add Course</button>
        </div>
      </div>
    </>
  );
};

export default myCourse;
// SELECT course.courseID, course.courseName, course.courseDesc, course.startTime, course.endTime, GROUP_CONCAT(days.dayName) AS dayNames
// FROM course
// JOIN course_days ON course.courseID = course_days.courseID
// JOIN days ON course_days.dayID = days.dayID
// WHERE course.courseID =
// GROUP BY course.courseID, course.courseName, course.courseDesc, course.startTime, course.endTime;
