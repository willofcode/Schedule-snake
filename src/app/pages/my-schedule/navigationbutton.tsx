
import React from "react";
import { NextPage } from "next";

interface NavigationButtonsProps {
    handlePreviousWeek: () => void;
    handleNextWeek: () => void;
}

const NavigationButtons: NextPage<NavigationButtonsProps> = ({ handlePreviousWeek, handleNextWeek }) => {
    return (
        <div className="flex justify-between items-center mt-20 max-w-screen-lg mx-auto">
            <button onClick={handlePreviousWeek} className="mt-4 flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-500 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                Prev Week
            </button>
            <h1 className="text-4xl my-5 text-black font-light">My Schedule</h1>
            <button onClick={handleNextWeek} className="mt-4 flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-500 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                Next Week
            </button>
        </div>
    );
};

export default NavigationButtons;
