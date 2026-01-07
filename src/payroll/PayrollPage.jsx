import React, { useEffect, useState } from "react";
import Layout from "../components/Layout";
import PayrollTable from "./PayrollTable";
import PayrollFilters from "./PayrollFilters";
import { getPayrolls, getPayrollByEmployee, exportPayrollCsv } from "../utils/api";

function PayrollPage() {
  const monthNames = [
    "Jan","Feb","Mar","Apr","May","Jun",
    "Jul","Aug","Sep","Oct","Nov","Dec"
  ];

  const currentDate = new Date();
  const [month, setMonth] = useState(
    `${monthNames[currentDate.getMonth()]} ${currentDate.getFullYear()}`
  );
  const [payrolls, setPayrolls] = useState([]);
  const [loading, setLoading] = useState(false);

  // Fetch payrolls whenever month changes
  useEffect(() => {
    fetchPayrolls();
  }, [month]);

  const fetchPayrolls = async () => {
    setLoading(true);
    try {
      const res = await getPayrolls({ month });

      // Ensure payrolls is always an array
      if (res.data && Array.isArray(res.data.data)) {
        setPayrolls(res.data.data);
      } else {
        setPayrolls([]);
      }
    } catch (err) {
      console.error(err);
      setPayrolls([]);
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateSlip = async (employeeId) => {
    try {
      const res = await getPayrollByEmployee(employeeId, month);
      alert(`Payslip for ${res.data.name} fetched`);
    } catch (err) {
      console.error(err);
      alert(err?.response?.data?.message || "Failed to fetch payslip");
    }
  };

  // Export CSV for all employees
  const handleExportCsv = async () => {
    try {
      const res = await exportPayrollCsv(month);

      const blob = new Blob([res.data], { type: "text/csv" });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `Payroll_${month}.csv`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error(err);
      alert("Failed to export CSV");
    }
  };

  return (
    <Layout>
      <div className="p-4 space-y-4">
        <h2 className="text-xs font-semibold text-gray-700 uppercase">
          Payroll Summary
        </h2>

        {/* Month + Year Filter */}
        <PayrollFilters month={month} setMonth={setMonth} />

        {/* Export CSV Button */}
        <div className="flex justify-end space-x-2">
          <button
            onClick={handleExportCsv}
            className="px-3 py-1 bg-blue-600 text-white text-xs rounded hover:bg-blue-700"
          >
            Export CSV
          </button>
        </div>

        {/* Payroll Table */}
        {loading ? (
          <div className="text-xs text-gray-500 py-6 text-center">
            Loading payroll data...
          </div>
        ) : (
          <PayrollTable
            payrolls={Array.isArray(payrolls) ? payrolls : []}
            month={month}
            onGenerateSlip={handleGenerateSlip}
          />
        )}
      </div>
    </Layout>
  );
}

export default PayrollPage;
