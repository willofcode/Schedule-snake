import React, { useState, useEffect } from 'react';
import { Newsreader } from 'next/font/google';
import { useRouter } from 'next/navigation';
const newsreader = Newsreader({ subsets: ['latin'] });

interface Course {
  courseID: number;
  courseName: string;
  courseDesc: string;
  courseDays: string[];
  startTime: string;
  endTime: string;
}

const CourseModification = () => {
  const router = useRouter();
  const [courseName, setCourseName] = useState('');
  const [courseID, setCourseID] = useState('');
  const [courseDescription, setCourseDescription] = useState('');
  const [courseStartTime, setCourseStartTime] = useState('');
  const [courseEndTime, setCourseEndTime] = useState('');
  const [courseDays, setCourseDays] = useState<string[]>([]);
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
      setCourseDays(Array.isArray(course.courseDays) ? course.courseDays : []); // Ensure it's always an array
      setIsEditing(true);
    } else {
      setIsEditing(false);
    }
  }, []);

  const daytoindex = (day: string) => {
    switch (day) {
      case 'Monday':
      case '1':
        return 1;
      case 'Tuesday':
      case '2':
        return 2;
      case 'Wednesday':
      case '3':
        return 3;
      case 'Thursday':
      case '4':
        return 4;
      case 'Friday':
      case '5':
        return 5;
      case 'Saturday':
      case '6':
        return 6;
      case 'Sunday':
      case '7':
        return 7;
      default:
        return -1;
    }
  };

  const handleCheckboxChange = (day: string) => {
    const dayIndex = daytoindex(day).toString();
    if (courseDays.includes(dayIndex)) {
      setCourseDays(courseDays.filter((selectedDay) => selectedDay !== dayIndex));
    } else {
      if (courseDays.length < 2) {
        setCourseDays([...courseDays, dayIndex]);
      } else {
        alert('You can only select up to 2 days');
      }
    }
  };

  console.log("days selected: ", courseDays);

  const formatTime = (time: string) => {
    const [hours, minutes] = time.split(':');
    const formattedTime = hours + minutes;
    return formattedTime;
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    const courseData = {
      courseName,
      courseDescription,
      courseStartTime: formatTime(courseStartTime),
      courseEndTime: formatTime(courseEndTime),
      courseDays: courseDays.map(day => parseInt(day)),
    };

    try {
      var profID = localStorage.getItem('profID'); // Get the user ID from local storage
      var modification = localStorage.getItem('modify'); // Get the course modification from local storage

      if (modification === 'edit') {
        setIsEditing(true);
        const updateCourse = `/api/update?table=course&column=courseName&value=${courseName}&column=courseDesc&value=${courseDescription}&column=startTime&value=${formatTime(courseStartTime)}&column=endTime&value=${formatTime(courseEndTime)}&condition=courseID='${courseID}'`; // Update the course in the course table
        const courseUpdate = await fetch(updateCourse, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(courseData),
        });
        const prevDay1 = courseData.courseDays[0];
        const prevDay2 = courseData.courseDays[1];
        const day1 = courseDays[0];
        const day2 = courseDays[1];
        const updatedays = `/api/update?table=course_days&column=dayID&value=${day1}&column=dayID&value=${day2}&condition=courseID='${courseID}' AND dayID='${prevDay1}' AND dayID='${prevDay2}'`; // Update the days in the course_days table
        const daysUpdate = await fetch(updatedays, {
          method: 'PATCH',
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
        //router.push("/pages/my-course");
      } else {
        setIsEditing(false);
        // console.log(courseData.courseName);
        // console.log(courseData.courseDescription);
        // console.log(courseData.courseStartTime);
        // console.log(courseData.courseEndTime);
        // console.log(courseData.courseDays);
        const createCourse = `/api/insertInto?table=course&category=profID&category=courseName&category=courseDesc&category=startTime&category=endTime&value=${profID}&value='${courseData.courseName}'&value='${courseData.courseDescription}'&value=${courseData.courseStartTime}&value=${courseData.courseEndTime}`;
        const courseCreate = await fetch(createCourse, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(courseData),
        });
        const fetchCourseID = `/api/select?table=course&columns=courseID&condition=courseName="${courseData.courseName}" AND profID=${profID}`;
        const courseIDFetch = await fetch(fetchCourseID, {
          method: 'GET',
        });
        const courseIDData = await courseIDFetch.json();
        const courseID = courseIDData.results[0].courseID;
        const courseDays1 = courseData.courseDays[0];
        const courseDays2 = courseData.courseDays[1];
        console.log('Course ID retrieved:', courseID);
        console.log('Day ID insert:', courseDays1);
        console.log('Day ID insert:', courseDays2);
        const insertDay1 = `/api/insertInto?table=course_days&category=courseID&category=dayID&value=${courseID}&value=${courseDays1}`;
        const daysCreate1 = await fetch(insertDay1, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(courseData),
        }); 
        const insertDay2 = `/api/insertInto?table=course_days&category=courseID&category=dayID&value=${courseID}&value=${courseDays2}`;
        const daysCreate2 = await fetch(insertDay2, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(courseData),
        });
        if (!courseCreate.ok) {
          throw new Error('Could not create course');
        }
        if (!daysCreate1.ok) {
          throw new Error('Could not create days');
        }
        if (!daysCreate2.ok) {
          throw new Error('Could not create days');
        }
        console.log('Course created successfully:', await courseCreate.json());
        console.log('Insert Day1')
      }
    } catch (error) {
      console.error('Error creating course:', error);
      router.push("/pages/my-course");
    }
  };

  const handleFetchCourses = async () => {
    try {
      var profID = localStorage.getItem("profID"); // Get the user ID from local storage
      const profCourse = `/api/select?table=course&columns=course.courseID,course.courseName,course.courseDesc,course.startTime,course.endTime,GROUP_CONCAT(days.dayName) AS dayNames, GROUP_CONCAT(days.dayID) AS dayID&inner_join=course_days&on_inner=course.courseID=course_days.courseID&inner_join=days&on_inner=course_days.dayID=days.dayID&condition=profID=${profID}&group_by=course.courseID&order_by=course.startTime`;
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
        courseDays: course.dayNames.split(',').map((day: string) => daytoindex(day)), // Convert day names to day IDs 
        dayID: course.dayID,
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
    setCourseDescription(course.courseDesc);
    setCourseStartTime(course.courseStartTime);
    setCourseEndTime(course.courseEndTime);
    setCourseDays(course.courseDays);
    setIsEditing(true);
  };

  useEffect(() => {
    handleFetchCourses();
  }, []);

  const handleCourseNameSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
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
              onChange={handleCourseNameSelect}
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
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="courseDescription">
            Course Description
          </label>
          <textarea
            id="courseDescription"
            value={courseDescription}
            onChange={(e) => setCourseDescription(e.target.value)}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            required
          ></textarea>
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="courseStartTime">
            Start Time
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
            End Time
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
          <div className="flex">
            {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].map((day) => (
              <label key={daytoindex(day)} className="inline-flex items-center mr-4">
                <input
                  type="checkbox"
                  //className="form-checkbox"
                  value = {day}
                  checked={courseDays.includes(daytoindex(day).toString())}
                  onChange={() => handleCheckboxChange(day)}
                />
                <span className="ml-2">{day}</span>
              </label>
            ))}
          </div>
        </div>
        <div className="flex items-center justify-between">
          <button
            type="submit"
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          >
            {isEditing ? 'Save Changes' : 'Create Course'}
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

export default CourseModification;
