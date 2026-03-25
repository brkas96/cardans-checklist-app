'use client';

import { useState, useEffect, useCallback } from 'react';
import { Service, ServiceItem } from './types';
import { firestore } from './firebase';
import { collection, addDoc, updateDoc, doc, deleteDoc, onSnapshot, query, orderBy } from 'firebase/firestore';

const STORAGE_KEY = 'cardans-services';

function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

// Migrate old data format to new format
function migrateService(service: any): Service {
  // If it already has clientName, it's new format
  if (service.clientName !== undefined) {
    return service as Service;
  }

  // Old format migration: convert old properties to new format
  return {
    id: service.id,
    clientName: service.name || 'Cliente sem nome',
    vehiclePlate: service.vehiclePlate || '-',
    date: service.date || new Date().toISOString().split('T')[0],
    paymentMethod: service.paymentMethod || 'outro',
    totalValue: service.totalValue || service.items?.reduce((sum: number, item: any) => sum + ((item.quantity || 0) * (item.unitValue || 0)), 0) || 0,
    items: (service.items || []).map((item: any) => ({
      id: item.id || generateId(),
      label: item.label,
      quantity: item.quantity || 0,
      unitValue: item.unitValue || 0,
      completed: item.completed || false,
    })),
    notes: service.notes || '',
  };
}

export const useServices = () => {
  const [services, setServices] = useState<Service[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    if (firestore) {
      // Use Firestore
      const q = query(collection(firestore, 'services'), orderBy('date', 'desc'));
      const unsubscribe = onSnapshot(q, (querySnapshot) => {
        const servicesData: Service[] = [];
        querySnapshot.forEach((doc) => {
          servicesData.push({ id: doc.id, ...doc.data() } as Service);
        });
        setServices(servicesData);
        setIsLoaded(true);
      });
      return () => unsubscribe();
    } else {
      // Fallback to localStorage
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        try {
          const parsed = JSON.parse(stored) as any[];
          // Migrate all services to new format
          const migratedServices = Array.isArray(parsed) ? parsed.map(migrateService) : [];
          setServices(migratedServices);
        } catch (error) {
          console.error('Erro ao carregar dados:', error);
        }
      }
      setIsLoaded(true);
    }
  }, []);

  useEffect(() => {
    if (!firestore && isLoaded) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(services));
    }
  }, [services, isLoaded]);

  const addService = useCallback(async (
    clientName: string,
    vehiclePlate: string,
    paymentMethod: 'dinheiro' | 'debito' | 'credito' | 'pix' | 'outro',
    totalValue: number,
    items: ServiceItem[]
  ) => {
    const newService: Omit<Service, 'id'> = {
      clientName,
      vehiclePlate,
      date: new Date().toISOString().split('T')[0],
      paymentMethod,
      totalValue,
      items: items.map(item => ({
        id: generateId(),
        label: item.label,
        quantity: item.quantity,
        unitValue: item.unitValue,
        completed: false,
      })),
      notes: '',
    };
    if (firestore) {
      const docRef = await addDoc(collection(firestore, 'services'), newService);
      return docRef.id;
    } else {
      const id = generateId();
      const serviceWithId = { ...newService, id };
      setServices(prev => [serviceWithId, ...prev]);
      return id;
    }
  }, []);

  const updateService = useCallback(async (id: string, updates: Partial<Service>) => {
    if (firestore) {
      await updateDoc(doc(firestore, 'services', id), updates);
    } else {
      setServices(prev =>
        prev.map(service =>
          service.id === id ? { ...service, ...updates } : service
        )
      );
    }
  }, []);

  const toggleItemCompletion = useCallback(async (serviceId: string, itemId: string) => {
    if (firestore) {
      const service = services.find(s => s.id === serviceId);
      if (service) {
        const updatedItems = service.items.map(item =>
          item.id === itemId ? { ...item, completed: !item.completed } : item
        );
        await updateDoc(doc(firestore, 'services', serviceId), { items: updatedItems });
      }
    } else {
      setServices(prev =>
        prev.map(service =>
          service.id === serviceId
            ? {
                ...service,
                items: service.items.map(item =>
                  item.id === itemId ? { ...item, completed: !item.completed } : item
                ),
              }
            : service
        )
      );
    }
  }, [services]);

  const deleteService = useCallback(async (id: string) => {
    if (firestore) {
      await deleteDoc(doc(firestore, 'services', id));
    } else {
      setServices(prev => prev.filter(service => service.id !== id));
    }
  }, []);

  const exportAsJSON = useCallback(() => {
    const dataStr = JSON.stringify(services, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `cardans-backup-${Date.now()}.json`;
    link.click();
    URL.revokeObjectURL(url);
  }, [services]);

  const importFromJSON = useCallback(async (file: File) => {
    const reader = new FileReader();
    reader.onload = (e: ProgressEvent<FileReader>) => {
      try {
        const imported = JSON.parse(e.target?.result as string);
        if (Array.isArray(imported)) {
          if (firestore) {
            // Add to Firestore
            imported.forEach(async (service) => {
              await addDoc(collection(firestore, 'services'), { ...service, id: undefined });
            });
          } else {
            setServices(prev => [...prev, ...imported.map(migrateService)]);
          }
        }
      } catch (error) {
        console.error('Erro ao importar:', error);
      }
    };
    reader.readAsText(file);
  }, []);

  return {
    services,
    isLoaded,
    addService,
    updateService,
    toggleItemCompletion,
    deleteService,
    exportAsJSON,
    importFromJSON,
  };
};
