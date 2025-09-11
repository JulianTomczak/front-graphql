"use client";
import React from "react";

interface Props {
  viewMode: "basic" | "detailed";
  setViewMode: (mode: "basic" | "detailed") => void;
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  resultsCount: number;
  onOpenCreateModal: () => void;
}

const UsersControls: React.FC<Props> = ({
  viewMode,
  setViewMode,
  searchTerm,
  setSearchTerm,
  resultsCount,
  onOpenCreateModal,
}) => {
  return (
    <div className="controls-section">
      <div className="search-box">
        <span className="search-icon">🔍</span>
        <input
          type="text"
          placeholder="Search users by name, email, company..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="search-input"
        />
        <span className="results-badge">{resultsCount} users</span>
      </div>

      <div className="actions-group">
        <button className="create-btn" onClick={onOpenCreateModal}>
          ➕ Create User
        </button>

        <div className="view-controls">
          <button
            className={viewMode === "basic" ? "view-btn active" : "view-btn"}
            onClick={() => setViewMode("basic")}
          >
            📋 Basic View
          </button>
          <button
            className={viewMode === "detailed" ? "view-btn active" : "view-btn"}
            onClick={() => setViewMode("detailed")}
          >
            📊 Detailed View
          </button>
        </div>
      </div>
    </div>
  );
};

export default UsersControls;
