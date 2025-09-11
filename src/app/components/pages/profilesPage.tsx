"use client";
import React, { useState } from "react";
import { useQuery } from "@apollo/client/react";
import { GET_PROFILES, GET_FULL_PROFILES } from "../../graphql/queries/profile";
import EditProfileModal from "../../components/modals/EditProfileModal";
import { Profile } from "../../types/profile";
import ProfilesControls from "../../components/profiles/ProfilesControls";
import ProfilesGrid from "../../components/profiles/ProfilesGrid";

const ProfilesPage = () => {
  const [viewMode, setViewMode] = useState<"basic" | "full">("basic");
  const [searchTerm, setSearchTerm] = useState("");
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedProfile, setSelectedProfile] = useState<Profile | null>(null);

  const { loading, error, data, refetch } = useQuery<{ profiles: Profile[] }>(
    viewMode === "full" ? GET_FULL_PROFILES : GET_PROFILES
  );

  const filteredProfiles =
    data?.profiles?.filter((profile) =>
      profile.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      profile.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      profile.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      profile.company?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      profile.jobTitle?.toLowerCase().includes(searchTerm.toLowerCase())
    ) || [];

  const handleEditClick = (profile: Profile) => {
    setSelectedProfile(profile);
    setIsEditModalOpen(true);
  };

  if (loading)
    return (
      <div className="loading-state">
        <div className="spinner"></div>
        <p>Cargando datos de perfiles...</p>
      </div>
    );

  if (error)
    return (
      <div className="error-state">
        <h3>⚠️ Error al cargar perfiles</h3>
        <p>{error.message}</p>
      </div>
    );

  return (
    <div className="page-container">
      <div className="page-header">
        <h2>📋 Base de datos de perfiles</h2>
        <p>Sistema integral de gestión de perfiles</p>
      </div>

      <ProfilesControls
        viewMode={viewMode}
        setViewMode={setViewMode}
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        resultsCount={filteredProfiles.length}
      />

      <ProfilesGrid
        profiles={filteredProfiles}
        viewMode={viewMode}
        onEdit={handleEditClick}
        searchTerm={searchTerm}
      />

      {selectedProfile && (
        <EditProfileModal
          isOpen={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
          onProfileUpdated={refetch}
          profile={selectedProfile}
        />
      )}
    </div>
  );
};

export default ProfilesPage;
