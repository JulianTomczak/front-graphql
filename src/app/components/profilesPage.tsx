'use client';

import React, { useState } from 'react';
import { useQuery } from '@apollo/client/react';
import EditProfileModal from './EditProfileModal';
import { gql } from '@apollo/client';

// CONSULTA OPTIMIZADA para perfiles
const GET_PROFILES = gql`
  query GetProfiles {
    profiles {
      id
      firstName
      lastName
      email
      phone
      jobTitle
      company
      isVerified
      createdAt
    }
  }
`;

// Query completa para cuando se necesiten todos los campos
const GET_FULL_PROFILES = gql`
  query GetFullProfiles {
    profiles {
      id
      firstName
      lastName
      email
      phone
      bio
      birthDate
      age
      salary
      company
      jobTitle
      skills
      isVerified
      createdAt
      updatedAt
    }
  }
`;

type Profile = {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  bio?: string;
  birthDate?: string;
  age?: number;
  salary?: number;
  company?: string;
  jobTitle?: string;
  skills?: string[];
  isVerified: boolean;
  createdAt: string;
  updatedAt?: string;
};

const ProfilesPage = () => {
  const [viewMode, setViewMode] = useState<'basic' | 'full'>('basic');
  const [searchTerm, setSearchTerm] = useState('');
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedProfile, setSelectedProfile] = useState<Profile | null>(null);

  const { loading, error, data, refetch } = useQuery<{ profiles: Profile[] }>(
    viewMode === 'full' ? GET_FULL_PROFILES : GET_PROFILES
  );

  const filteredProfiles = data?.profiles?.filter(profile =>
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

  if (loading) return (
    <div className="loading-state">
      <div className="spinner"></div>
      <p>Cargando datos de perfiles...</p>
    </div>
  );

  if (error) return (
    <div className="error-state">
      <h3>⚠️ Error al cargar perfiles</h3>
      <p>{error.message}</p>
    </div>
  );

  return (
    <div className="page-container">
      {/* Header de la Página */}
      <div className="page-header">
        <h2>📋 Base de datos de perfiles</h2>
        <p>Sistema integral de gestión de perfiles</p>
      </div>

      {/* Controles */}
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
          <span className="results-badge">
            {filteredProfiles.length} perfiles
          </span>
        </div>

        <div className="view-controls">
          <button
            className={viewMode === 'basic' ? 'view-btn active' : 'view-btn'}
            onClick={() => setViewMode('basic')}
          >
            📋 Vista estándar
          </button>
          <button
            className={viewMode === 'full' ? 'view-btn active' : 'view-btn'}
            onClick={() => setViewMode('full')}
          >
            📊 Vista completa
          </button>
        </div>
      </div>

      {/* Grid de Perfiles */}
      <div className="profiles-grid">
        {filteredProfiles.map(profile => (
          <div key={profile.id} className="profile-card">
            <div className="card-header">
              <h3>{profile.firstName} {profile.lastName}</h3>
              <span className={`verification-badge ${profile.isVerified ? 'verified' : 'not-verified'}`}>
                {profile.isVerified ? 'Verificado' : 'No verificado'}
              </span>
            </div>
            
            <div className="card-body">
              <div className="profile-info">
                <p><strong>📧 Correo:</strong> {profile.email}</p>
                <p><strong>📞 Teléfono:</strong> {profile.phone || 'No proporcionado'}</p>
                <p><strong>💼 Trabajo:</strong> {profile.jobTitle || 'N/A'} en {profile.company || 'N/A'}</p>
                
                {viewMode === 'full' && (
                  <>
                    <p><strong>💰 Salario:</strong> {profile.salary ? `$${profile.salary.toLocaleString()}` : 'N/A'}</p>
                    <p><strong>🎂 Edad:</strong> {profile.age || 'N/A'}</p>
                    <p><strong>🛠️ Habilidades:</strong> {profile.skills?.join(', ') || 'Ninguna'}</p>
                    {profile.bio && (
                      <p><strong>📝 Biografía:</strong> {profile.bio}</p>
                    )}
                  </>
                )}
              </div>
              
              <div className="card-footer">
                <span className="member-since">
                  Miembro desde: {new Date(profile.createdAt).toLocaleDateString()}
                </span>
                <button
                  className="btn-primary"
                  onClick={() => handleEditClick(profile)}
                  style={{ marginLeft: '1rem' }}
                >
                  Editar
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredProfiles.length === 0 && (
        <div className="empty-state">
          <p>No se encontraron perfiles {searchTerm && `que coincidan con "${searchTerm}"`}</p>
        </div>
      )}

      {/* Modal de Edición */}
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