"use client";
import React from "react";
import { Profile } from "../../types/profile";

interface Props {
  profile: Profile;
  viewMode: "basic" | "full";
  onEdit: (profile: Profile) => void;
  onDelete?: (id: string) => void;
  onVerify?: (profile: Profile) => void;
  verifying?: boolean;
}

const ProfileCard: React.FC<Props> = ({ profile, viewMode, onEdit, onDelete, onVerify, verifying }) => {
  return (
    <div className="profile-card">
      <div className="card-header">
        <h3>{profile.firstName} {profile.lastName}</h3>
        <span className={`verification-badge ${profile.isVerified ? "verified" : "not-verified"}`}>
          {profile.isVerified ? "Verificado" : "No verificado"}
        </span>
      </div>

      <div className="card-body">
        <div className="profile-info">
          <p><strong>📧 Correo:</strong> {profile.email}</p>
          <p><strong>📞 Teléfono:</strong> {profile.phone || "No proporcionado"}</p>
          <p><strong>💼 Trabajo:</strong> {profile.jobTitle || "N/A"} en {profile.company || "N/A"}</p>

          {viewMode === "full" && (
            <>
              <p><strong>💰 Salario:</strong> {profile.salary ? `$${profile.salary.toLocaleString()}` : "N/A"}</p>
              <p><strong>🎂 Edad:</strong> {profile.age || "N/A"}</p>
              <p><strong>🛠️ Habilidades:</strong> {profile.skills?.join(", ") || "Ninguna"}</p>
              {profile.bio && <p><strong>📝 Biografía:</strong> {profile.bio}</p>}
            </>
          )}
        </div>

        <div className="card-footer">
          <span className="member-since">
            Miembro desde: {new Date(profile.createdAt).toLocaleDateString()}
          </span>
          <button
            className="btn-primary"
            onClick={() => onEdit(profile)}
            style={{ marginLeft: "1rem" }}
          >
            Editar
          </button>
          {onVerify && (
            <button
              className="verify-btn"
              onClick={() => onVerify(profile)}
              disabled={verifying}
              style={{ marginLeft: "0.5rem" }}
            >
              {profile.isVerified ? "✗ Desverificar" : "✓ Verificar"}
            </button>
          )}
          {onDelete && (
            <button
              className="delete-btn"
              onClick={() => onDelete(profile.id)}
              title="Eliminar perfil"
              style={{ marginLeft: "0.5rem" }}
            >
              🗑️
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfileCard;
