"use client";

import React, { useState, useEffect } from "react";
import CourseItem from "./courses";
import { Newsreader } from "next/font/google";
import { useRouter } from "next/navigation";

const newsreader = Newsreader({ subsets: ["latin"] });

interface Course {
  id: number;
  title: string;
  description: string;
  days: string;
  startTime: string;
  endTime: string;
}

const Cart = () => {
  const router = useRouter();
  const [courses, setCourses] = useState<Course[]>([]);
  const [enrolledCourses, setEnrolledCourses] = useState<Course[]>([]);
  const [conflictMessage, setConflictMessage] = useState<string | null>(null);

  const fetchData = async () => {
    try {
      const user = localStorage.getItem("userID");
      const userType = localStorage.getItem("userType");
      if (!user || !userType) {
        throw new Error("User ID or User Type not found in localStorage");
      }

      const studentSchedule = `/api/select?table=course&columns=course.courseID,course.courseName,course.startTime,course.endTime,GROUP_CONCAT(days.dayName) AS dayNames,professor.fullname,course.courseDesc&inner_join=course_days&on_inner=course.courseID=course_days.courseID&inner_join=days&on_inner=course_days.dayID=days.dayID&inner_join=professor&on_inner=course.profID=professor.profID&inner_join=enrollment&on_inner=course.courseID=enrollment.courseID&inner_join=student&on_inner=enrollment.studentID=student.studentID&inner_join=users&on_inner=student.userID=users.userID&condition=users.userType='student' AND users.userID=${user}&group_by=course.courseID&order_by=course.startTime`;

      const queryURL = studentSchedule;

      const response = await fetch(queryURL, { method: "GET" });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Could not retrieve Courses: ${errorText}`);
      }

      const data = await response.json();

      if (data.results && Array.isArray(data.results)) {
        const enrolledCourses = data.results.map((course: any) => ({
          id: course.courseID,
          title: course.courseName,
          description: course.courseDesc,
          days: course.dayNames || "",
          startTime: course.startTime,
          endTime: course.endTime,
        }));

        setEnrolledCourses(enrolledCourses);
      } else {
        console.error(
          "Expected an array of enrolled Courses but received:",
          data.results
        );
      }
    } catch (error) {
      console.error("Error fetching Courses:", error);
    }
  };

  useEffect(() => {
    const savedCourses = localStorage.getItem("cart");
    if (savedCourses) {
      setCourses(JSON.parse(savedCourses));
    }
    fetchData();
  }, []);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (checkForConflicts()) {
      setConflictMessage(
        "There are time/date conflicts between the selected and enrolled courses."
      );
      return;
    }

    const studentId = localStorage.getItem("studentID");
    if (!studentId) {
      console.error("User ID not found in localStorage");
      return;
    }

    const courseIds = courses.map((course) => course.id);

    try {
      for (const courseId of courseIds) {
        const checkEnrollSize = `/api/select?table=enrollment&columns=count(*) as count&condition=courseID=${courseId}`;
        const enrollSizeResponse = await fetch(checkEnrollSize);

        if (!enrollSizeResponse.ok) {
          throw new Error("Error occurred in the network response while checking enrollment size");
        }

        const enrollSizeResult = await enrollSizeResponse.json();
        const enrollSize = enrollSizeResult.results[0].count;

        if (enrollSize >= 5) { // constraint size 3
          console.log(`Course ID ${courseId} has reached maximum enrollment size of 5`);
          return;
        }
      }
      for (const courseId of courseIds) {
        const apiUrl = `/api/insertInto?table=enrollment&category=studentID&category=courseID&value=${studentId}&value=${courseId}`;
        const response = await fetch(apiUrl, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
        });

        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(
            `Error occurred in the network response: ${errorText}`
          );
        }

        const result = await response.json();
        console.log(`Course ID ${courseId} inserted:`, result);
      }
      localStorage.removeItem("cart");
      router.push("/");
      setTimeout(() => {
        window.location.reload();
      }, 100);
      console.log("All course IDs submitted successfully!");
    } catch (error) {
      console.error("Error occurred during insertions:", error);
    }
  };

  const checkForConflicts = () => {
    console.log("Checking for conflicts...");

    for (const enrolledCourse of enrolledCourses) {
      for (const selectedCourse of courses) {
        const enrolledDays = enrolledCourse.days
          ? enrolledCourse.days.split(",").map((day) => day.trim())
          : [];
        const selectedDays = selectedCourse.days
          ? selectedCourse.days.split(",").map((day) => day.trim())
          : [];

        const overlappingDays = enrolledDays.some((day) =>
          selectedDays.includes(day)
        );

        const overlappingTimes =
          (selectedCourse.startTime >= enrolledCourse.startTime &&
            selectedCourse.startTime < enrolledCourse.endTime) ||
          (selectedCourse.endTime > enrolledCourse.startTime &&
            selectedCourse.endTime <= enrolledCourse.endTime) ||
          (selectedCourse.startTime <= enrolledCourse.startTime &&
            selectedCourse.endTime >= enrolledCourse.endTime);

        if (overlappingDays && overlappingTimes) {
          console.log("Conflict detected!");
          return true;
        }
      }
    }
    console.log("No conflicts found.");
    return false;
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
          <div className="mt-8 flex flex-col justify-end pb-6">
            {conflictMessage && (
              <div className="text-red-600 mb-4">{conflictMessage}</div>
            )}
            <form onSubmit={handleSubmit}>
              <button
                type="submit"
                className="px-6 py-3 bg-[#2D9DB6] text-white rounded-md hover:bg-[#1SAAAAA] focus:outline-none focus:ring-2 focus:ring-blue-400"
              >
                <strong>Submit</strong>
              </button>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default Cart;
