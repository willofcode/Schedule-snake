
import React, { useState, useEffect } from 'react';
import { Newsreader } from 'next/font/google';

const newsreader = Newsreader({ subsets: ['latin'] });

interface Course {
  courseID: number;
  courseName: string;
  courseDesc: string;
  courseDays: string;
  startTime: string;
  endTime: string;
}

const CourseCreation = () => {
  const [courseName, setCourseName] = useState('');
  const [courseID, setCourseID] = useState('');
  const [courseDescription, setCourseDescription] = useState('');
  const [courseStartTime, setCourseStartTime] = useState('');
  const [courseEndTime, setCourseEndTime] = useState('');
  const [courseDays, setCourseDays] = useState<number[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    const modification = localStorage.getItem('modify');
    const selectedCourse = localStorage.getItem('selectedCourse');

    if (modification === 'edit' && selectedCourse) {
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

  const daytoindex = (day: string) => {
    switch (day) {
      case 'Monday':
        return 1;
      case 'Tuesday':
        return 2;
      case 'Wednesday':
        return 3;
      case 'Thursday':
        return 4;
      case 'Friday':
        return 5;
      case 'Saturday':
        return 6;
      case 'Sunday':
        return 7;
      default:
        return -1;
    }
  };

  const handleCheckboxChange = (day: string) => {
    if (courseDays.includes(daytoindex(day))) {
      (setCourseDays(courseDays.filter((selectedDay) => selectedDay !== daytoindex(day))))
    } else {
      if (courseDays.length < 2) {
        setCourseDays([...courseDays, daytoindex(day)]);
      } else {
        alert('You can only select up to 2 days');
      }
    }
  };
  console.log("course days :", courseDays)

  const formatTime = (time: string) => {
    const [hours, minutes] = time.split(':');
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
      courseDays: daytoindex(courseDays.join(',')),
    };

    try {
      var user = localStorage.getItem('userID'); // Get the user ID from local storage
      var modification = localStorage.getItem('modify'); // Get the course modification from local storage

      console.log('modification type: ', modification);

      if (modification === 'edit') {
        setIsEditing(true);
        const updateCourse = `/api/update?table=course&condition=courseID=${courseID}&column=courseName&column=courseDesc&column=startTime&column=endTime&value=${courseName}&value=${courseDescription}&value=${courseStartTime}&value=${courseEndTime}`; // Update the course in the course table
        const courseUpdate = await fetch(updateCourse, { 
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(courseData),
        });
        const updatedays = `/api/update?table=course_days&condition=courseID=${courseID}&column=dayID&value=${courseDays}`; // Update the days in the course_days table
        const daysUpdate = await fetch(updatedays, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(courseData),
        });
        if (!courseUpdate.ok) {
          throw new Error('Could not update course');
        }
        if (!daysUpdate.ok) {
          throw new Error('Could not update days');
        }
        console.log('Course updated successfully:', await courseUpdate.json());
        console.log('Days updated successfully:', await daysUpdate.json());
      } else {
        setIsEditing(false);
        const createCourse = `/api/insertInto?table=course&category=courseID&category=profID&category=courseName&category=courseDesc&category=startTime&category=endTime&value=${courseData.courseID}&value=${user}&value=${courseData.courseName}&value=${courseData.courseDescription}&value=${courseData.courseStartTime}&value=${courseData.courseEndTime}`; // Insert the course into the course table
        const courseCreate = await fetch(createCourse, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(courseData),
        });
        const createDaysUrl = `/api/insertInto?table=course_days&category=courseID&category=dayID&value=${courseData.courseID}&value=${courseData.courseDays}`;
        const daysCreate = await fetch(createDaysUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(courseData),
        }); 
        if (!courseCreate.ok) {
          throw new Error('Could not create course');
        }
        if (!daysCreate.ok) {
          throw new Error('Could not create days');
        }
        console.log('Course created successfully:', await courseCreate.json());
      }
    } catch (error) {
      console.error('Error creating course:', error);
    }
  };

  const handleFetchCourses = async () => {
    try {
      var user = localStorage.getItem('userID'); // Get the user ID from local storage
      const profCourse = `/api/select?table=course&columns=course.courseID,course.courseName,course.courseDesc,course.startTime,course.endTime,GROUP_CONCAT(days.dayName) AS dayNames&inner_join=course_days&on_inner=course.courseID=course_days.courseID&inner_join=days&on_inner=course_days.dayID=days.dayID&condition=profID=${user}&group_by=course.courseID&order_by=course.startTime`; // Fetch the courses for the professor from the course table // localStorage.getItem('userID') attempts to fetches the ID for the current user
      const courseFetch = await fetch(profCourse, {
        method: 'GET',
      });
      if (!courseFetch.ok) {
        throw new Error('Could not retrieve courses');
      }
      const data = await courseFetch.json();
      const course: Course[] = data.results.map((course: any) => ({
        courseID: course.courseID,
        courseName: course.courseName,
        courseDesc: course.courseDesc,
        startTime: course.startTime,
        endTime: course.endTime,
        courseDays: course.dayNames.split(','),
      }));
      setCourses(course);
      console.log('Courses fetched successfully:', course);
    } catch (error) {
      console.error('Error fetching courses:', error);
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

  const handleCourseNameChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedCourseName = e.target.value;
    setCourseName(selectedCourseName);

    const selectedCourse = courses.find(course => course.courseName === selectedCourseName);
    if (selectedCourse) {
      setCourseID(selectedCourse.courseID.toString());
      setCourseDescription(selectedCourse.courseDesc);
    }
  };

  return (
    <div className="relative justify-center items-center flex-col mx-auto my-20 w-1/2 max-w-screen-md">
      <h2 className="text-2xl font-bold mb-4">{isEditing ? 'Modify Course' : 'Create a New Course'}</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="courseName">
            Course Name
          </label>
          {isEditing ? (
            <select
              id="courseName"
              value={courseName}
              onChange={handleCourseNameChange}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              required
            >
              <option value="">Select a course</option>
              {courses.map((course: { courseID: number; courseName: string }) => (
                <option key={course.courseID} value={course.courseName}>
                  {course.courseName}
                </option>
              ))}
            </select>
          ) : (
            <input
              type="text"
              id="courseName"
              value={courseName}
              onChange={(e) => setCourseName(e.target.value)}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              required
            />
          )}
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="courseID">
            Course ID
          </label>
          {isEditing ? (
            <input
              type="text"
              id="courseID"
              value={courseID}
              onChange={(e) => setCourseID(courseID)}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              required
              readOnly
            />
          ) : (
            // jay said for new course courseID auto increment
            <input
              type="text"
              id="courseID"
              value={courseID}
              onChange={(e) => setCourseID(e.target.value)}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              required
            />
          )}
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="courseDescription">
            Course Description
          </label>{isEditing ? (
            <textarea
              id="courseDescription"
              value={courseDescription}
              onChange={(e) => setCourseDescription(courseDescription)}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              required
            />
          ) : (
            <textarea
              id="courseDescription"
              value={courseDescription}
              onChange={(e) => setCourseDescription(e.target.value)}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              required
            />
          )}
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="courseStartTime">
            Course Start Time
          </label>
          <input
            type="time"
            id="courseStartTime"
            value={courseStartTime}
            onChange={(e) => setCourseStartTime(e.target.value)}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="courseEndTime">
            Course End Time
          </label>
          <input
            type="time"
            id="courseEndTime"
            value={courseEndTime}
            onChange={(e) => setCourseEndTime(e.target.value)}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">
            Course Days
          </label>
          <div className="flex flex-wrap">
            {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].map((day) => (
              <label key={daytoindex(day)} className="mr-4">
                <input
                  type="checkbox"
                  value={day}
                  checked={courseDays.includes(daytoindex(day))}
                  onChange={() => handleCheckboxChange(day)}
                />
                {day}
              </label>
            ))}
          </div>
        </div>
        <div className="flex items-center justify-between">
          <button
            type="submit"
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          >
            {isEditing ? 'Update Course' : 'Create Course'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CourseCreation;
