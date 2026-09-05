"use client";
import React from "react";
import { Profile } from "../../types/profile";
import ProfileCard from "./ProfileCard";

interface ProfilesGridProps {
  profiles: Profile[];
  viewMode: "basic" | "full";
  onEdit: (profile: Profile) => void;
  searchTerm: string;
  onDelete?: (id: string) => void;
  onVerify?: (profile: Profile) => void;
  verifying?: boolean;
}

const ProfilesGrid: React.FC<ProfilesGridProps> = ({ profiles, viewMode, onEdit, searchTerm, onDelete, onVerify, verifying }) => {
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
          onDelete={onDelete}
          onVerify={onVerify}
          verifying={verifying}
        />
      ))}
    </div>
  );
};

export default ProfilesGrid;
