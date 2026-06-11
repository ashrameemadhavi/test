import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { formatCurrency, formatDate } from './formatters';

export const generateQuotationPDF = (estimation, clientInfo) => {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();

  doc.setFillColor(15, 23, 42);
  doc.rect(0, 0, pageWidth, 45, 'F');

  doc.setTextColor(255, 255, 255);
  doc.setFontSize(22);
  doc.setFont('helvetica', 'bold');
  doc.text('Smart IT Solutions', 20, 20);

  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.text('Project Cost Estimation Quotation', 20, 30);
  doc.text(`Generated: ${formatDate(new Date().toISOString())}`, 20, 38);

  doc.setTextColor(37, 99, 235);
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.text('QUOTATION', pageWidth - 20, 25, { align: 'right' });

  let y = 55;

  doc.setTextColor(15, 23, 42);
  doc.setFontSize(11);
  doc.setFont('helvetica', 'bold');
  doc.text('Client Information', 20, y);
  y += 8;

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  doc.text(`Name: ${clientInfo.client_name}`, 20, y);
  y += 6;
  doc.text(`Email: ${clientInfo.email}`, 20, y);
  y += 6;
  doc.text(`Project Type: ${estimation.project_type?.name || estimation.project_type_name}`, 20, y);
  y += 15;

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.text('Estimation Summary', 20, y);
  y += 10;

  const summaryData = [
    ['Estimated Cost', formatCurrency(estimation.total_cost)],
    ['Development Time', `${estimation.total_days} days`],
    ['Complexity', estimation.complexity],
    ['Features Selected', String(estimation.feature_count || estimation.selected_features?.length || 0)],
  ];

  autoTable(doc, {
    startY: y,
    head: [['Metric', 'Value']],
    body: summaryData,
    theme: 'striped',
    headStyles: { fillColor: [37, 99, 235] },
    margin: { left: 20, right: 20 },
  });

  y = doc.lastAutoTable.finalY + 15;

  doc.setFont('helvetica', 'bold');
  doc.text('Technology Stack', 20, y);
  y += 8;

  const stack = estimation.technology_stack || {};
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  if (stack.frontend) { doc.text(`Frontend: ${stack.frontend}`, 20, y); y += 6; }
  if (stack.backend) { doc.text(`Backend: ${stack.backend}`, 20, y); y += 6; }
  if (stack.database) { doc.text(`Database: ${stack.database}`, 20, y); y += 6; }
  if (stack.ai_service) { doc.text(`AI Service: ${stack.ai_service}`, 20, y); y += 6; }
  y += 10;

  if (estimation.cost_breakdown?.length) {
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(11);
    doc.text('Cost Breakdown', 20, y);

    autoTable(doc, {
      startY: y + 5,
      head: [['Item', 'Cost', 'Days']],
      body: estimation.cost_breakdown.map((item) => [
        item.item,
        formatCurrency(item.cost),
        String(item.days),
      ]),
      theme: 'striped',
      headStyles: { fillColor: [37, 99, 235] },
      margin: { left: 20, right: 20 },
    });
  }

  if (estimation.timeline_breakdown?.length) {
    const timelineY = doc.lastAutoTable ? doc.lastAutoTable.finalY + 15 : y + 15;

    if (timelineY > 250) doc.addPage();

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(11);
    doc.text('Timeline Breakdown', 20, timelineY > 250 ? 20 : timelineY);

    autoTable(doc, {
      startY: (timelineY > 250 ? 20 : timelineY) + 5,
      head: [['Phase', 'Days', 'Description']],
      body: estimation.timeline_breakdown.map((item) => [
        item.phase,
        String(item.days),
        item.description || '',
      ]),
      theme: 'striped',
      headStyles: { fillColor: [6, 182, 212] },
      margin: { left: 20, right: 20 },
      columnStyles: { 2: { cellWidth: 80 } },
    });
  }

  const pageCount = doc.internal.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFontSize(8);
    doc.setTextColor(100, 116, 139);
    doc.text(
      'This quotation is an estimate and subject to change based on detailed requirements.',
      pageWidth / 2,
      doc.internal.pageSize.getHeight() - 10,
      { align: 'center' }
    );
    doc.text(`Page ${i} of ${pageCount}`, pageWidth - 20, doc.internal.pageSize.getHeight() - 10, { align: 'right' });
  }

  const fileName = `SmartIT_Quotation_${clientInfo.client_name.replace(/\s+/g, '_')}_${Date.now()}.pdf`;
  doc.save(fileName);
};
