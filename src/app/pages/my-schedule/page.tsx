'use client';

import React, { useState } from "react";
import Calendar from "./calendar";
import NavigationButtons from "./navigationbutton";
import { DayPilot } from "@daypilot/daypilot-lite-react";
import { NextPage } from "next";

const MySchedule: NextPage= () => {
  const [startDate, setStartDate] = useState(DayPilot.Date.today().firstDayOfWeek());

  const handlePreviousWeek = () => {
    setStartDate(startDate.addDays(-7));
  };

  const handleNextWeek = () => {
    setStartDate(startDate.addDays(7));
  };

  return (
    <div>
      <NavigationButtons handlePreviousWeek={handlePreviousWeek} handleNextWeek={handleNextWeek} />
      <div className="relative justify-center items-center flex-col mx-auto mb-20 w-full max-w-screen-lg">
        <Calendar startDate={startDate} />
      </div>
    </div>
  );
};

export default MySchedule;
