'use client';

import React, { useState } from 'react';
import { useQuery } from '@apollo/client/react';
import CreateUserModal from './createUserModal'; // Import the CreateUserModal component
import { gql } from '@apollo/client';

// Queries
const GET_BASIC_USERS = gql`
  query GetBasicUsers {
    users {
      id
      username
      isActive
      registeredAt
      profile {
        firstName
        lastName
        email
      }
    }
  }
`;

const GET_DETAILED_USERS = gql`
  query GetDetailedUsers {
    users {
      id
      username
      isActive
      registeredAt
      lastLogin
      profile {
        firstName
        lastName
        email
        phone
        jobTitle
        company
        isVerified
      }
    }
  }
`;

type User = {
  id: string;
  username: string;
  isActive: boolean;
  registeredAt: string;
  lastLogin?: string;
  profile: {
    firstName: string;
    lastName: string;
    email: string;
    phone?: string;
    jobTitle?: string;
    company?: string;
    isVerified?: boolean;
  };
};

const UsersPage = () => {
  const [viewMode, setViewMode] = useState<'basic' | 'detailed'>('basic');
  const [searchTerm, setSearchTerm] = useState('');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  const { loading, error, data, refetch } = useQuery<{ users: User[] }>(
    viewMode === 'detailed' ? GET_DETAILED_USERS : GET_BASIC_USERS
  );

  const filteredUsers = data?.users?.filter(user =>
    user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.profile.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.profile.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.profile.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.profile.company?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.profile.jobTitle?.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];

  if (loading) return (
    <div className="loading-state">
      <div className="spinner"></div>
      <p>Loading users data...</p>
    </div>
  );

  if (error) return (
    <div className="error-state">
      <h3>⚠️ Error Loading Data</h3>
      <p>{error.message}</p>
    </div>
  );

  return (
    <div className="page-container">
      {/* Header de la Página */}
      <div className="page-header">
        <h2>👥 Users Management</h2>
        <p>Manage and view user information efficiently</p>
      </div>

      {/* Controles */}
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
          <span className="results-badge">
            {filteredUsers.length} users
          </span>
        </div>

        <div className="actions-group">
          <button
            className="create-btn"
            onClick={() => setIsCreateModalOpen(true)}
          >
            ➕ Create User
          </button>

          <div className="view-controls">
            <button
              className={viewMode === 'basic' ? 'view-btn active' : 'view-btn'}
              onClick={() => setViewMode('basic')}
            >
              📋 Basic View
            </button>
            <button
              className={viewMode === 'detailed' ? 'view-btn active' : 'view-btn'}
              onClick={() => setViewMode('detailed')}
            >
              📊 Detailed View
            </button>
          </div>
        </div>
      </div>

      {/* Tabla de Usuarios */}
      <div className="table-wrapper">
        <table className="data-table">
          <thead>
            <tr>
              <th>Username</th>
              <th>Status</th>
              <th>First Name</th>
              <th>Last Name</th>
              <th>Email</th>
              {viewMode === 'detailed' && (
                <>
                  <th>Phone</th>
                  <th>Job Title</th>
                  <th>Company</th>
                  <th>Verified</th>
                </>
              )}
            </tr>
          </thead>
          <tbody>
            {filteredUsers.map(user => (
              <tr key={user.id} className="table-row">
                <td>
                  <span className="username">{user.username}</span>
                </td>
                <td>
                  <span className={`status-badge ${user.isActive ? 'active' : 'inactive'}`}>
                    {user.isActive ? 'Active' : 'Inactive'}
                  </span>
                </td>
                <td>{user.profile.firstName}</td>
                <td>{user.profile.lastName}</td>
                <td>
                  <a href={`mailto:${user.profile.email}`} className="email-link">
                    {user.profile.email}
                  </a>
                </td>
                {viewMode === 'detailed' && (
                  <>
                    <td>{user.profile.phone || '-'}</td>
                    <td>{user.profile.jobTitle || '-'}</td>
                    <td>{user.profile.company || '-'}</td>
                    <td>
                      <span className={`verification-badge ${user.profile.isVerified ? 'verified' : 'not-verified'}`}>
                        {user.profile.isVerified ? '✅' : '❌'}
                      </span>
                    </td>
                  </>
                )}
              </tr>
            ))}
          </tbody>
        </table>

        {filteredUsers.length === 0 && searchTerm && (
          <div className="empty-search">
            <p>No users found matching &quot;{searchTerm}&quot;</p>
          </div>
        )}

        {filteredUsers.length === 0 && !searchTerm && (
          <div className="empty-state">
            <p>No users found in the system</p>
          </div>
        )}
      </div>

      {/* Use CreateUserModal */}
      <CreateUserModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onUserCreated={refetch}
      />
    </div>
  );
};

export default UsersPage;