"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

interface User {
  firstName: string;
  lastName: string;
  studentID: number;
  courses: string[];
}

export default function Settings() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const studentID = localStorage.getItem("studentID");
  const router = useRouter();

  useEffect(() => {
    const userId = localStorage.getItem("userID");

    if (!userId) {
      setError("User ID not found in local storage");
      setLoading(false);
      return;
    }

    console.log("Fetched userId from local storage:", userId); // Debug log
    const fetchUserData = async () => {
      try {
        const response = await fetch(
          `/api/select?table=course&columns=course.courseID,course.courseName,course.startTime,course.endTime,GROUP_CONCAT(days.dayName)%20AS%20dayNames,professor.fullname,course.courseDesc&inner_join=course_days&on_inner=course.courseID=course_days.courseID&inner_join=days&on_inner=course_days.dayID=days.dayID&inner_join=professor&on_inner=course.profID=professor.profID&inner_join=enrollment&on_inner=course.courseID=enrollment.courseID&inner_join=student&on_inner=enrollment.studentID=student.studentID&inner_join=users&on_inner=student.userID=users.userID&condition=users.userType=userType%20AND%20users.userID=${userId}&group_by=course.courseID&order_by=course.startTime`
        );
        if (!response.ok) {
          throw new Error("Failed to fetch user data");
        }
        const data = await response.json();
        console.log("Fetched user data:", data); // Debug log

        const firstName = localStorage.getItem("firstName") || "Unknown";
        const lastName = localStorage.getItem("lastName") || "Unknown";

        const userData: User = {
          firstName,
          lastName,
          studentID: parseInt(studentID || "0", 10),
          courses: data.results.map((course: any) => course.courseName),
        };
        setUser(userData);
      } catch (error) {
        setError((error as Error).message);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  const getCourseID = async (courseName: string): Promise<number> => {
    try {
      const response = await fetch(
        `/api/select?table=course&columns=courseID&condition=courseName='${courseName}'`
      );
      if (!response.ok) {
        throw new Error("Failed to fetch course ID");
      }
      const data = await response.json();
      const courseID = data.results[0].courseID;
      console.log(courseID);
      return courseID;
    } catch (error) {
      console.error("Error fetching course ID:", error);
      throw error;
    }
  };

  const handleDelete = async (courseName: string) => {
    try {
      const courseID = await getCourseID(courseName);
      const deleteCourse = `/api/delete?table=enrollment&condition=courseID=${courseID} AND studentID=${studentID}`;
      const response = await fetch(deleteCourse, {
        method: "DELETE",
      });
      if (!response.ok) {
        console.log(`Trouble deleting course`);
      }
      console.log(response);
      router.push("/");
    } catch (error) {
      console.error("Error in handleDelete:", error);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!user) {
    return <div>No user data found</div>;
  }

  return (
    <main style={{ padding: "20px", marginTop: "60px" }}>
      <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
        <p>First Name: {user.firstName}</p>
        <p>Last Name: {user.lastName}</p>
        <p>Student ID: {studentID}</p>
        <h2>Enrolled Courses:</h2>
        {user.courses && user.courses.length > 0 ? (
          <ul className="list-disc pl-5">
            {user.courses.map((course, index) => (
              <li
                key={index}
                className="mb-2 flex items-center justify-between"
              >
                {course}
                <button
                  className="ml-4 bg-red-500 text-white px-2 py-1 rounded"
                  onClick={() => handleDelete(course)}
                >
                  Unenroll
                </button>
              </li>
            ))}
          </ul>
        ) : (
          <p>No courses enrolled currently</p>
        )}
      </div>
    </main>
  );
}
