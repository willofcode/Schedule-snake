"use client";

import { useState, useEffect } from "react";

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

  useEffect(() => {
    const userId = localStorage.getItem("userID"); // Retrieve the user ID from local storage

    if (!userId) {
      setError("User ID not found in local storage");
      setLoading(false);
      return;
    }

    console.log("Fetched userId from local storage:", userId); // Debug log
    const fetchUserData = async () => {
      try {
        const response = await fetch(`/api/select?table=enrollment&columns=enrollment.courseID,course.profID,course.courseName&inner_join=course&on_inner=enrollment.courseID=course.courseID&condition=studentID=${studentID}`);
        if (!response.ok) {
          throw new Error("Failed to fetch user data");
        }
        const data = await response.json();
        console.log("Fetched user data:", data); // Debug log

        // Assuming we have the user's first name, last name, and student ID from another API or local storage
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
              <ul style={{ listStyleType: "none", padding: 0 }}>
                {user.courses.map((course, index) => (
                    <li key={index} style={{ marginBottom: "10px" }}>{course}</li>
                ))}
              </ul>
          ) : (
              <p>No courses enrolled currently</p>
          )}
        </div>
      </main>
  );
}
