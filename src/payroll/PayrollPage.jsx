import React, { useEffect, useState } from "react";
import Layout from "../components/Layout";
import PayrollTable from "./PayrollTable";
import PayrollFilters from "./PayrollFilters";
import { getPayrolls, getPayrollByEmployee } from "../utils/api";

function PayrollPage() {
  const monthNames = [
    "Jan","Feb","Mar","Apr","May","Jun",
    "Jul","Aug","Sep","Oct","Nov","Dec"
  ];

  const currentDate = new Date();
  const [month, setMonth] = useState(`${monthNames[currentDate.getMonth()]} ${currentDate.getFullYear()}`);
  const [payrolls, setPayrolls] = useState([]);
  const [loading, setLoading] = useState(false);

  // Fetch payrolls whenever month/year changes
  useEffect(() => {
    fetchPayrolls();
  }, [month]);

  const fetchPayrolls = async () => {
    setLoading(true);
    try {
      const res = await getPayrolls({ month }); // month in format "Feb 2026"
      setPayrolls(res.data || []);
    } catch (err) {
      console.error(err);
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

  return (
    <Layout>
      <div className="p-4 space-y-4">
        <h2 className="text-xs font-semibold text-gray-700 uppercase">
          Payroll Summary
        </h2>

        {/* Month + Year Filter */}
        <PayrollFilters month={month} setMonth={setMonth} />

        {loading ? (
          <div className="text-xs text-gray-500 py-6 text-center">
            Loading payroll data...
          </div>
        ) : (
          <PayrollTable payrolls={payrolls}   month={month} onGenerateSlip={handleGenerateSlip} />
        )}
      </div>
    </Layout>
  );
}

export default PayrollPage;
