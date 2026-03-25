'use client';

import React, { useState } from 'react';
import { Service } from '@/lib/types';
import { Check, Trash2, Edit2, FileText } from 'lucide-react';
import { exportServiceToPDF } from '@/lib/pdfExport';

interface ServiceCardProps {
  service: Service;
  onToggleItem: (itemId: string) => void;
  onDelete: () => void;
  onUpdate: (updates: Partial<Service>) => void;
}

export default function ServiceCard({
  service,
  onToggleItem,
  onDelete,
  onUpdate,
}: ServiceCardProps) {
  const [isEditingNotes, setIsEditingNotes] = useState(false);
  const [notes, setNotes] = useState(service.notes);

  const completedItems = (service.items || []).filter(item => item.completed).length;
  const totalItems = (service.items || []).length;
  const progressPercentage = totalItems > 0 ? (completedItems / totalItems) * 100 : 0;
  const isCompleted = completedItems === totalItems;

  const totalServiceValue = (service.items || []).reduce(
    (sum, item) => sum + ((item.quantity || 0) * (item.unitValue || 0)),
    0
  );

  const handleSaveNotes = () => {
    onUpdate({ notes });
    setIsEditingNotes(false);
  };

  const handleExportPDF = async () => {
    await exportServiceToPDF(service);
  };

  const paymentMethodLabel = {
    dinheiro: '💵 Dinheiro',
    debito: '💳 Débito',
    credito: '💳 Crédito',
    pix: '📱 PIX',
    outro: '❓ Outro',
  };

  return (
    <div
      id={`service-${service.id}`}
      className={`bg-white rounded-lg shadow-md border-l-4 overflow-hidden transition ${
        isCompleted ? 'border-green-500' : 'border-blue-500'
      }`}
    >
      {/* Header com Informações do Cliente */}
      <div className="bg-gradient-to-r from-gray-50 to-gray-100 px-6 py-4 border-b">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h3 className="text-xl font-bold text-gray-800">{service.clientName || 'Cliente sem nome'}</h3>
            <div className="grid grid-cols-2 gap-4 mt-2 text-sm">
              <div>
                <span className="text-gray-500">Placa:</span>
                <p className="font-semibold text-gray-800">{service.vehiclePlate || '-'}</p>
              </div>
              <div>
                <span className="text-gray-500">Data:</span>
                <p className="font-semibold text-gray-800">
                  {new Date(service.date).toLocaleDateString('pt-BR')}
                </p>
              </div>
              <div>
                <span className="text-gray-500">Pagamento:</span>
                <p className="font-semibold text-gray-800">
                  {paymentMethodLabel[service.paymentMethod] || '❓ Não especificado'}
                </p>
              </div>
              <div>
                <span className="text-gray-500">Valor Total:</span>
                <p className="font-bold text-green-600">
                  R$ {(service.totalValue || totalServiceValue).toLocaleString('pt-BR', {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}
                </p>
              </div>
            </div>
          </div>
          
          <div className="flex gap-2">
            <button
              onClick={handleExportPDF}
              className="flex items-center gap-1 bg-orange-500 hover:bg-orange-600 text-white px-3 py-2 rounded text-sm transition"
              title="Exportar como PDF"
            >
              <FileText size={16} />
              PDF
            </button>
            <button
              onClick={onDelete}
              className="flex items-center gap-1 bg-red-500 hover:bg-red-600 text-white px-3 py-2 rounded text-sm transition"
              title="Deletar serviço"
            >
              <Trash2 size={16} />
              Deletar
            </button>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mt-4">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-semibold text-gray-700">Progresso</span>
            <span className="text-sm font-bold text-gray-800">
              {completedItems}/{totalItems} ({progressPercentage.toFixed(0)}%)
            </span>
          </div>
          <div className="w-full bg-gray-300 rounded-full h-2 overflow-hidden">
            <div
              className="bg-green-500 h-full transition-all duration-300"
              style={{ width: `${progressPercentage}%` }}
            />
          </div>
        </div>
      </div>

      {/* Itens do Serviço com Valores */}
      <div className="px-6 py-4 space-y-2">
        <h4 className="font-semibold text-gray-700 mb-3">Itens do Serviço</h4>
        {service.items.map(item => (
          <div key={item.id} className="flex items-center gap-3 p-3 rounded hover:bg-gray-50 transition">
            <input
              type="checkbox"
              checked={item.completed}
              onChange={() => onToggleItem(item.id)}
              className="w-5 h-5 rounded border-gray-300 text-green-600 cursor-pointer"
            />
            <div className="flex-1">
              <span
                className={`block font-medium ${
                  item.completed ? 'line-through text-gray-400' : 'text-gray-700'
                }`}
              >
                {item.label}
              </span>
              <span className="text-sm text-gray-500">
                {(item.quantity || 0)}x R$ {(item.unitValue || 0).toLocaleString('pt-BR', {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })} = R$ {(((item.quantity || 0) * (item.unitValue || 0))).toLocaleString('pt-BR', {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}
              </span>
            </div>
            {item.completed && <Check size={18} className="text-green-600" />}
          </div>
        ))}
        
        {/* Resumo de Valores */}
        <div className="mt-4 p-3 bg-blue-50 rounded border border-blue-200">
          <div className="flex justify-between items-center">
            <span className="font-semibold text-gray-700">Total de Peças:</span>
            <span className="font-bold text-blue-600">
              R$ {totalServiceValue.toLocaleString('pt-BR', {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}
            </span>
          </div>
        </div>
      </div>

      {/* Notes Section */}
      <div className="px-6 py-4 bg-gray-50 border-t">
        {isEditingNotes ? (
          <div className="space-y-2">
            <textarea
              value={notes}
              onChange={e => setNotes(e.target.value)}
              placeholder="Adicione notas sobre este serviço..."
              className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              rows={3}
            />
            <div className="flex gap-2">
              <button
                onClick={handleSaveNotes}
                className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded text-sm transition"
              >
                Salvar
              </button>
              <button
                onClick={() => {
                  setNotes(service.notes);
                  setIsEditingNotes(false);
                }}
                className="bg-gray-400 hover:bg-gray-500 text-white px-3 py-1 rounded text-sm transition"
              >
                Cancelar
              </button>
            </div>
          </div>
        ) : (
          <div
            onClick={() => setIsEditingNotes(true)}
            className="flex items-start justify-between gap-2 cursor-pointer"
          >
            <div className="flex-1">
              <p className="text-sm font-semibold text-gray-700 mb-1">Notas</p>
              <p className={notes ? 'text-gray-700' : 'text-gray-400 italic'}>
                {notes || 'Clique para adicionar notas...'}
              </p>
            </div>
            <Edit2 size={16} className="text-blue-500 mt-1" />
          </div>
        )}
      </div>
    </div>
  );
}
