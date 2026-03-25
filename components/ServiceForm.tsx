'use client';

import React, { useState } from 'react';
import { Plus, X } from 'lucide-react';
import { ServiceItem } from '@/lib/types';

const DEFAULT_ITEMS = [
  'Troca do Garfo',
  'Troca da Cruzeta',
  'Troca da Ponteira',
  'Troca da Flange',
  'Mão de Obra',
];

interface ServiceFormProps {
  onAdd: (
    clientName: string,
    vehiclePlate: string,
    paymentMethod: 'dinheiro' | 'debito' | 'credito' | 'pix' | 'outro',
    totalValue: number,
    items: ServiceItem[]
  ) => void;
}

interface FormItem extends ServiceItem {
  isCustom?: boolean;
}

export default function ServiceForm({ onAdd }: ServiceFormProps) {
  const [isOpen, setIsOpen] = useState(false);
  
  // Dados do cliente
  const [clientName, setClientName] = useState('');
  const [vehiclePlate, setVehiclePlate] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<'dinheiro' | 'debito' | 'credito' | 'pix' | 'outro'>('dinheiro');
  const [totalValue, setTotalValue] = useState('');
  
  // Itens com quantidade e valor
  const [items, setItems] = useState<FormItem[]>(
    DEFAULT_ITEMS.map(label => ({
      id: `${Date.now()}-${Math.random()}`,
      label,
      quantity: 0,
      unitValue: 0,
      completed: false,
    }))
  );
  
  const [customItemName, setCustomItemName] = useState('');
  const [customItemQty, setCustomItemQty] = useState('');
  const [customItemValue, setCustomItemValue] = useState('');

  const handleAddCustomItem = () => {
    if (customItemName.trim() && customItemQty && customItemValue) {
      const newItem: FormItem = {
        id: `${Date.now()}-${Math.random()}`,
        label: customItemName,
        quantity: parseFloat(customItemQty),
        unitValue: parseFloat(customItemValue),
        completed: false,
        isCustom: true,
      };
      setItems([...items, newItem]);
      setCustomItemName('');
      setCustomItemQty('');
      setCustomItemValue('');
    }
  };

  const handleUpdateItem = (id: string, field: 'quantity' | 'unitValue', value: string) => {
    setItems(items.map(item =>
      item.id === id
        ? { ...item, [field]: value ? parseFloat(value) : 0 }
        : item
    ));
  };

  const handleRemoveItem = (id: string) => {
    setItems(items.filter(item => item.id !== id));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!clientName.trim() || !vehiclePlate.trim() || !totalValue) {
      alert('Preencha todos os campos obrigatórios');
      return;
    }

    const itemsWithValues: ServiceItem[] = items.map(item => ({
      id: item.id,
      label: item.label,
      quantity: item.quantity,
      unitValue: item.unitValue,
      completed: false,
    }));

    await onAdd(
      clientName,
      vehiclePlate,
      paymentMethod,
      parseFloat(totalValue),
      itemsWithValues
    );

    // Reset
    setClientName('');
    setVehiclePlate('');
    setPaymentMethod('dinheiro');
    setTotalValue('');
    setItems(DEFAULT_ITEMS.map(label => ({
      id: `${Date.now()}-${Math.random()}`,
      label,
      quantity: 0,
      unitValue: 0,
      completed: false,
    })));
    setIsOpen(false);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 mb-8">
      {isOpen ? (
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-2xl font-bold mb-6 text-gray-800">Novo Serviço</h2>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Seção: Informações do Cliente */}
            <div className="bg-blue-50 rounded-lg p-4 space-y-4">
              <h3 className="font-semibold text-gray-800 text-lg">Informações do Cliente</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Nome do Cliente *
                  </label>
                  <input
                    type="text"
                    value={clientName}
                    onChange={e => setClientName(e.target.value)}
                    placeholder="Ex: João Silva"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Placa do Veículo *
                  </label>
                  <input
                    type="text"
                    value={vehiclePlate}
                    onChange={e => setVehiclePlate(e.target.value.toUpperCase())}
                    placeholder="Ex: ABC-1234"
                    maxLength={8}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Data de Serviço
                  </label>
                  <input
                    type="text"
                    value={new Date().toLocaleDateString('pt-BR')}
                    disabled
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-100 text-gray-600"
                  />
                  <span className="text-xs text-gray-500">Data preenchida automaticamente</span>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Forma de Pagamento *
                  </label>
                  <select
                    value={paymentMethod}
                    onChange={e => setPaymentMethod(e.target.value as any)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="dinheiro">Dinheiro</option>
                    <option value="debito">Débito</option>
                    <option value="credito">Crédito</option>
                    <option value="pix">PIX</option>
                    <option value="outro">Outro</option>
                  </select>
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Valor Total do Serviço *
                  </label>
                  <div className="flex items-center">
                    <span className="text-gray-600 mr-2 text-lg font-semibold">R$</span>
                    <input
                      type="number"
                      step="0.01"
                      value={totalValue}
                      onChange={e => setTotalValue(e.target.value)}
                      placeholder="0.00"
                      className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Seção: Itens de Serviço */}
            <div className="bg-green-50 rounded-lg p-4">
              <h3 className="font-semibold text-gray-800 text-lg mb-4">Itens do Serviço</h3>
              
              <div className="space-y-3 mb-4">
                {items.map(item => (
                  <div key={item.id} className="flex gap-2 items-center bg-white p-3 rounded border border-gray-200">
                    <div className="flex-1">
                      <p className="font-medium text-gray-700">{item.label}</p>
                    </div>
                    
                    <div className="flex gap-2 items-center">
                      <input
                        type="number"
                        step="0.1"
                        min="0"
                        value={item.quantity || ''}
                        onChange={e => handleUpdateItem(item.id, 'quantity', e.target.value)}
                        placeholder="Qtd"
                        className="w-20 px-2 py-1 border border-gray-300 rounded text-sm"
                      />
                      <span className="text-gray-500 text-sm">x</span>
                      <div className="flex items-center">
                        <span className="text-gray-600 text-sm">R$</span>
                        <input
                          type="number"
                          step="0.01"
                          min="0"
                          value={item.unitValue || ''}
                          onChange={e => handleUpdateItem(item.id, 'unitValue', e.target.value)}
                          placeholder="Valor"
                          className="w-24 px-2 py-1 border border-gray-300 rounded text-sm ml-1"
                        />
                      </div>
                      {item.isCustom && (
                        <button
                          type="button"
                          onClick={() => handleRemoveItem(item.id)}
                          className="text-red-500 hover:text-red-700 transition"
                        >
                          <X size={18} />
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {/* Adicionar item customizado */}
              <div className="bg-white p-4 rounded border border-gray-200 space-y-3">
                <p className="font-medium text-gray-700">Adicionar Item Personalizado</p>
                <div className="flex gap-2 flex-wrap">
                  <input
                    type="text"
                    value={customItemName}
                    onChange={e => setCustomItemName(e.target.value)}
                    placeholder="Nome do item"
                    className="flex-1 min-w-32 px-3 py-2 border border-gray-300 rounded text-sm"
                  />
                  
                  <input
                    type="number"
                    step="0.1"
                    min="0"
                    value={customItemQty}
                    onChange={e => setCustomItemQty(e.target.value)}
                    placeholder="Qtd"
                    className="w-20 px-3 py-2 border border-gray-300 rounded text-sm"
                  />
                  
                  <div className="flex items-center border border-gray-300 rounded px-2">
                    <span className="text-gray-600 text-sm">R$</span>
                    <input
                      type="number"
                      step="0.01"
                      min="0"
                      value={customItemValue}
                      onChange={e => setCustomItemValue(e.target.value)}
                      placeholder="Valor"
                      className="w-24 px-2 py-2 border-none text-sm outline-none"
                    />
                  </div>
                  
                  <button
                    type="button"
                    onClick={handleAddCustomItem}
                    className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded text-sm font-semibold transition flex items-center gap-1"
                  >
                    <Plus size={16} />
                    Adicionar
                  </button>
                </div>
              </div>
            </div>

            {/* Botões */}
            <div className="flex gap-3 pt-4">
              <button
                type="submit"
                className="flex-1 bg-green-500 hover:bg-green-600 text-white py-3 rounded-lg font-semibold transition"
              >
                Criar Serviço
              </button>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-800 py-3 rounded-lg font-semibold transition"
              >
                Cancelar
              </button>
            </div>
          </form>
        </div>
      ) : (
        <button
          onClick={() => setIsOpen(true)}
          className="w-full md:w-auto bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold flex items-center gap-2 justify-center transition shadow-md"
        >
          <Plus size={20} />
          Novo Serviço
        </button>
      )}
    </div>
  );
}
