// src/pages/Dashboard.jsx
 import React, { useEffect, useState } from "react";
 import Layout  from "../components/Layout";
 import api from "../utils/api";

 export default function Dashboard() {
  const [stats, setStats] = useState({ employees: 0, payrolls: 0, leaves: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fatchStats = async () => {
      try {
        const [eRes, pRes] = await Promise.allSettled([api.get("/employees"), api.get("/payrolls")]);
        const employees = eRes.status === "fulfilled" ? (eRes.value.data.length || 0 ): 0;
        const payrolls = pRes.status === "fulfilled" ? (pRes.value.data.length || 0) : 0;
        setStats({ employees, payrolls, leaves:0});
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fatchStats();
  }, []);
  if (loading) return <Layout><div className="p-6">Loading dashboard...</div></Layout>

  return (
    <Layout>
      <h1 className="text-2xl font-bold mb-4">Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-6 rounded shadow text-center">
          <div className="text-sm text-gray-600">Employees</div>
          <div className="text-3xl font-bold text-green-600 mt-2">{stats.employees}</div>
        </div>
        <div className="bg-white p-6 rounded shadow text-center">
          <div className="text-sm text-gray-500">Payrolls</div>
          <div className="text-3xl font-bold text-green-600 ">{stats.payrolls}</div>
        </div>
        <div className="bg-white p-6 rounded shadow text-center">
          <div className="text-sm text-gray-500">Leaves</div>
          <div className="text-3xl font-bold text-green-600 ">{stats.leaves}</div>
        </div>
      </div>
    </Layout>
  )

 }
