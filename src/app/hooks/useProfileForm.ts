"use client";

import { useState, useEffect } from "react";
import { Profile } from "../types/profile";

export const useProfileForm = (profile: Profile | null) => {
  const [formData, setFormData] = useState({
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

  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [calculatedAge, setCalculatedAge] = useState<number | null>(null);

  useEffect(() => {
    if (profile) {
      setFormData({
        firstName: profile.firstName || "",
        lastName: profile.lastName || "",
        email: profile.email || "",
        phone: profile.phone || "",
        bio: profile.bio || "",
        birthDate: profile.birthDate
          ? new Date(profile.birthDate).toISOString().split("T")[0]
          : "",
        salary: profile.salary ? profile.salary.toString() : "",
        company: profile.company || "",
        jobTitle: profile.jobTitle || "",
        skills: profile.skills ? profile.skills.join(", ") : "",
      });
      setCalculatedAge(profile.age || null);
    }
  }, [profile]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (formErrors[name]) setFormErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const validateForm = () => {
    const errors: Record<string, string> = {};
    if (!formData.firstName.trim())
      errors.firstName = "El nombre es obligatorio";
    if (!formData.lastName.trim())
      errors.lastName = "El apellido es obligatorio";
    if (!formData.email.trim())
      errors.email = "El correo electrónico es obligatorio";
    if (formData.email && !/\S+@\S+\.\S+/.test(formData.email))
      errors.email = "Formato de correo inválido";
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  return {
    formData,
    formErrors,
    calculatedAge,
    setFormErrors,
    handleChange,
    validateForm,
  };
};
