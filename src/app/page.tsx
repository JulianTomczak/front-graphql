'use client';

import React, { useState } from 'react';
import UsersPage from './components/pages/usersPage';
import ProfilesPage from './components/pages/profilesPage';
import './globals.css';

type ViewMode = 'users' | 'profiles';

export default function HomePage() {
  const [currentView, setCurrentView] = useState<ViewMode>('users');

  return (
    <div className="app-container">
      {/* Header de Navegación */}
      <nav className="navigation">
        <div className="nav-brand">
          <h1>🚀 GraphQL Dashboard</h1>
          <p>Gestión de Usuarios y Perfiles</p>
        </div>
        
        <div className="nav-buttons">
          <button 
            className={currentView === 'users' ? 'nav-btn active' : 'nav-btn'}
            onClick={() => setCurrentView('users')}
          >
            👥 Users
          </button>
          <button 
            className={currentView === 'profiles' ? 'nav-btn active' : 'nav-btn'}
            onClick={() => setCurrentView('profiles')}
          >
            📋 Profiles
          </button>
        </div>
      </nav>

      {/* Contenido Principal */}
      <main className="main-content">
        {currentView === 'users' && <UsersPage />}
        {currentView === 'profiles' && <ProfilesPage />}
      </main>

      {/* Footer */}
      <footer className="footer">
        <p>© 2025 GraphQL Dashboard - Sistema de Gestión</p>
      </footer>
    </div>
  );
}