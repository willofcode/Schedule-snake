import React, { useEffect, useState } from "react";
import { DayPilot, DayPilotCalendar } from "@daypilot/daypilot-lite-react";

export default async function Calendar() {
  const [calendar, setCalendar] = useState<DayPilot.Calendar>();
  const [Date, setDate] = useState(DayPilot.Date.today().firstDayOfWeek());

  const contextUser = localStorage.getItem("userType");
  console.log("User Type:", contextUser);
      try {
          const schedule = `/api/select?table=course&columns=course.courseID,course.courseName,course.startTime,course.endTime,day.dayName,professor.fullname,course.courseDesc&inner_join=course_days&on_inner=course.courseID=course_days.courseID&inner_join=days&on_inner=course_days.dayID=days.dayID&inner_join=professor&on_inner=course.profID=professor.profID&inner_join=enrollment&on_inner=course.courseID=enrollment.courseID&inner_join=student&on_inner=enrollment.studentID=student.studentID&inner_join=users&on_inner=student.userID=users.userID& condition=users.userType='student'users.userID=1&group_by=course.courseID&order_by=course.startTime`;
          const response = fetch(schedule, {
            method: "GET",
            headers: { "Content-Type": "application/json" },
          });

          if (!(await response).ok) {
            throw new Error("Error occurred in the network response");
          }

          const result = await (await response).json();
          console.log(`Course schedule inserted:`, result);
        } catch (error) {
          console.error("Error occurred during insertions:", error);
        }

        console.log("All course IDs submitted successfully!");

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
    setDate(prevDate => prevDate.addDays(-7));
  };
  const handleNextWeek = () => {
    setDate(prevDate => prevDate.addDays(7));
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

  const [config, setConfig] = useState(initialConfig);

  useEffect(() => {
    if (!calendar || calendar?.disposed()) {
      return;
    }
    const fetchData = async () => {
      const response = await fetch(`/api/select?table=course&columns=course.courseID,course.courseName,course.startTime,course.endTime,day.dayName,professor.fullname,course.courseDesc&inner_join=course_days&on_inner=course.courseID=course_days.courseID&inner_join=days&on_inner=course_days.dayID=days.dayID&inner_join=professor&on_inner=course.profID=professor.profID&inner_join=enrollment&on_inner=course.courseID=enrollment.courseID&inner_join=student&on_inner=enrollment.studentID=student.studentID&inner_join=users&on_inner=student.userID=users.userID& condition=users.userType='student' AND users.userID=1&group_by=course.courseID&order_by=course.startTime`);
      const data = await response.json();
      const events = data.map((event: any) => ({
        id: event.courseID,
        text: event.text,
        start: new DayPilot.Date(event.start),
        end: new DayPilot.Date(event.end),
        backColor: event.backColor,
        tags: { students: event.students },
      }));
      calendar.update({ events });
    };
    fetchData();
  }, [calendar,setDate]);

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
        //   onEventClick={async (args) => {
        //     if (user.userRole === "professor") await editEvent(args.e);
        //   }}
        //   contextMenu={contextMenu}
          onBeforeEventRender={onBeforeEventRender}
          controlRef={setCalendar}
        />
      </div>
    </div>
}
