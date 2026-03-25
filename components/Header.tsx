'use client';

import React, { useState } from 'react';
import { Download, Upload, FileText, LogOut, Users } from 'lucide-react';
import { useAuth } from '@/lib/AuthContext';

interface HeaderProps {
  onExportJSON: () => void;
  onImportJSON: (file: File) => void;
  onGenerateReport: () => void;
}

export default function Header({ onExportJSON, onImportJSON, onGenerateReport }: HeaderProps) {
  const { profile, logout } = useAuth();
  const [showUserModal, setShowUserModal] = useState(false);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onImportJSON(file);
      e.target.value = ''; // Reset input
    }
  };

  const handleLogout = async () => {
    await logout();
  };

  return (
    <header className="bg-gradient-to-r from-red-600 to-red-800 text-white shadow-lg">
      <div className="max-w-6xl mx-auto px-4 py-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold">PR Cardans</h1>
            <p className="text-blue-100 mt-1">Gerenciador de Serviços de Mecânica de Cardans</p>
          </div>

          <div className="flex gap-2 flex-wrap items-center">
            {profile?.role === 'admin' && (
              <button
                onClick={() => setShowUserModal(true)}
                className="flex items-center gap-2 bg-blue-500 hover:bg-blue-600 px-4 py-2 rounded-lg font-semibold transition"
                title="Gerenciar Usuários"
              >
                <Users size={20} />
                <span className="hidden sm:inline">Usuários</span>
              </button>
            )}

            <button
              onClick={onGenerateReport}
              className="flex items-center gap-2 bg-orange-500 hover:bg-orange-600 px-4 py-2 rounded-lg font-semibold transition"
              title="Gerar relatório em PDF"
            >
              <FileText size={20} />
              <span className="hidden sm:inline">Relatório</span>
            </button>

            <button
              onClick={onExportJSON}
              className="flex items-center gap-2 bg-green-500 hover:bg-green-600 px-4 py-2 rounded-lg font-semibold transition"
              title="Exportar como JSON"
            >
              <Download size={20} />
              <span className="hidden sm:inline">Baixar</span>
            </button>

            <label className="flex items-center gap-2 bg-purple-500 hover:bg-purple-600 px-4 py-2 rounded-lg font-semibold transition cursor-pointer">
              <Upload size={20} />
              <span className="hidden sm:inline">Importar</span>
              <input
                type="file"
                accept=".json"
                onChange={handleFileUpload}
                className="hidden"
              />
            </label>

            <button
              onClick={handleLogout}
              className="flex items-center gap-2 bg-gray-500 hover:bg-gray-600 px-4 py-2 rounded-lg font-semibold transition"
              title="Sair"
            >
              <LogOut size={20} />
              <span className="hidden sm:inline">Sair</span>
            </button>
          </div>
        </div>
      </div>

      {showUserModal && <UserManagementModal onClose={() => setShowUserModal(false)} />}
    </header>
  );
}

function UserManagementModal({ onClose }: { onClose: () => void }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<'admin' | 'user'>('user');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const { createUser } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createUser(email, password, role);
      setSuccess('Usuário criado com sucesso!');
      setEmail('');
      setPassword('');
      setRole('user');
      setError('');
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg max-w-md w-full">
        <h2 className="text-xl font-bold mb-4">Criar Novo Usuário</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 block w-full border border-gray-300 rounded-md p-2"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Senha</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 block w-full border border-gray-300 rounded-md p-2"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Função</label>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value as 'admin' | 'user')}
              className="mt-1 block w-full border border-gray-300 rounded-md p-2"
            >
              <option value="user">Usuário</option>
              <option value="admin">Administrador</option>
            </select>
          </div>
          {error && <div className="text-red-500 text-sm mb-4">{error}</div>}
          {success && <div className="text-green-500 text-sm mb-4">{success}</div>}
          <div className="flex gap-2">
            <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">
              Criar
            </button>
            <button type="button" onClick={onClose} className="bg-gray-500 text-white px-4 py-2 rounded">
              Fechar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
