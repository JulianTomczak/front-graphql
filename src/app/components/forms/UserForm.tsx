"use client";

import React from "react";
import { UserFormData } from "../../types/user";

interface UserFormProps {
  formData: UserFormData;
  formErrors: Record<string, string>;
  calculatedAge: number | null;
  handleChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => void;
}

const UserForm: React.FC<UserFormProps> = ({
  formData,
  formErrors,
  calculatedAge,
  handleChange,
}) => {
  return (
    <>
      {/* Sección Usuario */}
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
              className={formErrors.username ? "input-error" : ""}
            />
            {formErrors.username && (
              <span className="error-text">{formErrors.username}</span>
            )}
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
              className={formErrors.password ? "input-error" : ""}
            />
            {formErrors.password && (
              <span className="error-text">{formErrors.password}</span>
            )}
          </div>
        </div>
      </div>

      {/* Sección Perfil */}
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
              className={formErrors.firstName ? "input-error" : ""}
            />
            {formErrors.firstName && (
              <span className="error-text">{formErrors.firstName}</span>
            )}
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
              className={formErrors.lastName ? "input-error" : ""}
            />
            {formErrors.lastName && (
              <span className="error-text">{formErrors.lastName}</span>
            )}
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
              className={formErrors.email ? "input-error" : ""}
            />
            {formErrors.email && (
              <span className="error-text">{formErrors.email}</span>
            )}
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
            {calculatedAge !== null && (
              <span className="age-display">Edad: {calculatedAge}</span>
            )}
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
    </>
  );
};

export default UserForm;
