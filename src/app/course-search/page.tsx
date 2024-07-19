'use client';

import { useSearchParams, useRouter } from 'next/navigation';
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import { useState } from 'react';

const Search = () => {
    const router = useRouter();
    const searchParams = useSearchParams();
    
    const [courseName, setCourseName] = useState(searchParams?.get('courseName') || '');
    const [daysOfWeek, setDaysOfWeek] = useState(searchParams?.get('daysOfWeek') || '');
    const [startTime, setStartTime] = useState(searchParams?.get('startTime') || '');
    const [endTime, setEndTime] = useState(searchParams?.get('endTime') || '');
    const [isFull, setIsFull] = useState(searchParams?.get('isFull') || '');

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const query = new URLSearchParams({
            courseName,
            daysOfWeek,
            startTime,
            endTime,
            isFull
        }).toString();
        router.push(`/search?${query}`);
    };

    return (
        <div className = "relative justify-center items-center flex-col mx-auto my-20 w-1/2 max-w-screen-md">
        <div className="p-4">
            <form onSubmit={handleSubmit} className="flex flex-col space-y-4">
                <div>
                    <label className="block mb-1">Course Name</label>
                    <input 
                        type="text"
                        value={courseName}
                        onChange={(e) => setCourseName(e.target.value)}
                        placeholder="Course Name"
                        className="border p-2 w-full text-gray-950"
                    />
                </div>
                <div>
                    <label className="block mb-1">Days of the Week</label>
                    <input
                        type="text"
                        value={daysOfWeek}
                        onChange={(e) => setDaysOfWeek(e.target.value)}
                        placeholder="e.g., Monday, Wednesday"
                        className="border p-2 w-full  text-gray-950"
                    />
                </div>
                <div>
                    <label className="block mb-1">Start Time</label>
                    <input
                        type="time"
                        value={startTime}
                        onChange={(e) => setStartTime(e.target.value)}
                        className="border p-2 w-full  text-gray-950"
                    />
                </div>
                <div>
                    <label className="block mb-1">End Time</label>
                    <input
                        type="time"
                        value={endTime}
                        onChange={(e) => setEndTime(e.target.value)}
                        className="border p-2 w-full  text-gray-950"
                    />
                </div>
                <div>
                    <label className="block mb-1">Class Availability</label>
                    <select
                        value={isFull}
                        onChange={(e) => setIsFull(e.target.value)}
                        className="border p-2 w-full text-gray-950"
                    >
                        <option value="">Any</option>
                        <option value="true">Full</option>
                        <option value="false">Open</option>
                    </select>
                </div>
                <button type="submit" className="px-4 py-2 bg-blue-500 text-white rounded flex items-center space-x-2">
                    <MagnifyingGlassIcon className="w-5 h-5" />
                    <span>Search</span>
                </button>
            </form>
        </div>
        </div>
    );
};

export default Search;
