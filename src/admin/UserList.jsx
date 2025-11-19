import React from "react";

export default function UserList({ users, onPromote, onDemote, onDelete }) {


    
  return (
    <div className="p-4 border rounded">
      <h2 className="font-semibold mb-2">Existing Users</h2>
      <table className="w-full border">
        <thead>
          <tr className="bg-gray-200">
            <th className="p-2">Name</th>
            <th className="p-2">Email</th>
            <th className="p-2">Role</th>
            <th className="p-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.length === 0 && (
            <tr>
              <td colSpan={4} className="text-center p-3">
                No users found
              </td>
            </tr>
          )}
          {users.map((u) => (
            <tr key={u._id} className="border-t">
              <td className="p-2">{u.name}</td>
              <td className="p-2">{u.email}</td>
              <td className="p-2">{u.role}</td>
              <td className="p-2 flex gap-2">
                {u.role !== "admin" && u.role !== "owner" && (
                  <button
                    onClick={() => onPromote(u._id)}
                    className="px-2 py-1 bg-blue-500 text-white rounded"
                  >
                    Promote
                  </button>
                )}
                {u.role === "admin" && (
                  <button
                    onClick={() => onDemote(u._id)}
                    className="px-2 py-1 bg-red-500 text-white rounded"
                  >
                    Demote
                  </button>
                )}
                <button
                  onClick={() => onDelete(u._id)}
                  className="px-2 py-1 bg-gray-700 text-white rounded"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
