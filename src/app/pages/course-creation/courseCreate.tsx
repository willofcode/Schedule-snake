import React, { useState, useEffect } from "react";
import { Newsreader } from "next/font/google";
import { useRouter } from "next/navigation";
const newsreader = Newsreader({ subsets: ["latin"] });

interface Course {
  courseID: number;
  courseName: string;
  courseDesc: string;
  courseDays: string[]; // needed to be an array of strings!
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
      setCourseDays(course.days || []); // Ensure course.days is an array
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

  const formatTime = (time: string): string => {
    const [hours, minutes] = time.split(":");
    const formattedTime = hours.padStart(2, '0') + minutes.padStart(2, '0');
    return formattedTime;
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    const formattedStartTime = formatTime(courseStartTime);
    const formattedEndTime = formatTime(courseEndTime);
    const courseData = {
      courseName,
      courseID,
      courseDescription,
      courseStartTime: formattedStartTime,
      courseEndTime: formattedEndTime,
      courseDays,
    };

    try {
      var profID = localStorage.getItem("profID");
      var modification = localStorage.getItem("modify");

      console.log("modification type: ", modification);

      if (modification === "edit") {
        setIsEditing(true);
        console.log(formattedStartTime, formattedEndTime);
        const updateCourse = `/api/update?table=course&condition=courseID=${courseID}&column=courseName&column=courseDesc&column=startTime&column=endTime&value=${courseName}&value=${courseDescription}&value=${formattedStartTime}&value=${formattedEndTime}`;
        const deleteCourseDays = `/api/delete?table=course_days&condition=courseID=${courseID}`
        const delResponse = await fetch(deleteCourseDays, {
          method: "DELETE"
        });
        if (!delResponse.ok) { console.error(`Error deleting the course days (course days reset)`); return null;}
        const dayIDs: number[] = [];
        const length = courseDays.length;
        for (let i= 0; i < length; i++) {
          const currDay = courseDays[i];
          const getDays = `/api/select?table=days&columns=dayID&condition=dayName='${currDay}';`
          const response = await fetch(getDays);
          if (!response.ok) { console.error(`Failed fetching dayID`); return null;}
          const data = await response.json();
          dayIDs.push(data.results[0].dayID);
        }
        for (let i = 0; i<dayIDs.length; i++) {
          const currID = dayIDs[i];
          const insertIDs = `/api/insertInto?table=course_days&ignore=true&category=courseID&category=dayID&value=${courseID}&value=${currID}`;
          const response = await fetch(insertIDs, {
            method: "POST"
          });
          if (!response.ok) { console.error(`Failed INSERTING dayIDs`); return null;}
          const data = await response.json();
          console.log(data)
        }
        const courseUpdate = await fetch(updateCourse, {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(courseData),
        });
        if (!courseUpdate.ok) {
          throw new Error("Could not update course");
        }
        console.log("Course updated successfu lly:", await courseUpdate.json());
      } else { // ELSE STATEMENT HERE
        setIsEditing(false);
        console.log(courseData.courseDays);
        const dayIDs: number[] = [];
        const length = courseDays.length;
        for (let i= 0; i < length; i++) {
          const currDay = courseDays[i];
          const getDays = `/api/select?table=days&columns=dayID&condition=dayName='${currDay}';`
          const response = await fetch(getDays);
          if (!response.ok) { console.error(`Failed fetching dayID`); return null;}
          const data = await response.json();
          dayIDs.push(data.results[0].dayID);
        }
        // ^ RETRIEVE DAY IDS
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
        const createResponse = await courseCreate.json();
        const newCourseID = createResponse.courseID;
        console.log(newCourseID);
        // ^ CREATING A COURSE
        for (let i = 0; i<dayIDs.length; i++) {
          const currID = dayIDs[i];
          const insertIDs = `/api/insertInto?table=course_days&ignore=true&category=courseID&category=dayID&value=${newCourseID}&value=${currID}`;
          const response = await fetch(insertIDs, {
            method: "POST"
          });
          if (!response.ok) { console.error(`Failed INSERTING dayIDs`); return null;}
          const data = await response.json();
          console.log(data)
        }
        router.push("/pages/my-course");
      }
    } catch (error) {
      console.error("Error creating course:", error);
    }
  };

  const handleFetchCourses = async () => {
    try {
      var profID = localStorage.getItem("profID");
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
        courseDays: course.dayNames.split(',')
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
    setCourseStartTime(course.startTime);
    setCourseEndTime(course.endTime);
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
                <li key={course.courseID} className="mb-2">
                  <span className="font-bold">{course.courseName}</span> (
                  {course.courseID})
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
