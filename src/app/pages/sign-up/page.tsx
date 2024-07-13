'use client';
import {FormEvent, useState} from 'react';
// future adjustments
// give feature to click "sign up as a professor" with a required code for signing up as a professor
// this would then swap the sign up form, also adding a code for input field.
interface FormData {
    studentID: string;
    studentEmail: string;
    password: string;
}
export default function SignUp() {
    const [formData, setFormData] = useState<FormData>({
        studentID: '',
        studentEmail: '',
        password: ''
    });

    const handleChange = (e) => {
         const { name, value } = e.target;
         setFormData({
             ...formData,
             [name]: value
         });
    };

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const apiCall = `/api/insertInto?table=student&category=id&category=email&category=password&value='${formData.studentID}'&value='${formData.studentEmail}'&value='${formData.password}'`
        try {
            const response = await fetch(apiCall, {
                method: 'POST'
            });
            if (!response.ok) {
                throw new Error('Error occurred in the network response');
            }
            const result = await response.json();
            console.log("Form submitted", result);
        } catch (error) {
            console.error("Could not complete insert into query", error);
        }
    };

    return (
        <main className="flex min-h-screen flex-col items-center justify-center p-24 bg-white">
            <form className="flex flex-col space-y-4 border border-gray-300 px-[24px] py-[24px] rounded-lg"
            onSubmit={handleSubmit}>
                <div>
                    <label className="block text-sm font-medium text-gray-700">
                        Student ID
                    </label>
                    <input type="text" id="studentID" name="studentID"
                           className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" placeholder="Value"
                           value={formData.studentID} onChange={handleChange} required
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">
                        Student Email
                    </label>
                    <input type="text" id="studentEmail" name="studentEmail"
                           className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" placeholder="Value"
                           value={formData.studentEmail} onChange={handleChange} required/>
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">
                        Password
                    </label>
                    <input type="password" id="password" name="password"
                           className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" placeholder="Value"
                           value={formData.password} onChange={handleChange} required/>
                </div>
                <button
                type="submit"
                className="mt-4 w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-black hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                    Sign Up
                </button>
            </form>
        </main>
    );
}
