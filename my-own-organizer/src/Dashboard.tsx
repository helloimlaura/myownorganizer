import React, { useState } from "react";

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState("schedule");

  const tabs = [
    { id: "schedule", label: "Schedule", icon: "📅" },
    { id: "tasks", label: "Tasks", icon: "📝" },
    { id: "meals", label: "Meal Plan", icon: "🍽️" },
    { id: "habits", label: "Habits", icon: "⭐" },
  ];

  return (
    <div className="p-4 max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">My Personal Organizer</h1>

      {/* Custom Tab Navigation */}
      <div className="flex space-x-1 border-b">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-2 flex items-center space-x-2
              ${
                activeTab === tab.id
                  ? "border-b-2 border-blue-500 text-blue-600"
                  : "text-gray-600 hover:text-blue-500"
              }`}
          >
            <span>{tab.icon}</span>
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="mt-4">
        {activeTab === "schedule" && (
          <div className="bg-white rounded-lg shadow p-4">
            <h2 className="text-xl font-semibold mb-4">Daily Schedule</h2>
            <div className="h-96 flex items-center justify-center text-gray-500">
              Schedule View Coming Soon
            </div>
          </div>
        )}

        {activeTab === "tasks" && (
          <div className="bg-white rounded-lg shadow p-4">
            <h2 className="text-xl font-semibold mb-4">Tasks & Todo List</h2>
            <div className="h-96 flex items-center justify-center text-gray-500">
              Tasks View Coming Soon
            </div>
          </div>
        )}

        {activeTab === "meals" && (
          <div className="bg-white rounded-lg shadow p-4">
            <h2 className="text-xl font-semibold mb-4">Meal Planning</h2>
            <div className="h-96 flex items-center justify-center text-gray-500">
              Meal Planning View Coming Soon
            </div>
          </div>
        )}

        {activeTab === "habits" && (
          <div className="bg-white rounded-lg shadow p-4">
            <h2 className="text-xl font-semibold mb-4">Habit Tracking</h2>
            <div className="h-96 flex items-center justify-center text-gray-500">
              Habits View Coming Soon``
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
