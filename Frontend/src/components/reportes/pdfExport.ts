import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

/**
 * Exporta un elemento HTML a PDF
 * @param elementId - ID del elemento contenedor que se va a capturar
 * @param filename - Nombre del archivo PDF (sin extensión)
 */
export const exportToPDF = async (elementId: string, filename: string = 'reporte') => {
  const element = document.getElementById(elementId);
  if (!element) {
    console.error('Elemento no encontrado');
    return;
  }

  try {
    // Configuración para mejorar calidad
    const canvas = await html2canvas(element, {
      scale: 2,
      backgroundColor: '#0f172a', // fondo oscuro consistente
      logging: false,
      useCORS: true,
    });

    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4',
    });

    const imgWidth = 210; // A4 ancho en mm
    const pageHeight = 297;
    const imgHeight = (canvas.height * imgWidth) / canvas.width;
    let heightLeft = imgHeight;
    let position = 0;

    pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
    heightLeft -= pageHeight;

    while (heightLeft > 0) {
      position = heightLeft - imgHeight;
      pdf.addPage();
      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;
    }

    pdf.save(`${filename}.pdf`);
  } catch (error) {
    console.error('Error al generar PDF:', error);
  }
};