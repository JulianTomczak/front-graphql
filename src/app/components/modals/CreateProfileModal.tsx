"use client";

import React from "react";
import { useMutation } from "@apollo/client/react";
import { CREATE_PROFILE } from "../../graphql/mutations/profile";
import EditProfileForm from "../forms/EditProfileForm";
import { useProfileForm } from "../../hooks/useProfileForm";

interface CreateProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  onProfileCreated: () => void;
}

const CreateProfileModal: React.FC<CreateProfileModalProps> = ({
  isOpen,
  onClose,
  onProfileCreated,
}) => {
  const {
    formData,
    setFormData,
    formErrors,
    calculatedAge,
    setFormErrors,
    handleChange,
    validateForm,
  } = useProfileForm(null);

  const [createProfile, { loading, error }] = useMutation(CREATE_PROFILE, {
    onCompleted: () => {
      onProfileCreated();
      onClose();
      setFormData({
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        bio: "",
        birthDate: "",
        salary: "",
        company: "",
        jobTitle: "",
        skills: "",
      });
      setFormErrors({});
    },
  });

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      await createProfile({
        variables: {
          createProfileInput: {
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
            skills: formData.skills ? formData.skills.split(",").map(s => s.trim()).filter(Boolean) : undefined,
          },
        },
      });
    } catch (err: unknown) {
      if (err instanceof Error) {
        const message = err.message;
        if (message.includes("correo electrónico ya está en uso") || message.includes("llave duplicada")) {
          setFormErrors(prev => ({ ...prev, email: "El correo electrónico ya está en uso por otro perfil o usuario. Por favor, elige otro." }));
        } else {
          setFormErrors(prev => ({ ...prev, general: "Error al crear el perfil. Por favor, intenta de nuevo." }));
        }
      } else {
        console.error("Error desconocido", err);
      }
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal profile-modal">
        <div className="modal-header">
          <h2>Crear Perfil</h2>
          <button onClick={onClose} className="close-btn">×</button>
        </div>

        <EditProfileForm
          formData={formData}
          formErrors={formErrors}
          calculatedAge={calculatedAge}
          loading={loading}
          error={error}
          onChange={handleChange}
          onSubmit={handleSubmit}
          onClose={onClose}
          isCreate
        />
      </div>
    </div>
  );
};

export default CreateProfileModal;
