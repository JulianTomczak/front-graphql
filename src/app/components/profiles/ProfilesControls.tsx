"use client";
import React from "react";

interface Props {
  viewMode: "basic" | "full";
  setViewMode: (mode: "basic" | "full") => void;
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  resultsCount: number;
}

const ProfilesControls: React.FC<Props> = ({
  viewMode,
  setViewMode,
  searchTerm,
  setSearchTerm,
  resultsCount,
}) => {
  return (
    <div className="controls-section">
      <div className="search-box">
        <span className="search-icon">🔍</span>
        <input
          type="text"
          placeholder="Buscar perfiles por nombre, correo, trabajo..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="search-input"
        />
        <span className="results-badge">{resultsCount} perfiles</span>
      </div>

      <div className="view-controls">
        <button
          className={viewMode === "basic" ? "view-btn active" : "view-btn"}
          onClick={() => setViewMode("basic")}
        >
          📋 Vista estándar
        </button>
        <button
          className={viewMode === "full" ? "view-btn active" : "view-btn"}
          onClick={() => setViewMode("full")}
        >
          📊 Vista completa
        </button>
      </div>
    </div>
  );
};

export default ProfilesControls;
