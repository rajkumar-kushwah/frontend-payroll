// src/components/Settings/SettingsPage.jsx
import { useState } from "react";
import Profile from "./SettingsProfile";
import Security from "./SettingsSecurity";
import DeleteAccount from "./DeleteAccount";
import Layout from "../components/Layout";

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState("profile");

  const renderContent = () => {
    switch (activeTab) {
      case "profile":
        return <Profile />;
      case "security":
        return <Security />;
      case "delete":
        return <DeleteAccount />;
      default:
        return <Profile />;
    }
  };

  const tabs = [
    { id: "profile", label: "Profile" },
    { id: "security", label: "Security" },
    { id: "delete", label: "Delete Account" },
  ];

  return (
    <Layout>
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-4xl mx-auto rounded shadow-md p-6">
        {/* Tabs */}
        <div className="flex border-b mb-4">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              className={`px-4 py-2 -mb-px border-b-2 font-medium ${
                activeTab === tab.id
                  ? "border-green-500 text-green-600"
                  : "border-transparent text-gray-600 hover:text-green-500 hover:border-green-500"
              }`}
              onClick={() => setActiveTab(tab.id)}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div>{renderContent()}</div>
      </div>
    </div>
    </Layout>
  );
}
