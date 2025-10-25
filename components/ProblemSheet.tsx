import React from 'react';
import { Document, Packer, Paragraph, TextRun, Table, TableCell, TableRow, WidthType, BorderStyle, VerticalAlign } from 'docx';
import saveAs from 'file-saver';

interface ProblemSheetProps {
  problems: string[];
}

const ProblemSheet: React.FC<ProblemSheetProps> = ({ problems }) => {
  const handleDownloadDocx = async () => {
    const tableRows: TableRow[] = [];

    const createCell = (problemText: string | undefined, index: number) => {
      if (!problemText) {
        // Return a cell with an empty paragraph to maintain table structure
        return new TableCell({ children: [new Paragraph("")] }); 
      }
      return new TableCell({
        children: [
          new Paragraph({
            children: [
              new TextRun({
                text: `${index + 1}. `,
                color: "808080", // Gray
                font: "Calibri",
                size: 24, // 12pt
              }),
              new TextRun({
                text: `${problemText} .......`,
                font: "Calibri",
                size: 24, // 12pt
                color: "000000", // Black
              }),
            ],
            spacing: { after: 100 },
            border: {
              bottom: {
                color: "D3D3D3", // Light gray
                space: 1,
                style: BorderStyle.SINGLE,
                size: 6, // 0.75pt
              },
            },
          }),
        ],
        borders: {
          top: { style: BorderStyle.NONE, size: 0, color: "FFFFFF" },
          bottom: { style: BorderStyle.NONE, size: 0, color: "FFFFFF" },
          left: { style: BorderStyle.NONE, size: 0, color: "FFFFFF" },
          right: { style: BorderStyle.NONE, size: 0, color: "FFFFFF" },
        },
        verticalAlign: VerticalAlign.CENTER,
        margins: { right: 200, left: 200 }
      });
    };

    for (let i = 0; i < problems.length; i += 2) {
      const cellLeft = createCell(problems[i], i);
      const cellRight = createCell(problems[i + 1], i + 1);
      tableRows.push(new TableRow({ children: [cellLeft, cellRight] }));
    }
    
    const doc = new Document({
        styles: {
            paragraphStyles: [{
                id: "headerStyle",
                name: "Header Style",
                run: { font: "Calibri", size: 24 },
            }]
        },
        sections: [{
            children: [
              new Paragraph({
                 text: "Họ và tên: ............................................         Ngày: ............................",
                 style: "headerStyle"
              }),
              new Paragraph({ text: " ", spacing: { after: 200 } }), // Spacer
              new Table({
                columnWidths: [4500, 4500],
                rows: tableRows,
                width: { size: 9000, type: WidthType.DXA },
                borders: {
                    top: { style: BorderStyle.NONE, size: 0, color: "FFFFFF" },
                    bottom: { style: BorderStyle.NONE, size: 0, color: "FFFFFF" },
                    left: { style: BorderStyle.NONE, size: 0, color: "FFFFFF" },
                    right: { style: BorderStyle.NONE, size: 0, color: "FFFFFF" },
                    insideHorizontal: { style: BorderStyle.NONE, size: 0, color: "FFFFFF" },
                    insideVertical: { style: BorderStyle.NONE, size: 0, color: "FFFFFF" },
                }
              }),
            ],
        }],
    });

    const blob = await Packer.toBlob(doc);
    saveAs(blob, "bai-tap-toan.docx");
  };

  return (
    <div className="mt-8 bg-white p-6 sm:p-8 rounded-xl shadow-lg border border-slate-200">
      <div className="flex justify-between items-center mb-6">
        <div className="flex flex-col sm:flex-row sm:space-x-8 text-slate-700">
          <div className="flex items-baseline mb-2 sm:mb-0">
            <span className="font-semibold mr-2">Họ và tên:</span>
            <span className="border-b-2 border-dotted border-slate-400 flex-grow min-w-[150px]"></span>
          </div>
          <div className="flex items-baseline">
            <span className="font-semibold mr-2">Ngày:</span>
            <span className="border-b-2 border-dotted border-slate-400 flex-grow min-w-[100px]"></span>
          </div>
        </div>
        <button 
          onClick={handleDownloadDocx}
          className="bg-blue-600 text-white font-bold py-2 px-4 rounded-lg shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-75 transition-all duration-200 flex items-center"
        >
          <i className="fa-solid fa-file-word mr-2"></i>
          Tải file DOCX
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-12 gap-y-4 text-lg font-mono border-t border-slate-200 pt-6">
        {problems.map((problem, index) => (
          <div key={index} className="flex items-baseline border-b border-slate-200 pb-3">
            <span className="text-slate-400 w-8 flex-shrink-0 text-right mr-2 select-none">{index + 1}.</span>
            <span className="flex-grow text-slate-800">{problem} .......</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProblemSheet;