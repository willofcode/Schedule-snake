import React from "react";
import { FaTrashAlt } from "react-icons/fa";
import { BiEdit } from "react-icons/bi";

const CourseItem = ({ course, onAdd, onEdit, onDelete }: any) => {
  const { id, title, description, daysOfWeek, startTime, endTime } = course;

  const handleAdd = () => {
    onAdd(id);
  };

  const handleEdit = () => {
    onEdit(id, title, description, daysOfWeek, startTime, endTime);
  };

  const handleDelete = () => {
    onDelete(id);
  };

  const formatTime = (time: number) => {
    const hours = Math.floor(time / 100);
    const minutes = time % 100;
    const period = hours < 12 ? "AM" : "PM";
    const formattedHours = hours % 12 || 12;
    const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes;
    return `${formattedHours}:${formattedMinutes} ${period}`;
  };

  return (
    <div className="p-4 border-b border-gray-200 flex justify-between mt-10">
      <div className="w-1/2 pr-4">
        <h2 className="text-xl text-[#2D9DB6] font-semibold">{title}</h2>
        <p className="text-gray-700">{description}</p>
      </div>
      <div className="flex items-center">
        <div className="flex flex-col items-end">
          <p className="text-gray-900 font-bold">{daysOfWeek}</p>
          <p className="text-gray-900 font-bold">
            {formatTime(startTime)} to {formatTime(endTime)}
          </p>
        </div>
        <button
            onClick={handleDelete}
            className="ml-4 p-2 bg-red-500 text-white rounded-full hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-400"
        > 
            <FaTrashAlt />
        </button>
        <button
          onClick={handleEdit}
          className="ml-4 p-2 bg-blue-500 text-white rounded-full hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-400"
        >
            <BiEdit />
        </button>
      </div>
    </div>
  );
};

export default CourseItem;
