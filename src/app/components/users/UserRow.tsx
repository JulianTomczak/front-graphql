"use client";
import React from "react";
import { User } from "../../types/user";

interface Props {
  user: User;
  viewMode: "basic" | "detailed";
  onDelete?: (id: string) => void;
}

const UserRow: React.FC<Props> = ({ user, viewMode, onDelete }) => {
  return (
    <tr className="table-row">
      <td><span className="username">{user.username}</span></td>
      <td>
        <span className={`status-badge ${user.isActive ? "active" : "inactive"}`}>
          {user.isActive ? "Active" : "Inactive"}
        </span>
      </td>
      <td>{user.profile.firstName}</td>
      <td>{user.profile.lastName}</td>
      <td>
        <a href={`mailto:${user.profile.email}`} className="email-link">
          {user.profile.email}
        </a>
      </td>

      {viewMode === "detailed" && (
        <>
          <td>{user.profile.phone || "-"}</td>
          <td>{user.profile.jobTitle || "-"}</td>
          <td>{user.profile.company || "-"}</td>
          <td>
            <span className={`verification-badge ${user.profile.isVerified ? "verified" : "not-verified"}`}>
              {user.profile.isVerified ? "✅" : "❌"}
            </span>
          </td>
        </>
      )}
      <td>
        {onDelete && (
          <button
            className="delete-btn"
            onClick={() => onDelete(user.id)}
            title="Eliminar usuario"
          >
            🗑️
          </button>
        )}
      </td>
    </tr>
  );
};

export default UserRow;
