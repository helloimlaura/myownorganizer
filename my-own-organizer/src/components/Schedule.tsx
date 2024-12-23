import React, { useState } from "react";
import { addDays, format, startOfWeek, isSameDay } from "date-fns";
import {
  processCalendarImage,
  CalendarEvent,
} from "../utils/calendarImageProcessor.ts";

interface TimeSlot {
  day: Date;
  hour: number;
}

interface CalendarEventType {
  title: string;
  start: Date;
  end: Date;
  calendar: string;
  isCanceled?: boolean;
}

interface NewEventType {
  title: string;
  calendar: string;
  start: string; // Keep as string for form inputs
  end: string; // Keep as string for form inputs
}

const Schedule = () => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [events, setEvents] = useState([
    {
      id: 1,
      title: "Doctor Appointment",
      start: new Date(2024, 11, 23, 14, 30), // Dec 23, 2024 at 2:30 PM
      end: new Date(2024, 11, 23, 15, 30),
      calendar: "personal",
    },
    {
      id: 2,
      title: "Dance Class",
      start: new Date(2024, 11, 24, 16, 0), // Dec 24, 2024 at 4:00 PM
      end: new Date(2024, 11, 24, 17, 0),
      calendar: "daughter",
    },
  ]);

  const [currentDate] = useState(new Date());
  const [showEventForm, setShowEventForm] = useState(false);
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<TimeSlot | null>(null);
  const [newEvent, setNewEvent] = useState<NewEventType>({
    title: "",
    calendar: "personal",
    start: "",
    end: "",
  });

  const weekStart = startOfWeek(currentDate);
  const weekDays = Array.from({ length: 7 }, (_, i) => addDays(weekStart, i));
  const timeSlots = Array.from({ length: 15 }, (_, i) => i + 7);

  const getCalendarColor = (calendar) => {
    switch (calendar) {
      case "personal":
        return "bg-blue-200";
      case "daughter":
        return "bg-pink-200";
      default:
        return "bg-gray-200";
    }
  };

  const todayEvents = events.filter((event) => isSameDay(event.start, currentDate));

  const handleTimeSlotClick = (day, hour) => {
    const selectedDate = format(day, "yyyy-MM-dd");
    const startTime = `${hour.toString().padStart(2, "0")}:00`;
    const endTime = `${(hour + 1).toString().padStart(2, "0")}:00`;

    const startDate = new Date(day);
    startDate.setHours(hour, 0, 0, 0);

    const endDate = new Date(startDate);
    endDate.setHours(hour + 1, 0, 0, 0);

    setSelectedTimeSlot({ day, hour });
    setNewEvent({
      title: "",
      calendar: "personal",
      start: startTime,
      end: endTime,
    });
    setShowEventForm(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const startDate = new Date(newEvent.start);
    const endDate = new Date(newEvent.end);

    const newEventObj: CalendarEvent = {
      id: events.length + 1,
      title: newEvent.title,
      calendar: newEvent.calendar,
      start: startDate,
      end: endDate,
    };

    setEvents([...events, newEventObj]);
    setShowEventForm(false);
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsProcessing(true);
    try {
      const newEvents = await processCalendarImage(file);
      setEvents((prevEvents) => [...prevEvents, ...newEvents]);
    } catch (error) {
      console.error("Error processing calendar image:", error);
      // You might want to show an error message to the user here
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="flex gap-4 h-full">
      {/* Week View */}
      <div className="w-3/4 bg-white rounded-lg shadow-lg p-4">
        <div className="mb-6">
          <h2 className="text-2xl font-bold">This Week</h2>
        </div>

        <div className="overflow-x-auto">
          <div className="min-w-[800px]">
            {/* Week Header */}
            <div className="grid grid-cols-8 gap-1">
              <div className="w-20" />
              {weekDays.map((day) => (
                <div
                  key={day.toString()}
                  className={`text-center p-2 font-semibold ${
                    isSameDay(day, currentDate) ? "bg-blue-100 rounded" : ""
                  }`}
                >
                  {format(day, "EEE M/d")}
                </div>
              ))}
            </div>

            {/* Time Grid */}
            <div className="relative">
              {timeSlots.map((hour) => (
                <div key={hour} className="grid grid-cols-8 gap-1">
                  <div className="w-20 text-right pr-2 py-2 text-sm">
                    {format(new Date().setHours(hour, 0), "h:mm a")}
                  </div>
                  {weekDays.map((day) => (
                    <div
                      key={`${day}-${hour}`}
                      className="h-12 border border-gray-200 cursor-pointer bg-white hover:bg-blue-50 relative z-10"
                      onClick={() => {
                        console.log("Clicked time slot:", { day, hour });
                        alert(`Clicked: ${format(day, "MMM d")} at ${hour}:00`);
                        handleTimeSlotClick(day, hour);
                      }}
                    />
                  ))}
                </div>
              ))}

              {/* Events layer - now with pointer-events-none */}
              <div className="absolute top-0 left-0 right-0 bottom-0 pointer-events-none">
                {events.map((event) => {
                  const dayIndex = event.start.getDay() + 1;
                  const startHour = event.start.getHours() - 7;
                  const duration =
                    (event.end.getTime() - event.start.getTime()) / (1000 * 60 * 60);
                  const top = startHour * 48;
                  const height = duration * 48;

                  return (
                    <div
                      key={event.id}
                      className={`absolute rounded p-1 text-sm ${getCalendarColor(
                        event.calendar
                      )} pointer-events-auto`}
                      style={{
                        top: `${top}px`,
                        height: `${height}px`,
                        left: `${dayIndex * 12.5}%`,
                        width: "11%",
                      }}
                    >
                      {event.title}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Today View */}
      <div className="w-1/4 bg-white rounded-lg shadow-lg p-4">
        <div className="mb-6">
          <h2 className="text-2xl font-bold">Today</h2>
          <p className="text-gray-600">{format(currentDate, "EEEE, MMMM d")}</p>
        </div>

        <div className="space-y-4">
          {todayEvents.length > 0 ? (
            todayEvents.map((event) => (
              <div
                key={event.id}
                className={`p-3 rounded ${getCalendarColor(event.calendar)}`}
              >
                <div className="font-semibold">{event.title}</div>
                <div className="text-sm text-gray-600">
                  {format(event.start, "h:mm a")} - {format(event.end, "h:mm a")}
                </div>
              </div>
            ))
          ) : (
            <p className="text-gray-500 text-center">No events today</p>
          )}
        </div>
      </div>

      {/* Event Form Modal */}
      {showEventForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg w-96">
            <h3 className="text-lg font-bold mb-4">Add New Event</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Title</label>
                <input
                  type="text"
                  value={newEvent.title}
                  onChange={(e) =>
                    setNewEvent({ ...newEvent, title: e.target.value })
                  }
                  className="w-full p-2 border rounded"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Calendar</label>
                <select
                  value={newEvent.calendar}
                  onChange={(e) =>
                    setNewEvent({ ...newEvent, calendar: e.target.value })
                  }
                  className="w-full p-2 border rounded"
                >
                  <option value="personal">Personal</option>
                  <option value="daughter">Daughter</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Start Time</label>
                <input
                  type="datetime-local"
                  value={newEvent.start}
                  onChange={(e) =>
                    setNewEvent({ ...newEvent, start: e.target.value })
                  }
                  className="w-full p-2 border rounded"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">End Time</label>
                <input
                  type="datetime-local"
                  value={newEvent.end}
                  onChange={(e) => setNewEvent({ ...newEvent, end: e.target.value })}
                  className="w-full p-2 border rounded"
                  required
                />
              </div>
              <div className="flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setShowEventForm(false)}
                  className="px-4 py-2 border rounded hover:bg-gray-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                >
                  Add Event
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Schedule;
