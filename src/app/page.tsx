'use client';

import React, { useState } from 'react';
import { useQuery } from '@apollo/client/react';
import UsersPage from './components/pages/usersPage';
import ProfilesPage from './components/pages/profilesPage';
import { GET_HELLO, GET_GREETING } from './graphql/queries/user';
import './globals.css';

type ViewMode = 'users' | 'profiles';

export default function HomePage() {
  const [currentView, setCurrentView] = useState<ViewMode>('users');
  const [name, setName] = useState('');
  const [greeted, setGreeted] = useState(false);

  const { data: helloData, loading: helloLoading } = useQuery<{ hello: string }>(GET_HELLO);

  const { data: greetingData, loading: greetingLoading, error: greetingError } = useQuery<{
    greeting: string;
  }>(GET_GREETING, {
    variables: { name },
    skip: !greeted || !name.trim(),
  });

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
        <div className="greeting-section">
          <div className="greeting-hello">
            {helloLoading ? (
              <span>Cargando saludo...</span>
            ) : (
              <span>{helloData?.hello}</span>
            )}
          </div>
          <div className="greeting-form">
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Ingresa tu nombre para saludar"
              className="search-input"
            />
            <button
              className="btn-primary"
              onClick={() => setGreeted(true)}
              disabled={!name.trim()}
            >
              Saludar
            </button>
            {greetingLoading && <span className="greeting-result">Cargando...</span>}
            {greetingError && <span className="greeting-result error-text">{greetingError.message}</span>}
            {!greetingLoading && !greetingError && greetingData && (
              <span className="greeting-result">{greetingData.greeting}</span>
            )}
          </div>
        </div>

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