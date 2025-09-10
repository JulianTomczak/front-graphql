'use client';

import React, { useState, useEffect } from 'react';
import {useMutation, useQuery } from '@apollo/client/react';
import { gql } from '@apollo/client';

const CHECK_EMAIL = gql`
  query CheckEmail($email: String!) {
    profileByEmail(email: $email) {
      id
      email
    }
  }
`;

const UPDATE_PROFILE = gql`
  mutation UpdateProfile($id: ID!, $updateProfileInput: UpdateProfileInput!) {
    updateProfile(id: $id, updateProfileInput: $updateProfileInput) {
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

interface Profile {
  id: number; // Asegurado como number para coincidir con el backend
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
}

interface EditProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  onProfileUpdated: () => void;
  profile: Profile | null; // Permitir null para manejar errores
}

const EditProfileModal: React.FC<EditProfileModalProps> = ({ isOpen, onClose, onProfileUpdated, profile }) => {
  // Verificar si profile es null o no tiene id
  if (!profile || !profile.id) {
    return (
      <div className="modal-overlay">
        <div className="modal profile-modal">
          <div className="modal-header">
            <h2>Error</h2>
            <button onClick={onClose} className="close-btn">×</button>
          </div>
          <p className="error-message">No se proporcionó un perfil válido para editar.</p>
        </div>
      </div>
    );
  }

  const [formData, setFormData] = useState({
    firstName: profile.firstName || '',
    lastName: profile.lastName || '',
    email: profile.email || '',
    phone: profile.phone || '',
    bio: profile.bio || '',
    birthDate: profile.birthDate ? new Date(profile.birthDate).toISOString().split('T')[0] : '',
    salary: profile.salary ? profile.salary.toString() : '',
    company: profile.company || '',
    jobTitle: profile.jobTitle || '',
    skills: profile.skills ? profile.skills.join(', ') : ''
  });

  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [calculatedAge, setCalculatedAge] = useState<number | null>(profile.age || null);

  const { data: emailCheckData } = useQuery(CHECK_EMAIL, {
    variables: { email: formData.email },
    skip: !formData.email || formData.email === profile.email,
  });

  const [updateProfile, { loading, error }] = useMutation(UPDATE_PROFILE, {
    onCompleted: () => {
      onProfileUpdated();
      onClose();
      setFormErrors({});
    },
  });

 useEffect(() => {
  if (profile) {
    setFormData({
      firstName: profile.firstName || '',
      lastName: profile.lastName || '',
      email: profile.email || '',
      phone: profile.phone || '',
      bio: profile.bio || '',
      birthDate: profile.birthDate ? new Date(profile.birthDate).toISOString().split('T')[0] : '',
      salary: profile.salary ? profile.salary.toString() : '',
      company: profile.company || '',
      jobTitle: profile.jobTitle || '',
      skills: profile.skills ? profile.skills.join(', ') : '',
    });
    setCalculatedAge(profile.age || null);
  }
}, [profile]); 

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));

    if (formErrors[name]) setFormErrors(prev => ({ ...prev, [name]: '' }));
  };

  const validateForm = () => {
    const errors: Record<string, string> = {};
    if (!formData.firstName.trim()) errors.firstName = 'El nombre es obligatorio';
    if (!formData.lastName.trim()) errors.lastName = 'El apellido es obligatorio';
    if (!formData.email.trim()) errors.email = 'El correo electrónico es obligatorio';
    if (formData.email && !/\S+@\S+\.\S+/.test(formData.email)) errors.email = 'Formato de correo inválido';
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    // Log para depurar el valor de profile.id
    console.log('Enviando mutación con id:', profile.id);

    try {
      await updateProfile({
        variables: {
          id: profile.id, // Asegúrate de que esto sea un número
          updateProfileInput: {
            firstName: formData.firstName,
            lastName: formData.lastName,
            email: formData.email,
            phone: formData.phone || undefined,
            bio: formData.bio || undefined,
            birthDate: formData.birthDate ? new Date(formData.birthDate).toISOString() : undefined,
            age: calculatedAge || undefined,
            salary: formData.salary ? parseFloat(formData.salary) : undefined,
            company: formData.company || undefined,
            jobTitle: formData.jobTitle || undefined,
            skills: formData.skills ? formData.skills.split(',').map(s => s.trim()).filter(s => s) : undefined,
          },
        },
      });
    } catch (err: any) {
      console.error('Error al actualizar perfil:', JSON.stringify(err, null, 2));
      const errorMessage = err.message || '';
      if (errorMessage.includes('argument "id" of type "ID!" is required')) {
        setFormErrors(prev => ({
          ...prev,
          general: 'El ID del perfil es requerido. Por favor, intenta de nuevo.',
        }));
      } else if (
        errorMessage.includes('correo electrónico ya está en uso') ||
        errorMessage.includes('llave duplicada')
      ) {
        setFormErrors(prev => ({
          ...prev,
          email: 'El correo electrónico ya está en uso por otro perfil o usuario. Por favor, elige otro.',
        }));
      } else {
        setFormErrors(prev => ({
          ...prev,
          general: 'Error al actualizar el perfil. Por favor, intenta de nuevo.',
        }));
      }
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal profile-modal">
        <div className="modal-header">
          <h2>Editar Perfil</h2>
          <button onClick={onClose} className="close-btn">×</button>
        </div>

        {error && <p className="error-message">Error: {error.message}</p>}
        {formErrors.general && <p className="error-message">{formErrors.general}</p>}

        <form onSubmit={handleSubmit} className="modal-form">
          <div className="form-section">
            <h3 className="form-section-title">Información de perfil</h3>
            <div className="form-grid">
              <div className="form-group">
                <label htmlFor="firstName">Nombre *</label>
                <input
                  id="firstName"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  placeholder="Ingresa el nombre"
                  required
                  className={formErrors.firstName ? 'input-error' : ''}
                />
                {formErrors.firstName && <span className="error-text">{formErrors.firstName}</span>}
              </div>
              <div className="form-group">
                <label htmlFor="lastName">Apellido *</label>
                <input
                  id="lastName"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  placeholder="Ingresa el apellido"
                  required
                  className={formErrors.lastName ? 'input-error' : ''}
                />
                {formErrors.lastName && <span className="error-text">{formErrors.lastName}</span>}
              </div>
              <div className="form-group">
                <label htmlFor="email">Correo electrónico *</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Ingresa el correo"
                  required
                  className={formErrors.email ? 'input-error' : ''}
                />
                {formErrors.email && <span className="error-text">{formErrors.email}</span>}
              </div>
              <div className="form-group">
                <label htmlFor="phone">Teléfono</label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="Ingresa el número de teléfono"
                />
              </div>
              <div className="form-group">
                <label htmlFor="jobTitle">Título del puesto</label>
                <input
                  id="jobTitle"
                  name="jobTitle"
                  value={formData.jobTitle}
                  onChange={handleChange}
                  placeholder="Ingresa el título del puesto"
                />
              </div>
              <div className="form-group">
                <label htmlFor="company">Empresa</label>
                <input
                  id="company"
                  name="company"
                  value={formData.company}
                  onChange={handleChange}
                  placeholder="Ingresa el nombre de la empresa"
                />
              </div>
              <div className="form-group">
                <label htmlFor="birthDate">Fecha de nacimiento</label>
                <input
                  type="date"
                  id="birthDate"
                  name="birthDate"
                  value={formData.birthDate}
                  onChange={handleChange}
                />
                {calculatedAge !== null && <span className="age-display">Edad: {calculatedAge}</span>}
              </div>
              <div className="form-group">
                <label htmlFor="salary">Salario</label>
                <input
                  type="number"
                  id="salary"
                  name="salary"
                  value={formData.salary}
                  onChange={handleChange}
                  placeholder="Ingresa el salario"
                  step="0.01"
                />
              </div>
              <div className="form-group">
                <label htmlFor="skills">Habilidades (separadas por comas)</label>
                <input
                  id="skills"
                  name="skills"
                  value={formData.skills}
                  onChange={handleChange}
                  placeholder="Ej: JavaScript, React, Node.js"
                />
              </div>
              <div className="form-group full-width">
                <label htmlFor="bio">Biografía</label>
                <textarea
                  id="bio"
                  name="bio"
                  value={formData.bio}
                  onChange={handleChange}
                  placeholder="Ingresa la biografía"
                  rows={4}
                />
              </div>
            </div>
          </div>

          <div className="modal-actions">
            <button type="button" onClick={onClose} className="btn-secondary">
              Cancelar
            </button>
            <button type="submit" disabled={loading} className="btn-primary">
              {loading ? 'Actualizando...' : 'Actualizar Perfil'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditProfileModal;