"use client";
import React from "react";
import { User } from "../../types/user";
import UserRow from "./UserRow";

interface Props {
  users: User[];
  viewMode: "basic" | "detailed";
  searchTerm: string;
  onDelete?: (id: string) => void;
}

const UsersTable: React.FC<Props> = ({ users, viewMode, searchTerm, onDelete }) => {
  if (users.length === 0 && searchTerm) {
    return (
      <div className="empty-search">
        <p>No users found matching &quot;{searchTerm}&quot;</p>
      </div>
    );
  }

  if (users.length === 0 && !searchTerm) {
    return (
      <div className="empty-state">
        <p>No users found in the system</p>
      </div>
    );
  }

  return (
    <div className="table-wrapper">
      <table className="data-table">
        <thead>
          <tr>
            <th>Username</th>
            <th>Status</th>
            <th>First Name</th>
            <th>Last Name</th>
            <th>Email</th>
            {viewMode === "detailed" && (
              <>
                <th>Phone</th>
                <th>Job Title</th>
                <th>Company</th>
                <th>Verified</th>
              </>
            )}
            {onDelete && <th>Actions</th>}
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <UserRow key={user.id} user={user} viewMode={viewMode} onDelete={onDelete} />
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default UsersTable;
