import React, { useEffect, useState } from "react";
import { DayPilot, DayPilotCalendar } from '@daypilot/daypilot-lite-react';
import signIn from "../sign-in/page";

export default function Calendar() {
  const [calendar, setCalendar] = useState<DayPilot.Calendar>();
  const [startDate, setStartDate] = useState(DayPilot.Date.today().firstDayOfWeek());


  const colors = [
    { name: "Green", id: "#6aa84f" },
    { name: "Blue", id: "#3d85c6" },
    { name: "Turquoise", id: "#00aba9" },
    { name: "Light Blue", id: "#56c5ff" },
    { name: "Yellow", id: "#f1c232" },
    { name: "Orange", id: "#e69138" },
    { name: "Red", id: "#cc4125" },
    { name: "Light Red", id: "#ff0000" },
    { name: "Purple", id: "#af8ee5" },
  ];

  const handlePreviousWeek = () => {
    setStartDate(startDate.addDays(-7));
  };

  const handleNextWeek = () => {
    setStartDate(startDate.addDays(7));
  };

  const onBeforeEventRender = (args: DayPilot.CalendarBeforeEventRenderArgs) => {
    args.data.areas = [
      {
        top: 5,
        right: 5,
        width: 20,
        height: 20,
        fontColor: "#fff",
        backColor: "#00000033",
        style: "border-radius: 25%; cursor: pointer;",
      },
    ];

    const students = args.data.tags?.students || 0;
    if (students > 0) {
      args.data.areas.push({
        bottom: 5,
        left: 5,
        width: 24,
        height: 24,
        action: "None",
        backColor: "#00000033",
        fontColor: "#b0b0b0",
        text: students,
        style: "border-radius: 50%; border: 2px solid #fff; font-size: 18px; text-align: center;",
      });
    }
  };

  const initialConfig: DayPilot.CalendarConfig = {
    viewType: "Week",
    durationBarVisible: false,
    businessBeginsHour: 7,
    businessEndsHour: 20,
    startDate: DayPilot.Date.today().firstDayOfWeek(),
    eventMoveHandling: "Disabled",
    eventResizeHandling: "Disabled",
  };
  //console.log(" the start date is ", startDate);
  const [config, setConfig] = useState(initialConfig);

  useEffect(() => {
    if (!calendar || calendar?.disposed()) {
      return;
    }

    const formatTime = (time: number) => {
      const hours = Math.floor(time / 100);
      const minutes = time % 100;
      return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:00`;
    };
  
    const updateTime = (dateTimeStr: string, newTime: number) => {
      const [datePart] = dateTimeStr.split('T');
      const formattedTime = formatTime(newTime); 
      return `${datePart}T${formattedTime}`
    };

    const daysOfWeek = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

    const getDateForDayName = (startDate: DayPilot.Date, dayName: string) => {
      console.log("start date is ", startDate);
      const dayIndex = daysOfWeek.indexOf(dayName);
      const startDayIndex = startDate.getDayOfWeek();
      const diff = dayIndex - startDayIndex;
      return startDate.addDays(diff).toString();
    };
    // const user = localStorage.getItem("userID");
    // console.log("user is ", user);

    const fetchData = async () => {
      try {
        const apiCall = `/api/select?table=course&columns=course.courseID,course.courseName,course.startTime,course.endTime,GROUP_CONCAT(days.dayName) AS dayNames,professor.fullname,course.courseDesc&inner_join=course_days&on_inner=course.courseID=course_days.courseID&inner_join=days&on_inner=course_days.dayID=days.dayID&inner_join=professor&on_inner=course.profID=professor.profID&inner_join=enrollment&on_inner=course.courseID=enrollment.courseID&inner_join=student&on_inner=enrollment.studentID=student.studentID&inner_join=users&on_inner=student.userID=users.userID&condition=users.userType='student' AND users.userID=1&group_by=course.courseID&order_by=course.startTime`;
        const response = await fetch(apiCall, {
          method: "GET",
        });
  
        if (!response.ok) {
          throw new Error("Could not retrieve events");
        }
  
        const data = await response.json();
        console.log("Fetched data:", data); 
        if (data.results && Array.isArray(data.results)) {
          const fetchEvents: DayPilot.EventData[] = data.results.map((event: any) => {
            const dayNames = event.dayNames.split(','); // Split dayNames into an array
            const eventStart = getDateForDayName(startDate, dayNames[0]); // Get the date for the first day name
            const eventEnd = getDateForDayName(startDate, dayNames[0]); // Assuming the end date is the same as the start date
            console.log("day names are ", dayNames);
            console.log("event start is ", eventStart);
            console.log("event end is ", eventEnd);
            return {
                    id: event.courseID,
                    text: event.courseName,
                    start: updateTime(eventStart, event.startTime),
                    end: updateTime(eventEnd, event.endTime),
                    backColor: event.backColor,
            }
          });
          // console.log("start time is ", fetchEvents[0].start);
          // console.log("end time is ", fetchEvents[0].end);
          calendar.update({ startDate, events: fetchEvents });
        } else {
          console.error("Expected an array but received:", data.results);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
  
    fetchData();
  }, [calendar, startDate]);
  

  const onTimeRangeSelected = async (args: DayPilot.CalendarTimeRangeSelectedArgs) => {
    const modal = await DayPilot.Modal.prompt("Add new event:", "");
    calendar?.clearSelection();
    if (modal.canceled) return;
    calendar?.events.add({
      start: args.start,
      end: args.end,
      id: DayPilot.guid(),
      text: modal.result,
    });
  };

  return (
    <div>
      <div className="flex justify-between items-center mt-20 max-w-screen-lg mx-auto">
        <button onClick={handlePreviousWeek} className="px-4 py-2 bg-blue-500 text-white rounded">
          Prev Week
        </button>
        <h1 className="text-2xl my-5 text-black font-light">Schedule Builder</h1>
        <button onClick={handleNextWeek} className="px-4 py-2 bg-blue-500 text-white rounded">
          Next Week
        </button>
      </div>
      <div className="relative justify-center items-center flex-col mx-auto mb-20 w-full max-w-screen-lg">
        <DayPilotCalendar
          {...config}
          onTimeRangeSelected={onTimeRangeSelected}
          onBeforeEventRender={onBeforeEventRender}
          controlRef={setCalendar}
        />
      </div>
    </div>
  );
}
