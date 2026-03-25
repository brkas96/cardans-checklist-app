import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { Service } from './types';

export async function exportServiceToPDF(service: Service) {
  try {
    const element = document.getElementById(`service-${service.id}`);
    if (!element) {
      console.error('Elemento não encontrado');
      return;
    }

    const canvas = await html2canvas(element, {
      scale: 2,
      useCORS: true,
      logging: false,
      backgroundColor: '#ffffff',
    });

    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4',
    });

    const imgWidth = 210;
    const imgHeight = (canvas.height * imgWidth) / canvas.width;
    let heightLeft = imgHeight;
    let position = 0;

    pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
    heightLeft -= 297;

    while (heightLeft >= 0) {
      position = heightLeft - imgHeight;
      pdf.addPage();
      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= 297;
    }

    pdf.save(`${service.clientName}-${service.date}.pdf`);
  } catch (error) {
    console.error('Erro ao exportar PDF:', error);
  }
}

export function generateServiceSummaryPDF(services: Service[]) {
  const pdf = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  const pageWidth = pdf.internal.pageSize.getWidth();
  const pageHeight = pdf.internal.pageSize.getHeight();
  let yPosition = 15;
  const margin = 10;

  pdf.setFontSize(18);
  pdf.text('Relatório de Serviços - Cardans', margin, yPosition);
  yPosition += 10;

  pdf.setFontSize(10);
  pdf.setTextColor(100);
  pdf.text(`Gerado em: ${new Date().toLocaleString('pt-BR')}`, margin, yPosition);
  yPosition += 8;

  pdf.setDrawColor(0);
  pdf.line(margin, yPosition, pageWidth - margin, yPosition);
  yPosition += 8;

  pdf.setTextColor(0);
  pdf.setFontSize(12);
  const totalServices = services.length;
  const totalItems = services.reduce((sum, s) => sum + s.items.length, 0);
  const completedItems = services.reduce(
    (sum, s) => sum + s.items.filter(i => i.completed).length,
    0
  );
  const completionPercentage =
    totalItems > 0 ? ((completedItems / totalItems) * 100).toFixed(1) : 0;

  pdf.text(`Total de Serviços: ${totalServices}`, margin, yPosition);
  yPosition += 6;
  pdf.text(`Total de Itens: ${totalItems}`, margin, yPosition);
  yPosition += 6;
  pdf.text(`Itens Concluídos: ${completedItems} (${completionPercentage}%)`, margin, yPosition);
  yPosition += 10;

  services.forEach((service, index) => {
    if (yPosition > pageHeight - 20) {
      pdf.addPage();
      yPosition = 15;
    }

    pdf.setFontSize(11);
    pdf.setTextColor(0, 102, 204);
    pdf.text(`${index + 1}. ${service.clientName}`, margin, yPosition);
    yPosition += 6;

    pdf.setFontSize(9);
    pdf.setTextColor(80);
    pdf.text(`Placa: ${service.vehiclePlate}`, margin + 5, yPosition);
    yPosition += 4;
    pdf.text(`Data: ${new Date(service.date).toLocaleDateString('pt-BR')}`, margin + 5, yPosition);
    yPosition += 4;

    const completedCount = service.items.filter(i => i.completed).length;
    const totalCount = service.items.length;
    pdf.text(
      `Progresso: ${completedCount}/${totalCount} (${
        totalCount > 0 ? ((completedCount / totalCount) * 100).toFixed(0) : 0
      }%)`,
      margin + 5,
      yPosition
    );
    yPosition += 4;

    const completedItemsList = service.items
      .filter(item => item.completed && item.label)
      .map(item => `✓ ${item.label}`)
      .join(', ');

    if (completedItemsList) {
      pdf.setTextColor(70);
      const splitText = pdf.splitTextToSize(
        `Concluídos: ${completedItemsList}`,
        pageWidth - margin * 2 - 10
      );
      pdf.text(splitText, margin + 5, yPosition);
      yPosition += splitText.length * 3 + 2;
    }

    if (service.notes) {
      pdf.setTextColor(100);
      const notesText = pdf.splitTextToSize(`Notas: ${service.notes}`, pageWidth - margin * 2 - 10);
      pdf.text(notesText, margin + 5, yPosition);
      yPosition += notesText.length * 3 + 2;
    }

    yPosition += 6;
  });

  pdf.save(`cardans-relatorio-${Date.now()}.pdf`);
}
