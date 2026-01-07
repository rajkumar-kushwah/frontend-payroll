import React, { useEffect, useState } from "react";
import Layout from "../components/Layout";
import PayrollTable from "./PayrollTable";
import PayrollFilters from "./PayrollFilters";
import { getPayrolls, exportPayrollPdf } from "../utils/api"; // <-- use PDF API

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

  // Export PDF for single employee
  const handleExportEmployeePdf = async (employeeId, employeeName) => {
    try {
      const res = await exportPayrollPdf(employeeId, month);

      // Create blob & download
      const blob = new Blob([res.data], { type: "application/pdf" });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `Payslip_${employeeName}_${month}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error(err);
      alert(err?.response?.data?.message || "Failed to export payroll PDF");
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
            onGenerateSlip={handleExportEmployeePdf} 
              
            
          />
        )}
      </div>
    </Layout>
  );
}

export default PayrollPage;
