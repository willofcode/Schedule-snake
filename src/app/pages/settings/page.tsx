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

  useEffect(() => {
    const userId = localStorage.getItem("userID"); // Replace this with actual logic to retrieve the user ID

    const fetchUserData = async () => {
      try {
        const response = await fetch(
          `/api/select?table=users&userId=${userId}`,
        );
        if (!response.ok) {
          throw new Error("Failed to fetch user data");
        }
        const data = await response.json();
        setUser(data);
      } catch (error) {
        setError(error.message);
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
    <main>
      <div>
        <h1>Settings</h1>
        <p>First Name: {user.firstName}</p>
        <p>Last Name: {user.lastName}</p>
        <p>Student ID: {user.studentID}</p>
        <h2>Enrolled Courses:</h2>
        {user.courses && user.courses.length > 0 ? (
          <ul>
            {user.courses.map((course, index) => (
              <li key={index}>{course}</li>
            ))}
          </ul>
        ) : (
          <p>No courses enrolled</p>
        )}
      </div>
    </main>
  );
}
