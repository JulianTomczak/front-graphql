"use client";

import React from "react";

export type ProfileFormData = {
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  bio?: string;
  birthDate?: string;
  salary?: string;
  company?: string;
  jobTitle?: string;
  skills?: string;
};

interface EditProfileFormProps {
  formData: ProfileFormData;
  formErrors: Record<string, string>;
  calculatedAge: number | null;
  loading: boolean;
  error?: Error;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  onSubmit: (e: React.FormEvent) => void;
  onClose: () => void;
}

const EditProfileForm: React.FC<EditProfileFormProps> = ({
  formData,
  formErrors,
  calculatedAge,
  loading,
  error,
  onChange,
  onSubmit,
  onClose,
}) => {
  return (
    <form onSubmit={onSubmit} className="modal-form">
      <div className="form-section">
        <h3 className="form-section-title">Información de perfil</h3>
        <div className="form-grid">
          <div className="form-group">
            <label htmlFor="firstName">Nombre *</label>
            <input
              id="firstName"
              name="firstName"
              value={formData.firstName}
              onChange={onChange}
              placeholder="Ingresa el nombre"
              required
              className={formErrors.firstName ? "input-error" : ""}
            />
            {formErrors.firstName && <span className="error-text">{formErrors.firstName}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="lastName">Apellido *</label>
            <input
              id="lastName"
              name="lastName"
              value={formData.lastName}
              onChange={onChange}
              placeholder="Ingresa el apellido"
              required
              className={formErrors.lastName ? "input-error" : ""}
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
              onChange={onChange}
              placeholder="Ingresa el correo"
              required
              className={formErrors.email ? "input-error" : ""}
            />
            {formErrors.email && <span className="error-text">{formErrors.email}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="phone">Teléfono</label>
            <input
              type="tel"
              id="phone"
              name="phone"
              value={formData.phone ?? ""}
              onChange={onChange}
              placeholder="Ingresa el número de teléfono"
            />
          </div>

          <div className="form-group">
            <label htmlFor="jobTitle">Título del puesto</label>
            <input
              id="jobTitle"
              name="jobTitle"
              value={formData.jobTitle ?? ""}
              onChange={onChange}
              placeholder="Ingresa el título del puesto"
            />
          </div>

          <div className="form-group">
            <label htmlFor="company">Empresa</label>
            <input
              id="company"
              name="company"
              value={formData.company ?? ""}
              onChange={onChange}
              placeholder="Ingresa el nombre de la empresa"
            />
          </div>

          <div className="form-group">
            <label htmlFor="birthDate">Fecha de nacimiento</label>
            <input
              type="date"
              id="birthDate"
              name="birthDate"
              value={formData.birthDate ?? ""}
              onChange={onChange}
            />
            {calculatedAge !== null && <span className="age-display">Edad: {calculatedAge}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="salary">Salario</label>
            <input
              type="number"
              id="salary"
              name="salary"
              value={formData.salary ?? ""}
              onChange={onChange}
              placeholder="Ingresa el salario"
              step="0.01"
            />
          </div>

          <div className="form-group">
            <label htmlFor="skills">Habilidades (separadas por comas)</label>
            <input
              id="skills"
              name="skills"
              value={formData.skills ?? ""}
              onChange={onChange}
              placeholder="Ej: JavaScript, React, Node.js"
            />
          </div>

          <div className="form-group full-width">
            <label htmlFor="bio">Biografía</label>
            <textarea
              id="bio"
              name="bio"
              value={formData.bio ?? ""}
              onChange={onChange}
              placeholder="Ingresa la biografía"
              rows={4}
            />
          </div>
        </div>
      </div>

      {error && <p className="error-message">Error: {error.message}</p>}
      {formErrors.general && <p className="error-message">{formErrors.general}</p>}

      <div className="modal-actions">
        <button type="button" onClick={onClose} className="btn-secondary">
          Cancelar
        </button>
        <button type="submit" disabled={loading} className="btn-primary">
          {loading ? "Actualizando..." : "Actualizar Perfil"}
        </button>
      </div>
    </form>
  );
};

export default EditProfileForm;
