'use client';
import React, { useEffect, useState } from "react";
import { DayPilot, DayPilotCalendar } from "@daypilot/daypilot-lite-react";
import { start } from "repl";

const StudentCalendar = () => {
  const [calendar, setCalendar] = useState<DayPilot.Calendar>();
  const [startDate, setStartDate] = useState(DayPilot.Date.today().firstDayOfWeek());
  const [events, setEvents] = useState<DayPilot.EventData[]>([]);

  const fetchData = async () => {
    try {
      const response = await fetch(`/api/select?table=course&columns=course.courseID,course.courseName,course.startTime,course.endTime,days.dayName,professor.fullname,course.courseDesc&join=course_days&on=course.courseID=course_days.courseID&join=days&on=course_days.dayID=days.dayID&inner_join=professor&on_inner=course.profID=professor.profID&inner_join=enrollment&on_inner=course.courseID=enrollment.courseID&inner_join=student&on_inner=enrollment.studentID=student.studentID&left_join=users&on_left=student.userID=users.userID&condition=users.userType='student'&and=users.userID=1&group_by=course.courseID&order_by=course.startTime`);
      const data = await response.json();
      setEvents(data.results.map(({ courseID, courseName, startTime, endTime, dayName }: { courseID: number, courseName: string, startTime: string, endTime: string, dayName: string}) => ({
        id: courseID,
        text: courseName,
        start: `${dayName}T${startTime}`,
        startTime: startTime, 
        endTime: endTime,    
        backColor: "#f0f0f0", // Assuming a default color for all events
      })));
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  useEffect(() => {
    fetchData();
  }, [startDate]);

  useEffect(() => {
    if (calendar) {
      calendar.update({ startDate, events });
    }
  }, [calendar, startDate, events]);

  const handlePreviousWeek = () => {
    setStartDate(startDate.addDays(-7));
  };

  const handleNextWeek = () => {
    setStartDate(startDate.addDays(7));
  };

  const initialConfig: DayPilot.CalendarConfig = {
    viewType: "Week",
    durationBarVisible: false,
    businessBeginsHour: 7,
    businessEndsHour: 20,
    startDate: DayPilot.Date.today().firstDayOfWeek(),
    eventMoveHandling: "Disabled",
    eventResizeHandling: "Disabled",
    days: 7,
  };

  return (
    <div>
      <div className="flex justify-between items-center mt-20 max-w-screen-lg mx-auto">
        <button onClick={handlePreviousWeek} className="px-4 py-2 bg-blue-500 text-white rounded">
          Prev Week
        </button>
        <h1 className="text-2xl my-5 text-black font-light">Student Schedule</h1>
        <button onClick={handleNextWeek} className="px-4 py-2 bg-blue-500 text-white rounded">
          Next Week
        </button>
      </div>
      <div className="relative justify-center items-center flex-col mx-auto mb-20 w-full max-w-screen-lg">
        <DayPilotCalendar
          {...initialConfig}
          events={events}
          onEventClick={(args) => {
            // Optionally handle event click for student
          }}
          controlRef={setCalendar}
        />
      </div>
    </div>
  );
};

export default StudentCalendar;