'use client';

import react from "react";
import { Newsreader } from "next/font/google";
import Calendar from "./calendar";
import { useState, useEffect } from "react";  

export default function mySchedule() {
  return (
      <div>
        <Calendar/>
      </div>
  )
}