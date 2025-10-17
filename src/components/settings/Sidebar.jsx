// src/components/Settings/Sidebar.jsx
export default function Sidebar({ activeTab, setActiveTab }) {
  const tabs = [
    { id: "profile", label: "Profile" },
    { id: "security", label: "Security" },
    { id: "delete", label: "Delete Account" },
  ];

  return (
    <aside className="w-64 bg-white shadow-md p-4">
      <ul className="space-y-2">
        {tabs.map((tab) => (
          <li
            key={tab.id}
            className={`cursor-pointer p-2 rounded ${
              activeTab === tab.id ? "bg-green-400 text-white" : "hover:bg-gray-200"
            }`}
            onClick={() => setActiveTab(tab.id)}
          >
            {tab.label}
          </li>
        ))}
      </ul>
    </aside>
  );
}
