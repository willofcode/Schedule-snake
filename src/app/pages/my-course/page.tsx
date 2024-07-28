"use client";
import React from "react";
import { Newsreader } from "next/font/google";
import CourseItem from "./courses";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { IoIosAddCircle } from "react-icons/io";

const newsreader = Newsreader({ subsets: ["latin"] });

interface Course {
  id: number;
  title: string;
  desc: string;
  days: string;
  startTime: string;
  endTime: string;
  enrollmentSize: number;
}

const myCourse = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [showDeletePanel, setShowDeletePanel] = useState(false);
  const [selectedCourseId, setSelectedCourseId] = useState<number | null>(null);
  const router = useRouter();

  useEffect(() => {
    const getCourses = async () => {
      try {
        const user = localStorage.getItem("profID");
        const userType = localStorage.getItem("userType");

        console.log("user", user);
        console.log("userType", userType);

        const getCall = `/api/select?table=course&columns=courseID,courseName,courseDesc,startTime,endTime&condition=profID=${user}`;

        const response = await fetch(getCall, {
          method: "GET",
        });
        if (!response.ok) {
          throw new Error("Could not retrieve courses");
        }
        const data = await response.json();
        const fetchedCourses = data.results;

        const coursesWithEnrollmentSize = await Promise.all(
            fetchedCourses.map(async (course: any) => {
              const enrollmentCall = `/api/select?table=enrollment&columns=count(*) as count&condition=courseID=${course.courseID}`;
              const enrollmentResponse = await fetch(enrollmentCall, {
                method: "GET",
              });
              if (!enrollmentResponse.ok) {
                throw new Error("Could not retrieve enrollment size");
              }
              const enrollmentData = await enrollmentResponse.json();
              const enrollmentSize = enrollmentData.results[0].count;

              return {
                id: course.courseID,
                title: course.courseName,
                desc: course.courseDesc,
                days: course.dayNames,
                startTime: course.startTime,
                endTime: course.endTime,
                enrollmentSize: enrollmentSize,
              };
            })
        );

        setCourses(coursesWithEnrollmentSize);
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
    localStorage.setItem("modify", "edit");
    router.push("/pages/course-creation");
  };

  const handleDeleteCourse = (id: number) => {
    setSelectedCourseId(id);
    setShowDeletePanel(true);
  };

  const confirmDeleteCourse = async () => {
    if (selectedCourseId) {
      try {
        const apiUrl = `/api/delete?table=course&column=courseID&value=${selectedCourseId}`;
        const response = await fetch(apiUrl, {
          method: "DELETE",
        });
        if (!response.ok) {
          throw new Error("Could not delete course");
        }
        const data = await response.json();
        console.log("Course deleted", data);
        const newCourses = courses.filter(
            (course) => course.id !== selectedCourseId,
        );
        setCourses(newCourses);
      } catch (error) {
        console.log("Error deleting course", error);
      }
    }
    setSelectedCourseId(null);
    setShowDeletePanel(false);
  };

  const cancelDeleteCourse = () => {
    setSelectedCourseId(null);
    setShowDeletePanel(false);
  };

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
                    <CourseItem
                        course={course}
                        onDelete={handleDeleteCourse}
                        onEdit={modCourse}
                    />
                  </div>
              ))}
            </div>
            <div className="flex m-5">
              <button
                  onClick={() => {
                    router.push("/pages/course-creation");
                    localStorage.setItem("modify", "add");
                  }}
                  className="p-2 bg-green-500 text-white rounded-full hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-400"
              >
                <IoIosAddCircle />
              </button>
              <p className="text-lg text-black ml-2">Add New Course</p>
            </div>
            {showDeletePanel && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
                  <div className="bg-white p-4 rounded-md">
                    <p>
                      Are you sure you want to delete this course? (WARNING:
                      Deleting a course will remove all course details and
                      enrollments)
                    </p>
                    <div className="flex justify-center mt-4">
                      <button
                          onClick={confirmDeleteCourse}
                          className="justify-center px-4 py-2 mr-2 bg-gray-500 text-white rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                      >
                        Yes
                      </button>
                      <button
                          onClick={cancelDeleteCourse}
                          className="justify-center px-4 py-2 mr-2 bg-gray-500 text-white rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                      >
                        No
                      </button>
                    </div>
                  </div>
                </div>
            )}
          </div>
        </div>
      </>
  );
};

export default myCourse;
