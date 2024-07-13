'use client';
import React, { useEffect, useState, useContext, createContext } from "react";
import { DayPilot, DayPilotCalendar } from "@daypilot/daypilot-lite-react";

// Create a UserContext to manage user roles
const UserContext = createContext({ userRole: "professor" });

export default function Calendar() {
    const styles = {
        wrap: {
            display: "flex"
        },
        left: {
            marginRight: "10px"
        },
        main: {
            flexGrow: "1"
        },
        contextMenu: {
            backgroundColor: "#ffffff",
            color: "#000000",
            border: "1px solid #ccc",
            font: "16px 'Segoe UI', Arial, sans-serif",
            borderRadius: "4px",
            padding: "10px"
        },
        contextMenuItem: {
            padding: "10px",
            cursor: "pointer",
        },
        contextMenuItemHover: {
            backgroundColor: "#f0f0f0"
        },
        modal: {
            color: "#000000"
        }
    };

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

    const students = [
        { name: "1", id: 1 },
        { name: "2", id: 2 },
        { name: "3", id: 3 },
        { name: "4", id: 4 },
        { name: "5", id: 5 },
        { name: "6", id: 6 },
        { name: "7", id: 7 },
        { name: "8", id: 8 },
        { name: "9", id: 9 },
        { name: "10", id: 10 },
    ];

    const [calendar, setCalendar] = useState<DayPilot.Calendar>();
    const [startDate, setStartDate] = useState(DayPilot.Date.today().firstDayOfWeek());
    const { userRole } = useContext(UserContext);

    const editEvent = async (e: DayPilot.Event) => {
        if (userRole !== "professor") return;
        const form = [
            { name: "Class", id: "text", type: "text" },
            { name: "Event color", id: "backColor", type: "select", options: colors },
            { name: "Number of Students", id: "tags.students", type: "select", options: students },
        ];

        const modal = await DayPilot.Modal.form(form, e.data);
        if (modal.canceled) { return; }
        e.data.text = modal.result.text;
        e.data.backColor = modal.result.backColor;
        e.data.tags.participants = modal.result.tags.participants;
        calendar?.events.update(e);
    };

    const contextMenu = new DayPilot.Menu({
        items: userRole === "professor" ? [
            {
                text: "Delete",
                onClick: async args => {
                    calendar?.events.remove(args.source);
                },
            },
            {
                text: "-"
            },
            {
                text: "Edit",
                onClick: async args => {
                    await editEvent(args.source);
                }
            }
        ] : [
            {
                text: "View Details",
                onClick: async args => {
                    // Enroll logic here
                }
            },
            {
                text: "Drop",
                onClick: async args => {
                    // Drop logic here
                }
            }
        ]
    });

    const onBeforeEventRender = (args: DayPilot.CalendarBeforeEventRenderArgs) => {
        args.data.areas = [
            {
                top: 5,
                right: 5,
                width: 20,
                height: 20,
                symbol: "icons/daypilot.svg#minichevron-down-2",
                fontColor: "#fff",
                backColor: "#00000033",
                style: "border-radius: 25%; cursor: pointer;",
                toolTip: "Show context menu",
                action: "ContextMenu",
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
        businessEndsHour: 19,
        startDate: DayPilot.Date.today().firstDayOfWeek()
    };

    const [config, setConfig] = useState(initialConfig);

    useEffect(() => {
        if (!calendar || calendar?.disposed()) {
            return;
        }
        const events: DayPilot.EventData[] = [
            {
                id: 1,
                text: "Event 1",
                start: startDate.addDays(2).addHours(10).toString(),
                end: startDate.addDays(2).addHours(13).toString(),
                tags: {
                    participants: 2,
                }
            },
            {
                id: 2,
                text: "Event 2",
                start: startDate.addDays(3).addHours(9).toString(),
                end: startDate.addDays(3).addHours(11).toString(),
                backColor: "#6aa84f",
                tags: {
                    students: 1,
                }
            },
            {
                id: 3,
                text: "Event 3",
                start: startDate.addDays(3).addHours(12).toString(),
                end: startDate.addDays(3).addHours(15).toString(),
                backColor: "#f1c232",
                tags: {
                    students: 3,
                }
            },
            {
                id: 4,
                text: "Event 4",
                start: startDate.addDays(1).addHours(11).toString(),
                end: startDate.addDays(1).addHours(14).toString(),
                backColor: "#cc4125",
                tags: {
                    students: 2,
                }
            },
        ];

        calendar.update({ startDate, events });
    }, [calendar, startDate]);

    const onTimeRangeSelected = async (args: DayPilot.CalendarTimeRangeSelectedArgs) => {
        if (userRole !== "professor") return;
        const modal = await DayPilot.Modal.prompt("Create a new event:", "Event 1");
        calendar?.clearSelection();
        if (modal.canceled) {
            return;
        }
        calendar?.events.add({
            start: args.start,
            end: args.end,
            id: DayPilot.guid(),
            text: modal.result,
            tags: {
                students: 1,
            }
        });
    };

    const handlePreviousWeek = () => {
        setStartDate(startDate.addDays(-7));
    };

    const handleNextWeek = () => {
        setStartDate(startDate.addDays(7));
    };

    return (
        <UserContext.Provider value={{ userRole: "professor" }}> {/* Change userRole to "student" to test student view */}
            <div>
                <div className="flex justify-between items-center mt-20 max-w-screen-lg mx-auto">
                    <button onClick={handlePreviousWeek} className="px-4 py-2 bg-blue-500 text-white rounded">Prev Week</button>
                    <h1 className="text-2xl my-5 text-white font-light">Schedule Builder</h1>
                    <button onClick={handleNextWeek} className="px-4 py-2 bg-blue-500 text-white rounded">Next Week</button>
                </div>
                <div className="relative justify-center items-center flex-col mx-auto mb-20 w-full max-w-screen-lg">
                    <DayPilotCalendar
                        {...config}
                        onTimeRangeSelected={onTimeRangeSelected}
                        onEventClick={async args => { if (userRole === "professor") await editEvent(args.e); }}
                        contextMenu={contextMenu}
                        onBeforeEventRender={onBeforeEventRender}
                        controlRef={setCalendar}
                    />
                </div>
            </div>
        </UserContext.Provider>
    );
}