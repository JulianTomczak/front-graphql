import { useState, useEffect } from "react";
import { UserFormData } from "../types/user";

export function useUserForm() {
  const [formData, setFormData] = useState<UserFormData>({
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

  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [calculatedAge, setCalculatedAge] = useState<number | null>(null);

  // Calcular edad
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
        type === "checkbox" ? (e.target as HTMLInputElement).checked :
        name === "isActive" ? value === "true" :
        value
    }));
    if (formErrors[name]) setFormErrors(prev => ({ ...prev, [name]: "" }));
  };

  const validateForm = () => {
    const errors: Record<string, string> = {};
    if (!formData.username.trim()) errors.username = "El nombre de usuario es obligatorio";
    if (!formData.password.trim()) errors.password = "La contraseña es obligatoria";
    if (!formData.firstName.trim()) errors.firstName = "El nombre es obligatorio";
    if (!formData.lastName.trim()) errors.lastName = "El apellido es obligatorio";
    if (!formData.email.trim()) errors.email = "El correo electrónico es obligatorio";
    if (formData.email && !/\S+@\S+\.\S+/.test(formData.email)) errors.email = "Formato de correo inválido";
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  return {
    formData,
    setFormData,
    formErrors,
    setFormErrors,
    calculatedAge,
    handleChange,
    validateForm
  };
}
