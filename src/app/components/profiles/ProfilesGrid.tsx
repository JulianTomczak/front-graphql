"use client";
import React from "react";
import { Profile } from "../../types/profile";
import ProfileCard from "./ProfileCard";

interface ProfilesGridProps {
  profiles: Profile[];
  viewMode: "basic" | "full";
  onEdit: (profile: Profile) => void;
  searchTerm: string;
}

const ProfilesGrid: React.FC<ProfilesGridProps> = ({ profiles, viewMode, onEdit, searchTerm }) => {
  if (profiles.length === 0) {
    return (
      <div className="empty-state">
        <p>No se encontraron perfiles {searchTerm && `que coincidan con "${searchTerm}"`}</p>
      </div>
    );
  }

  return (
    <div className="profiles-grid">
      {profiles.map((profile) => (
        <ProfileCard
          key={profile.id}
          profile={profile}
          viewMode={viewMode}
          onEdit={onEdit}
        />
      ))}
    </div>
  );
};

export default ProfilesGrid;
