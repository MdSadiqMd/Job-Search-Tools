import jsPDF from 'jspdf';

import { stripHtmlTags } from '.';

const handleDownloadPDF = (text: string): any => {
    const cleanedCoverLetter = stripHtmlTags(text);
    const pdf = new jsPDF();
    const margin = 10;
    const pageWidth = pdf.internal.pageSize.width - 2 * margin;
    const lineHeight = 10;
    const textLines = pdf.splitTextToSize(cleanedCoverLetter, pageWidth);
    const pageHeight = pdf.internal.pageSize.height - 2 * margin;
    let y = margin;

    textLines.forEach((line: any) => {
        if (y + lineHeight > pageHeight) {
            pdf.addPage();
            y = margin;
        }
        pdf.text(line, margin, y);
        y += lineHeight;
    });

    pdf.save('cover_letter.pdf');
};

export {
    stripHtmlTags,
    handleDownloadPDF
};