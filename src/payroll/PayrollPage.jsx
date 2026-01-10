import React, { useEffect } from "react";
import Layout from "../components/Layout";
import PayrollTable from "./PayrollTable";
import PayrollFilters from "./PayrollFilters";
import { getPayrolls, exportPayrollPdf } from "../utils/api"; 
import { useUser } from "../context/UserContext";

function PayrollPage() {
  const { user, payrolls, setPayrolls } = useUser(); // Global context

  const monthNames = [
    "Jan","Feb","Mar","Apr","May","Jun",
    "Jul","Aug","Sep","Oct","Nov","Dec"
  ];

  const currentDate = new Date();
  const [month, setMonth] = React.useState(
    `${monthNames[currentDate.getMonth()]} ${currentDate.getFullYear()}`
  );


  // fetch payrolls background me
  useEffect(() => {
    const fetchPayrolls = async () => {
      if (!user) return; // wait until user loaded

      try {
        const res = await getPayrolls({ month });
        if (res.data && Array.isArray(res.data.data)) {
          setPayrolls(res.data.data); //  Update global context
        } else {
          setPayrolls([]);
        }
      } catch (err) {
        console.error(err);
        setPayrolls([]);
      }
    };

    fetchPayrolls();
  }, [month, user, setPayrolls]);

  //  Export PDF
 const handleExportEmployeePdf = async (employeeId, employeeName) => {
  try {
    const res = await exportPayrollPdf(employeeId, month);

    // --------- LOCAL STORAGE LOG ----------
    const logs = JSON.parse(localStorage.getItem("reportLogs")) || [];

    logs.push({
      employeeId,
      employeeName,
      month,
      type: "payroll-pdf",
      createdAt: new Date().toISOString(),
    });

    localStorage.setItem("reportLogs", JSON.stringify(logs));
    // --------------------------------------

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
    alert("Failed to export payroll PDF");
  }
};


  return (
    <Layout>
      <div className="p-4 space-y-4">
        <h2 className="text-xs font-semibold text-gray-700 uppercase">
          Payroll Summary
        </h2>

        <PayrollFilters month={month} setMonth={setMonth} />

        {/* Payroll Table (data turant show) */}
        <PayrollTable
          payrolls={Array.isArray(payrolls) ? payrolls : []}
          month={month}
          onGenerateSlip={handleExportEmployeePdf} 
        />
      </div>
    </Layout>
  );
}

export default PayrollPage;
