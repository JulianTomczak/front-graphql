"use client";
import React, { useState } from "react";
import { useQuery, useMutation } from "@apollo/client/react";
import { GET_PROFILES, GET_FULL_PROFILES } from "../../graphql/queries/profile";
import { REMOVE_PROFILE, VERIFY_PROFILE } from "../../graphql/mutations/profile";
import EditProfileModal from "../../components/modals/EditProfileModal";
import CreateProfileModal from "../../components/modals/CreateProfileModal";
import ConfirmModal from "../../components/modals/ConfirmModal";
import { Profile } from "../../types/profile";
import ProfilesControls from "../../components/profiles/ProfilesControls";
import ProfilesGrid from "../../components/profiles/ProfilesGrid";

const ProfilesPage = () => {
  const [viewMode, setViewMode] = useState<"basic" | "full">("basic");
  const [searchTerm, setSearchTerm] = useState("");
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [selectedProfile, setSelectedProfile] = useState<Profile | null>(null);
  const [pendingDelete, setPendingDelete] = useState<Profile | null>(null);

  const { loading, error, data, refetch } = useQuery<{ profiles: Profile[] }>(
    viewMode === "full" ? GET_FULL_PROFILES : GET_PROFILES
  );

  const [removeProfile, { loading: removing, error: removeError }] = useMutation(REMOVE_PROFILE);
  const [verifyProfile, { loading: verifying, error: verifyError }] = useMutation(VERIFY_PROFILE);

  const handleDeleteProfile = (id: string) => {
    const profile = data?.profiles?.find((p) => p.id === id);
    if (profile) setPendingDelete(profile);
  };

  const confirmDeleteProfile = async () => {
    if (!pendingDelete) return;
    try {
      await removeProfile({ variables: { id: pendingDelete.id } });
      refetch();
      setPendingDelete(null);
    } catch (err) {
      console.error("Error al eliminar perfil:", err);
    }
  };

  const handleToggleVerified = async (profile: Profile) => {
    try {
      await verifyProfile({ variables: { id: profile.id, isVerified: !profile.isVerified } });
      refetch();
    } catch (err) {
      console.error("Error al cambiar la verificación:", err);
    }
  };

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

      {removeError && <p className="error-message">Error al eliminar perfil: {removeError.message}</p>}
      {verifyError && <p className="error-message">Error al cambiar la verificación: {verifyError.message}</p>}

      <ProfilesControls
        viewMode={viewMode}
        setViewMode={setViewMode}
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        resultsCount={filteredProfiles.length}
        onOpenCreateModal={() => setIsCreateModalOpen(true)}
      />

      <ProfilesGrid
        profiles={filteredProfiles}
        viewMode={viewMode}
        onEdit={handleEditClick}
        searchTerm={searchTerm}
        onDelete={handleDeleteProfile}
        onVerify={handleToggleVerified}
        verifying={verifying}
      />

      <CreateProfileModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onProfileCreated={refetch}
      />

      {selectedProfile && (
        <EditProfileModal
          isOpen={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
          onProfileUpdated={refetch}
          profile={selectedProfile}
        />
      )}

      <ConfirmModal
        isOpen={!!pendingDelete}
        title="Eliminar perfil"
        message={`¿Estás seguro de que deseas eliminar el perfil de "${pendingDelete?.firstName} ${pendingDelete?.lastName}"? Esta acción no se puede deshacer.`}
        confirmLabel="Eliminar"
        isConfirming={removing}
        onConfirm={confirmDeleteProfile}
        onClose={() => setPendingDelete(null)}
      />
    </div>
  );
};

export default ProfilesPage;
