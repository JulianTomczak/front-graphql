"use client";

import React from "react";
import { useMutation } from "@apollo/client/react";
import { CREATE_USER } from "../../graphql/mutations/user";
import { useUserForm } from "../../hooks/useUserForm";
import UserForm from "../forms/UserForm";

interface CreateUserModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUserCreated: () => void;
}

const CreateUserModal: React.FC<CreateUserModalProps> = ({ isOpen, onClose, onUserCreated }) => {
  const { formData, setFormData, formErrors, setFormErrors, calculatedAge, handleChange, validateForm } = useUserForm();

  const [createUser, { loading, error }] = useMutation(CREATE_USER, {
    onCompleted: () => {
      onUserCreated();
      onClose();
      setFormData({
        username: "",
        password: "",
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        bio: "",
        birthDate: "",
        salary: "",
        company: "",
        jobTitle: "",
        skills: ""
      });
      setFormErrors({});
    }
  });

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
              skills: formData.skills ? formData.skills.split(",").map(s => s.trim()) : undefined
            }
          }
        }
      });
    } catch (err) {
      console.error("Error al crear usuario:", err);
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
          <UserForm
            formData={formData}
            formErrors={formErrors}
            calculatedAge={calculatedAge}
            handleChange={handleChange}
          />
          <div className="modal-actions">
            <button type="button" onClick={onClose} className="btn-secondary">
              Cancelar
            </button>
            <button type="submit" disabled={loading} className="btn-primary">
              {loading ? "Creando..." : "Crear Usuario"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateUserModal;
