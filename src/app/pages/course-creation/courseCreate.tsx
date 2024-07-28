import React, { useState, useEffect } from "react";
import { Newsreader } from "next/font/google";
import { useRouter } from "next/navigation";
const newsreader = Newsreader({ subsets: ["latin"] });

interface Course {
  courseID: number;
  courseName: string;
  courseDesc: string;
  courseDays: string;
  startTime: string;
  endTime: string;
}

const CourseCreation = () => {
  const router = useRouter();
  const [courseName, setCourseName] = useState("");
  const [courseID, setCourseID] = useState("");
  const [courseDescription, setCourseDescription] = useState("");
  const [courseStartTime, setCourseStartTime] = useState("");
  const [courseEndTime, setCourseEndTime] = useState("");
  const [courseDays, setCourseDays] = useState<string[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [isEditing, setIsEditing] = useState(Boolean);

  useEffect(() => {
    const modification = localStorage.getItem("modify");
    const selectedCourse = localStorage.getItem("selectedCourse");

    if (modification === "edit" && selectedCourse) {
      const course = JSON.parse(selectedCourse);
      setCourseName(course.courseName);
      setCourseID(course.courseID);
      setCourseDescription(course.courseDesc);
      setCourseStartTime(course.startTime);
      setCourseEndTime(course.endTime);
      setCourseDays(course.days);
      setIsEditing(true);
    } else {
      setIsEditing(false);
    }
  }, []);

  const handleCheckboxChange = (day: string) => {
    if (courseDays.includes(day)) {
      setCourseDays(courseDays.filter((d) => d !== day));
    } else {
      setCourseDays([...courseDays, day]);
    }
  };

  const formatTime = (time: string) => {
    const [hours, minutes] = time.split(":");
    const formattedTime = hours + minutes;
    return formattedTime;
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    const courseData = {
      courseName,
      courseID,
      courseDescription,
      courseStartTime: formatTime(courseStartTime),
      courseEndTime: formatTime(courseEndTime),
      courseDays,
    };

    try {
      var profID = localStorage.getItem("profID"); // Get the user ID from local storage
      var modification = localStorage.getItem("modify"); // Get the course modification from local storage

      console.log("modification type: ", modification);

      if (modification === "edit") {
        setIsEditing(true);
        const updateCourse = `/api/update?table=course&condition=courseID=${courseID}&column=courseName&column=courseDesc&column=startTime&column=endTime&value=${courseName}&value=${courseDescription}&value=${courseStartTime}&value=${courseEndTime}`; // Update the course in the course table
        const courseUpdate = await fetch(updateCourse, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(courseData),
        });
        if (!courseUpdate.ok) {
          throw new Error("Could not update course");
        }
        console.log("Course updated successfully:", await courseUpdate.json());
      } else {
        setIsEditing(false);
        console.log(courseData.courseName);
        console.log(courseData.courseDescription);
        console.log(courseData.courseStartTime);
        console.log(courseData.courseEndTime);
        const createCourse = `/api/insertInto?table=course&category=profID&category=courseName&category=courseDesc&category=startTime&category=endTime&value=${profID}&value='${courseData.courseName}'&value='${courseData.courseDescription}'&value=${courseData.courseStartTime}&value=${courseData.courseEndTime}`;
        const courseCreate = await fetch(createCourse, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(courseData),
        });
        if (!courseCreate.ok) {
          throw new Error("Could not create course");
        }
        console.log("Course created successfully:", await courseCreate.json());
        router.push("/pages/my-course");
      }
    } catch (error) {
      console.error("Error creating course:", error);
    }
  };

  const handleFetchCourses = async () => {
    try {
      var profID = localStorage.getItem("profID"); // Get the user ID from local storage
      const profCourse = `/api/select?table=course&columns=course.courseID,course.courseName,course.courseDesc,course.startTime,course.endTime,GROUP_CONCAT(days.dayName) AS dayNames&inner_join=course_days&on_inner=course.courseID=course_days.courseID&inner_join=days&on_inner=course_days.dayID=days.dayID&condition=profID=${profID}&group_by=course.courseID&order_by=course.startTime`;
      const courseFetch = await fetch(profCourse, {
        method: "GET",
      });
      if (!courseFetch.ok) {
        throw new Error("Could not retrieve courses");
      }
      const data = await courseFetch.json();
      const course: Course[] = data.results.map((course: any) => ({
        courseID: course.courseID,
        courseName: course.courseName,
        courseDesc: course.courseDesc,
        startTime: course.startTime,
        endTime: course.endTime,
      }));
      setCourses(course);
    } catch (error) {
      console.error("Error fetching courses:", error);
    }
  };

  const handleModify = (course: any) => {
    setCourseName(course.courseName);
    setCourseID(course.courseID);
    setCourseDescription(course.courseDescription);
    setCourseStartTime(course.courseStartTime);
    setCourseEndTime(course.courseEndTime);
    setCourseDays(course.courseDays);
    setIsEditing(true);
  };

  useEffect(() => {
    handleFetchCourses();
  }, []);

  return (
    <div className="relative justify-center items-center flex-col mx-auto my-20 w-1/2 max-w-screen-md">
      <h2 className="text-2xl font-bold mb-4">
        {isEditing ? "Modify Course" : "Create a New Course"}
      </h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label
            className="block text-gray-700 text-sm font-bold mb-2"
            htmlFor="courseName"
          >
            Course Name
          </label>
          <input
            type="text"
            id="courseName"
            value={courseName}
            onChange={(e) => setCourseName(e.target.value)}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            required
          />
        </div>
        <div className="mb-4">
          <label
            className="block text-gray-700 text-sm font-bold mb-2"
            htmlFor="courseDescription"
          >
            Course Description
          </label>
          <textarea
            id="courseDescription"
            value={courseDescription}
            onChange={(e) => setCourseDescription(e.target.value)}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            required
          />
        </div>
        <div className="mb-4">
          <label
            className="block text-gray-700 text-sm font-bold mb-2"
            htmlFor="courseStartTime"
          >
            Course Start Time
          </label>
          <input
            type="time"
            id="courseStartTime"
            value={courseStartTime}
            onChange={(e) => setCourseStartTime(e.target.value)}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline step=1"
            required
          />
        </div>
        <div className="mb-4">
          <label
            className="block text-gray-700 text-sm font-bold mb-2"
            htmlFor="courseEndTime"
          >
            Course End Time
          </label>
          <input
            type="time"
            id="courseEndTime"
            value={courseEndTime}
            onChange={(e) => setCourseEndTime(e.target.value)}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline step=1"
            required
          />
        </div>
        <div className="mb-4">
          <label
            className="block text-gray-700 text-sm font-bold mb-2"
            htmlFor="courseDays"
          >
            Course Days
          </label>
          <div className="flex flex-wrap">
            {[
              "Monday",
              "Tuesday",
              "Wednesday",
              "Thursday",
              "Friday",
              "Saturday",
              "Sunday",
            ].map((day) => (
              <label key={day} className="mr-4">
                <input
                  type="checkbox"
                  value={day}
                  checked={courseDays.includes(day)}
                  onChange={() => handleCheckboxChange(day)}
                  className="mr-2 leading-tight"
                />
                {day}
              </label>
            ))}
          </div>
        </div>
        <div className="mb-4">
          <button
            type="submit"
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          >
            {isEditing ? "Update Course" : "Create Course"}
          </button>
        </div>
      </form>
      <div className="mt-10">
        <h2 className="text-xl font-bold mb-4">Existing Courses</h2>
        <ul>
          {courses.map((course) => (
            <li key={course.courseID as number} className="mb-2">
              <span className="font-bold">{course.courseName as string}</span> (
              {course.courseID as number})
              <button
                onClick={() => handleModify(course)}
                className="ml-4 bg-blue-500 hover:bg-yellow-700 text-white font-bold py-1 px-2 rounded focus:outline-none focus:shadow-outline"
              >
                Modify
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default CourseCreation;
