import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getEmployeeById, updateEmployee } from '../utils/api';
import Layout from '../components/Layout';

export default function EditEmployee() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [employee, setEmployee] = useState({
        name: "",
        email: "",
        phone: "",
        jobRole: "",
        department: "",
        joinDate: "",
        salary: "",
        status: "active",
        notes: ""
    });

    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchEmployee = async () => {
            try {
                const res = await getEmployeeById(id);
                const emp = res.data;

                setEmployee({
                    name: emp.name || "",
                    email: emp.email || "",
                    phone: emp.phone || "",
                    jobRole: emp.jobRole || "",
                    department: emp.department || "",
                    joinDate: emp.joinDate ? emp.joinDate.split("T")[0] : "",
                    salary: emp.salary || "",
                    status: emp.status || "active",
                    notes: emp.notes || "",
                })
            } catch (err) {
                console.error("Error fetching employee:", err);
                alert("Failed to load employee data. Please try again.");
            } finally {
                setLoading(false);
            }
        };

        fetchEmployee();
    }, [id]);

    const handleUpdate = async (e) => {
        e.preventDefault();
        try {
            await updateEmployee(id, employee);
            alert("Employee updated successfully!");
            navigate("/employees");
        } catch (err) {
            console.error("Error updating employee:", err);
            alert("Failed to update employee. Please try again.");
        }
    };

    // if (loading) {
    //     return <div className='p-6 text-center'>Loading...</div>;
    // }


    return (
        <Layout>
        <div className='min-h-screen flex items-center justify-center bg-gray-200'>
        <div className='p-6 max-w-3xl mx-auto '>
            <h2 className="text-xl font-semibold mb-4">Edit Employee</h2>

            <form onSubmit={handleUpdate} className="grid grid-cols-2 gap-4 bg-gray-100 p-5 rounded shadow">
                <label htmlFor="text">Name</label>
                <input type="text" placeholder='Name' value={employee.name} onChange={(e) => setEmployee({ ...employee, name: e.target.value })}
                    className='border p-2 rounded'
                />

                <label htmlFor="email">Email</label>
                <input type="email" placeholder='Email' value={employee.email} onChange={(e) => setEmployee({ ...employee, email: e.target.value })}
                    className='border p-2 rounded'
                />

                <label htmlFor="phone">Phone</label>
                <input type="text" placeholder='Phone' value={employee.phone} onChange={(e) => setEmployee({ ...employee, phone: e.target.value })}
                    className='border p-2 rounded'
                />

                <label htmlFor="jobRole">Job Role</label>
                <input type="text" placeholder='Job Role' value={employee.jobRole} onChange={(e) => setEmployee({ ...employee, jobRole: e.target.value })}
                    className='border p-2 rounded'
                />

                <label htmlFor="department">Department</label>
                <input type="text" placeholder='Department' value={employee.department} onChange={(e) => setEmployee({ ...employee, department: e.target.value })}
                    className='border p-2 rounded'
                />

                <label htmlFor="joinDate">Join Date</label>
                <input type="date" placeholder='Join Date' value={employee.joinDate} onChange={(e) => setEmployee({ ...employee, joinDate: e.target.value })}
                    className='border p-2 rounded'
                />

                <label htmlFor="salary">Salary</label>
                <input type="number" placeholder='Salary' value={employee.salary} onChange={(e) => setEmployee({ ...employee, salary: e.target.value })}
                    className='border p-2 rounded'
                />

                <label htmlFor="status">Status</label>
                <select value={employee.status} onChange={(e) => setEmployee({ ...employee, status: e.target.value })} className='border p-2 rounded'>
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                </select>

                <label htmlFor="notes">Notes</label>
                <textarea placeholder='Notes' value={employee.notes} onChange={(e) => setEmployee({ ...employee, notes: e.target.value })}
                    className='border p-2 rounded'
                />

                <div className="flex justify-between col-span-2">
                    <button
                        type="button"
                        onClick={() => navigate("/employees")}
                        className="bg-gray-400 hover:bg-gray-500 text-white px-4 py-2 rounded"
                    >
                        Cancel
                    </button>

                    <button
                        type="submit"
                        className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded"
                    >
                        Update Employee
                    </button>
                </div>
            </form>
        </div>
        </div>
        </Layout>
    )
}

