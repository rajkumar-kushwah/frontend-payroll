import React, { useEffect, useState } from "react";
import Layout from "../components/Layout";
import PayrollTable from "./PayrollTable";
import PayrollFilters from "./PayrollFilters";
import { getPayrolls, exportPayrollCsv } from "../utils/api";

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


  // Export CSV for all employees
 const handleExportEmployeeCsv = async (employeeId) => {
  try {
    const res = await exportPayrollCsv(month, employeeId);
    const blob = new Blob([res.data], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `Payroll_${employeeId}_${month}.csv`);
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.URL.revokeObjectURL(url);
  } catch (err) {
    console.error(err);
    alert(err?.response?.data?.message || "Failed to export payroll");
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

      

        {/* Payroll Table */}
        {loading ? (
          <div className="text-xs text-gray-500 py-6 text-center">
            Loading payroll data...
          </div>
        ) : (
          <PayrollTable
            payrolls={Array.isArray(payrolls) ? payrolls : []}
            month={month}
            onGenerateSlip={handleExportEmployeeCsv}
          />
        )}
      </div>
    </Layout>
  );
}

export default PayrollPage;
