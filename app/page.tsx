'use client';

import Header from '@/components/Header';
import ServiceForm from '@/components/ServiceForm';
import ServiceList from '@/components/ServiceList';
import { useServices } from '@/lib/useServices';
import { generateServiceSummaryPDF } from '@/lib/pdfExport';
import { useEffect, useState } from 'react';
import { useAuth } from '@/lib/AuthContext';
import { useRouter } from 'next/navigation';

export default function Home() {
  const { user, loading } = useAuth();
  const router = useRouter();

  const {
    services,
    isLoaded,
    addService,
    updateService,
    toggleItemCompletion,
    deleteService,
    exportAsJSON,
    importFromJSON,
  } = useServices();

  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);

  if (loading || !user) {
    return <div>Carregando...</div>;
  }

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Header
        onExportJSON={exportAsJSON}
        onImportJSON={importFromJSON}
        onGenerateReport={() => generateServiceSummaryPDF(services)}
      />

      <main className="flex-1 py-8">
        <ServiceForm onAdd={addService} />
        {isLoaded && (
          <ServiceList
            services={services}
            onToggleItem={toggleItemCompletion}
            onDeleteService={deleteService}
            onUpdateService={updateService}
          />
        )}
      </main>

      <footer className="bg-gray-800 text-gray-300 py-6 mt-12">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <p className="text-sm">
            Checklist PR Cardans © {new Date().getFullYear()} | Todos os direitos
            reservados
          </p>
          <p className="text-xs text-gray-400 mt-2">
            Seus dados são salvos localmente no navegador
          </p>
        </div>
      </footer>
    </div>
  );
}
