'use client';

import React, { useState } from 'react';
import { Service, SortOption } from '@/lib/types';
import ServiceCard from './ServiceCard';
import { Search } from 'lucide-react';

interface ServiceListProps {
  services: Service[];
  onToggleItem: (serviceId: string, itemId: string) => void;
  onDeleteService: (serviceId: string) => void;
  onUpdateService: (serviceId: string, updates: Partial<Service>) => void;
}

export default function ServiceList({
  services,
  onToggleItem,
  onDeleteService,
  onUpdateService,
}: ServiceListProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState<SortOption>('date-desc');
  const [filterStatus, setFilterStatus] = useState<'all' | 'pending' | 'completed'>('all');

  const filteredServices = services.filter(service => {
    const matchesSearch =
      (service.clientName?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
      (service.vehiclePlate?.toLowerCase() || '').includes(searchTerm.toLowerCase());

    const completedItems = service.items?.filter(item => item.completed).length || 0;
    const totalItems = service.items?.length || 0;

    const matchesStatus =
      filterStatus === 'all' ||
      (filterStatus === 'completed' && completedItems === totalItems) ||
      (filterStatus === 'pending' && completedItems < totalItems);

    return matchesSearch && matchesStatus;
  });

  const sortedServices = [...filteredServices].sort((a, b) => {
    switch (sortBy) {
      case 'date-desc':
        return new Date(b.date).getTime() - new Date(a.date).getTime();
      case 'date-asc':
        return new Date(a.date).getTime() - new Date(b.date).getTime();
      case 'name-asc':
        return (a.clientName || '').localeCompare(b.clientName || '');
      case 'name-desc':
        return (b.clientName || '').localeCompare(a.clientName || '');
      default:
        return 0;
    }
  });

  if (services.length === 0) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-12 text-center">
        <div className="bg-blue-50 rounded-lg p-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Nenhum serviço ainda</h2>
          <p className="text-gray-600">Clique em "Novo Serviço" para começar um novo checklist</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 pb-8">
      {/* Filtros e Busca */}
      <div className="mb-6 space-y-4">
        <div className="flex flex-col md:flex-row gap-4">
          {/* Search */}
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Buscar por cliente ou placa..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* Sort */}
          <select
            value={sortBy}
            onChange={e => setSortBy(e.target.value as SortOption)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="date-desc">Mais Recentes</option>
            <option value="date-asc">Mais Antigos</option>
            <option value="name-asc">Cliente (A-Z)</option>
            <option value="name-desc">Cliente (Z-A)</option>
          </select>

          {/* Filter */}
          <select
            value={filterStatus}
            onChange={e => setFilterStatus(e.target.value as typeof filterStatus)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="all">Todos</option>
            <option value="pending">Pendentes</option>
            <option value="completed">Concluídos</option>
          </select>
        </div>

        {/* Stats */}
        <div className="flex gap-4 text-sm flex-wrap">
          <div className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full font-semibold">
            Total: {services.length}
          </div>
          <div className="bg-green-100 text-green-800 px-3 py-1 rounded-full font-semibold">
            Concluídos:{' '}
            {services.filter(
              s => s.items.filter(i => i.completed).length === s.items.length
            ).length}
          </div>
          <div className="bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full font-semibold">
            Pendentes:{' '}
            {services.filter(
              s => s.items.filter(i => i.completed).length < s.items.length
            ).length}
          </div>
        </div>
      </div>

      {/* Results */}
      {sortedServices.length === 0 ? (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 text-center text-yellow-800">
          Nenhum resultado encontrado para sua busca.
        </div>
      ) : (
        <div className="space-y-4">
          {sortedServices.map(service => (
            <ServiceCard
              key={service.id}
              service={service}
              onToggleItem={itemId => onToggleItem(service.id, itemId)}
              onDelete={() => onDeleteService(service.id)}
              onUpdate={updates => onUpdateService(service.id, updates)}
            />
          ))}
        </div>
      )}
    </div>
  );
}
