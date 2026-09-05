"use client";
import React, { useState } from "react";
import { useQuery, useMutation } from "@apollo/client/react";
import CreateUserModal from "../modals/CreateUserModal";
import { GET_BASIC_USERS, GET_DETAILED_USERS } from "../../graphql/queries/user";
import { REMOVE_USER } from "../../graphql/mutations/user";
import { User } from "../../types/user";
import UsersControls from "../users/UsersControls";
import UsersTable from "../users/UsersTable";

const UsersPage = () => {
  const [viewMode, setViewMode] = useState<"basic" | "detailed">("basic");
  const [searchTerm, setSearchTerm] = useState("");
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  const { loading, error, data, refetch } = useQuery<{ users: User[] }>(
    viewMode === "detailed" ? GET_DETAILED_USERS : GET_BASIC_USERS
  );

  const [removeUser, { error: removeError }] = useMutation(REMOVE_USER);

  const handleDeleteUser = async (id: string) => {
    if (!window.confirm("¿Estás seguro de que deseas eliminar este usuario?")) return;
    try {
      await removeUser({ variables: { id } });
      refetch();
    } catch (err) {
      console.error("Error al eliminar usuario:", err);
    }
  };

  const filteredUsers =
    data?.users?.filter(
      (user) =>
        user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.profile.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.profile.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.profile.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.profile.company?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.profile.jobTitle?.toLowerCase().includes(searchTerm.toLowerCase())
    ) || [];

  if (loading)
    return (
      <div className="loading-state">
        <div className="spinner"></div>
        <p>Loading users data...</p>
      </div>
    );

  if (error)
    return (
      <div className="error-state">
        <h3>⚠️ Error Loading Data</h3>
        <p>{error.message}</p>
      </div>
    );

  return (
    <div className="page-container">
      <div className="page-header">
        <h2>👥 Users Management</h2>
        <p>Manage and view user information efficiently</p>
      </div>

      {removeError && <p className="error-message">Error al eliminar usuario: {removeError.message}</p>}

      <UsersControls
        viewMode={viewMode}
        setViewMode={setViewMode}
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        resultsCount={filteredUsers.length}
        onOpenCreateModal={() => setIsCreateModalOpen(true)}
      />

      <UsersTable
        users={filteredUsers}
        viewMode={viewMode}
        searchTerm={searchTerm}
        onDelete={handleDeleteUser}
      />

      <CreateUserModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onUserCreated={refetch}
      />
    </div>
  );
};

export default UsersPage;
