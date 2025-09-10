'use client';

import React, { useState, useEffect } from 'react';
import { useMutation } from '@apollo/client/react';
import { gql } from '@apollo/client';

const CREATE_USER = gql`
  mutation CreateUser($createUserInput: CreateUserInput!) {
    createUser(createUserInput: $createUserInput) {
      id
      username
      isActive
      profile {
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
      }
    }
  }
`;

interface CreateUserModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUserCreated: () => void;
}

const CreateUserModal: React.FC<CreateUserModalProps> = ({ isOpen, onClose, onUserCreated }) => {
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    bio: '',
    birthDate: '',
    salary: '',
    company: '',
    jobTitle: '',
    skills: ''
  });

  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [calculatedAge, setCalculatedAge] = useState<number | null>(null);

  const [createUser, { loading, error }] = useMutation(CREATE_USER, {
    onCompleted: () => {
      onUserCreated();
      onClose();
      setFormData({
        username: '',
        password: '',
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        bio: '',
        birthDate: '',
        salary: '',
        company: '',
        jobTitle: '',
        skills: ''
      });
      setCalculatedAge(null);
      setFormErrors({});
    }
  });

  // Calcular edad automáticamente
  useEffect(() => {
    if (formData.birthDate) {
      const birth = new Date(formData.birthDate);
      const today = new Date();
      let age = today.getFullYear() - birth.getFullYear();
      const monthDiff = today.getMonth() - birth.getMonth();
      if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) age--;
      setCalculatedAge(age);
    } else {
      setCalculatedAge(null);
    }
  }, [formData.birthDate]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]:
        type === 'checkbox' ? (e.target as HTMLInputElement).checked :
        name === 'isActive' ? value === 'true' :
        value
    }));

    if (formErrors[name]) setFormErrors(prev => ({ ...prev, [name]: '' }));
  };

  const validateForm = () => {
    const errors: Record<string, string> = {};
    if (!formData.username.trim()) errors.username = 'El nombre de usuario es obligatorio';
    if (!formData.password.trim()) errors.password = 'La contraseña es obligatoria';
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

    try {
      await createUser({
        variables: {
          createUserInput: {
            username: formData.username,
            password: formData.password,
            profile: {
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
              skills: formData.skills ? formData.skills.split(',').map(s => s.trim()) : undefined
            }
          }
        }
      });
    } catch (err) {
      console.error('Error al crear usuario:', err);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal profile-modal">
        <div className="modal-header">
          <h2>Crear Usuario y Perfil</h2>
          <button onClick={onClose} className="close-btn">×</button>
        </div>

        {error && <p className="error-message">Error: {error.message}</p>}

        <form onSubmit={handleSubmit} className="modal-form">
          <div className="form-section">
            <h3 className="form-section-title">Información de usuario</h3>
            <div className="form-grid">
              <div className="form-group">
                <label htmlFor="username">Nombre de usuario</label>
                <input
                  id="username"
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  placeholder="Ingresa el nombre de usuario"
                  required
                  className={formErrors.username ? 'input-error' : ''}
                />
                {formErrors.username && <span className="error-text">{formErrors.username}</span>}
              </div>
              <div className="form-group">
                <label htmlFor="password">Contraseña</label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Ingresa la contraseña"
                  required
                  className={formErrors.password ? 'input-error' : ''}
                />
                {formErrors.password && <span className="error-text">{formErrors.password}</span>}
              </div>
            </div>
          </div>

          <div className="form-section">
            <h3 className="form-section-title">Información de perfil</h3>
            <div className="form-grid">
              <div className="form-group">
                <label htmlFor="firstName">Nombre</label>
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
                <label htmlFor="lastName">Apellido</label>
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
                <label htmlFor="email">Correo electrónico</label>
                <input
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
                />
              </div>
              <div className="form-group">
                <label htmlFor="skills">Habilidades (separadas por comas)</label>
                <input
                  id="skills"
                  name="skills"
                  value={formData.skills}
                  onChange={handleChange}
                  placeholder="Ingresa las habilidades"
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
                />
              </div>
            </div>
          </div>

          <div className="modal-actions">
            <button type="button" onClick={onClose} className="btn-secondary">
              Cancelar
            </button>
            <button type="submit" disabled={loading} className="btn-primary">
              {loading ? 'Creando...' : 'Crear Usuario'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateUserModal;