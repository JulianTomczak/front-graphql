"use client";

import React from "react";
import { CHECK_EMAIL } from "../../graphql/queries/profile";
import { UPDATE_PROFILE } from "../../graphql/mutations/profile";
import { Profile } from "../../types/profile";
import EditProfileForm from "../forms/EditProfileForm";
import { useProfileForm } from "../../hooks/useProfileForm";
import { useMutation, useQuery } from "@apollo/client/react";

interface EditProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  onProfileUpdated: () => void;
  profile: Profile | null;
}

const EditProfileModal: React.FC<EditProfileModalProps> = ({
  isOpen,
  onClose,
  onProfileUpdated,
  profile,
}) => {
  const {
    formData,
    formErrors,
    calculatedAge,
    setFormErrors,
    handleChange,
    validateForm,
  } = useProfileForm(profile);

  // Hook siempre al principio
  useQuery(CHECK_EMAIL, {
    variables: { email: formData.email },
    skip: !formData.email || formData.email === profile?.email,
  });

  const [updateProfile, { loading, error: mutationError }] = useMutation(UPDATE_PROFILE, {
    onCompleted: () => {
      onProfileUpdated();
      onClose();
      setFormErrors({});
    },
  });

  if (!isOpen) return null;

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      await updateProfile({
        variables: {
          id: profile.id,
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
            skills: formData.skills ? formData.skills.split(",").map(s => s.trim()).filter(Boolean) : undefined,
          },
        },
      });
    } catch (err: unknown) {
      if (err instanceof Error) {
        const message = err.message;
        if (message.includes('argument "id" of type "ID!" is required')) {
          setFormErrors(prev => ({ ...prev, general: "El ID del perfil es requerido. Por favor, intenta de nuevo." }));
        } else if (message.includes("correo electrónico ya está en uso") || message.includes("llave duplicada")) {
          setFormErrors(prev => ({ ...prev, email: "El correo electrónico ya está en uso por otro perfil o usuario. Por favor, elige otro." }));
        } else {
          setFormErrors(prev => ({ ...prev, general: "Error al actualizar el perfil. Por favor, intenta de nuevo." }));
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
          <h2>Editar Perfil</h2>
          <button onClick={onClose} className="close-btn">×</button>
        </div>

        <EditProfileForm
          formData={formData}
          formErrors={formErrors}
          calculatedAge={calculatedAge}
          loading={loading}
          error={mutationError}
          onChange={handleChange}
          onSubmit={handleSubmit}
          onClose={onClose}
        />
      </div>
    </div>
  );
};

export default EditProfileModal;
