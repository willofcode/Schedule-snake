import React, { useEffect, useState } from "react";
import { DayPilot, DayPilotCalendar } from "@daypilot/daypilot-lite-react";
import { NextPage } from "next";

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

interface EventDataWithContextMenu extends DayPilot.EventData {
  ContextMenu: DayPilot.Menu;
}

interface CalendarProps {
  startDate: DayPilot.Date;
}

const Calendar: NextPage<CalendarProps> = ({ startDate }) => {
  const [calendar, setCalendar] = useState<DayPilot.Calendar>();

  const onBeforeEventRender = (
    args: DayPilot.CalendarBeforeEventRenderArgs
  ) => {
    args.data.areas = [
      {
        right: 5,
        bottom: 5,
        width: 20,
        height: 20,
        fontColor: "#fff",
        backColor: "#00000033",
        style: "border-radius: 25%; cursor: pointer;",
        action: "ContextMenu",
        visibility: "Hover",
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
        style:
          "border-radius: 50%; border: 2px solid #fff; font-size: 18px; text-align: center;",
      });
    }

    const ContextMenu = new DayPilot.Menu({
      items: [
        {
          text: "Details",
          onClick: (args) => {
            const e = args.source;
            DayPilot.Modal.prompt("Description: " + e.data.courseDesc);
          },
        },
      ],
    });

    (args.data as EventDataWithContextMenu).ContextMenu = ContextMenu;
  };

  const initialConfig: DayPilot.CalendarConfig = {
    viewType: "Week",
    durationBarVisible: false,
    businessBeginsHour: 7,
    businessEndsHour: 20,
    startDate: DayPilot.Date.today().firstDayOfWeek(),
    eventMoveHandling: "Disabled",
    eventResizeHandling: "Disabled",
    eventClickHandling: "Enabled",
  };

  const [config, setConfig] = useState(initialConfig);

  useEffect(() => {
    if (!calendar || calendar?.disposed()) {
      return;
    }

    const formatTime = (time: number) => {
      const hours = Math.floor(time / 100);
      const minutes = time % 100;
      return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(
        2,
        "0"
      )}:00`;
    };

    const formatedTime = (time: number) => {
      const hours = Math.floor(time / 100);
      const minutes = time % 100;
      const period = hours < 12 ? "AM" : "PM";
      const formattedHours = hours % 12 || 12;
      const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes;
      return `${formattedHours}:${formattedMinutes} ${period}`;
    };

    const updateTime = (dateTimeStr: string, newTime: number) => {
      const [datePart] = dateTimeStr.split("T");
      const formattedTime = formatTime(newTime);
      return `${datePart}T${formattedTime}`;
    };

    const daysOfWeek = [
      "Sunday",
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
    ];

    const getDatebydayName = (startDate: DayPilot.Date, dayName: string) => {
      const dayIndex = daysOfWeek.indexOf(dayName);
      const startDayIndex = startDate.getDayOfWeek();
      const diff = dayIndex - startDayIndex;
      return startDate.addDays(diff).toString();
    };

    const fetchData = async () => {
      try {
        var user = localStorage.getItem("userID");
        var userType = localStorage.getItem("userType");
        console.log("user", user);
        console.log("userType", userType);

        const studentSchedule = `/api/select?table=course&columns=course.courseID,course.courseName,course.startTime,course.endTime,GROUP_CONCAT(days.dayName)%20AS%20dayNames,professor.fullname,course.courseDesc&inner_join=course_days&on_inner=course.courseID=course_days.courseID&inner_join=days&on_inner=course_days.dayID=days.dayID&inner_join=professor&on_inner=course.profID=professor.profID&inner_join=enrollment&on_inner=course.courseID=enrollment.courseID&inner_join=student&on_inner=enrollment.studentID=student.studentID&inner_join=users&on_inner=student.userID=users.userID&condition=users.userType=userType%20AND%20users.userID=${user}&group_by=course.courseID&order_by=course.startTime`;

        const profSchedule = `/api/select?table=course&columns=course.courseID,course.courseName,course.courseDesc,course.startTime,course.endTime,GROUP_CONCAT(days.dayName) AS dayNames&inner_join=course_days&on_inner=course.courseID=course_days.courseID&inner_join=days&on_inner=course_days.dayID=days.dayID&condition=profID=${user}&group_by=course.courseID&order_by=course.startTime`;

        const response = await fetch(
          userType === "student" ? studentSchedule : profSchedule,
          {
            method: "GET",
          }
        );

        if (!response.ok) {
          throw new Error("Could not retrieve Courses");
        }

        const data = await response.json();
        if (data.results && Array.isArray(data.results)) {
          const fetchEvents = data.results.flatMap((event: any) => {
            const dayNames = event.dayNames.split(",");
            return dayNames.map((dayName: any) => {
              const eventStart = getDatebydayName(startDate, dayName);
              const eventEnd = getDatebydayName(startDate, dayName);
              return {
                id: event.courseID,
                text:
                  event.courseName +
                  "\n" +
                  formatedTime(event.startTime) +
                  " - " +
                  formatedTime(event.endTime),
                start: updateTime(eventStart, event.startTime),
                end: updateTime(eventEnd, event.endTime),
                backColor: event.backcolor,
                courseDesc: event.courseDesc,
                barColor: colors[Math.floor(Math.random() * colors.length)].id,
                tags: {
                  students: 0,
                },
              };
            });
          });
          calendar.update({ startDate, events: fetchEvents });
        } else {
          console.error(
            "Expected an array of enrolled Courses but received:",
            data.results
          );
        }
      } catch (error) {
        console.error("Error fetching Courses:", error);
      }
    };
    fetchData();
  }, [calendar, startDate]);

  return (
    <DayPilotCalendar
      {...config}
      onBeforeEventRender={onBeforeEventRender}
      controlRef={setCalendar}
    />
  );
};

export default Calendar;
//       SELECT
//         course.courseID,
//         course.courseName,
//         course.startTime,
//         course.endTime,
//         days.dayName,
//         professor.fullname,
//         course.courseDesc
//       FROM course
//       INNER JOIN course_days ON course.courseID = course_days.courseID
//       INNER JOIN days ON course_days.dayID = days.dayID
//       INNER JOIN professor ON course.profID = professor.profID
//       INNER JOIN enrollment ON course.courseID = enrollment.courseID
//       INNER JOIN student ON enrollment.studentID = student.studentID
//       INNER JOIN users ON student.userID = users.userID
//       WHERE users.userType='student' AND users.userID=1
//       GROUP BY course.courseID
//       ORDER BY course.startTime;
