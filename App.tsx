import React, { useState, useCallback } from 'react';
import type { Operations } from './types';
import { generateMathProblems } from './services/geminiService';
// FIX: Corrected the import path to be relative.
import ProblemSheet from './components/ProblemSheet';

const Checkbox: React.FC<{ label: string; checked: boolean; onChange: (checked: boolean) => void }> = ({ label, checked, onChange }) => (
  <label className="flex items-center space-x-3 cursor-pointer select-none">
    <div className="relative">
      <input type="checkbox" className="sr-only" checked={checked} onChange={(e) => onChange(e.target.checked)} />
      <div className={`w-6 h-6 rounded-md border-2 transition-all duration-200 ${checked ? 'bg-sky-500 border-sky-600' : 'bg-slate-100 border-slate-300'}`}></div>
      {checked && (
        <svg className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
        </svg>
      )}
    </div>
    <span className="text-slate-700 font-medium">{label}</span>
  </label>
);


const App: React.FC = () => {
  const [minNumber, setMinNumber] = useState('1');
  const [maxNumber, setMaxNumber] = useState('100');
  const [problemCount, setProblemCount] = useState('20');
  const [numOperations, setNumOperations] = useState(1);
  const [operations, setOperations] = useState<Operations>({ add: true, subtract: true, multiply: false, divide: false });
  const [useParentheses, setUseParentheses] = useState(false);

  const [problems, setProblems] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleOperationChange = (op: keyof Operations) => {
    setOperations(prev => ({ ...prev, [op]: !prev[op] }));
  };

  const handleGenerate = useCallback(async () => {
    setError(null);

    const min = parseInt(minNumber, 10);
    const max = parseInt(maxNumber, 10);
    const count = parseInt(problemCount, 10);
    const selectedOpsCount = Object.values(operations).filter(v => v).length;

    if (isNaN(min) || isNaN(max) || isNaN(count)) {
      setError("Vui lòng nhập số hợp lệ.");
      return;
    }
    if (min < 0 || max < 0 || count <= 0) {
      setError("Các giá trị phải là số dương.");
      return;
    }
    if (min > max) {
      setError("Số bắt đầu không được lớn hơn số kết thúc.");
      return;
    }
    if (selectedOpsCount === 0) {
      setError("Vui lòng chọn ít nhất một phép tính.");
      return;
    }

    setIsLoading(true);
    setProblems([]);
    
    try {
      const generated = await generateMathProblems({
        min,
        max,
        count,
        operations,
        useParentheses,
        numOperations,
      });
      setProblems(generated);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Đã xảy ra lỗi không xác định.');
    } finally {
      setIsLoading(false);
    }
  }, [minNumber, maxNumber, problemCount, operations, useParentheses, numOperations]);

  return (
    <div className="min-h-screen bg-slate-100 font-sans text-slate-800">
      <main className="max-w-4xl mx-auto p-4 sm:p-8">
        <div className="text-center mb-8 print:hidden">
            <h1 className="text-4xl font-extrabold text-sky-700 tracking-tight">Tạo bài tập Toán</h1>
            <p className="mt-2 text-lg text-slate-600">Dành cho học sinh lớp 3</p>
        </div>

        <div className="bg-white p-6 sm:p-8 rounded-xl shadow-lg border border-slate-200 print:hidden">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
            
            <div className="space-y-4">
              <label className="block">
                <span className="font-semibold text-slate-700">Mời bạn nhập dãy số cần tính toán:</span>
                <div className="flex items-center mt-2 space-x-2">
                  <span className="text-slate-500">Từ</span>
                  <input type="number" value={minNumber} onChange={e => setMinNumber(e.target.value)} className="w-full p-2 border border-slate-300 rounded-md shadow-sm focus:ring-sky-500 focus:border-sky-500 text-center" />
                  <span className="text-slate-500">đến</span>
                  <input type="number" value={maxNumber} onChange={e => setMaxNumber(e.target.value)} className="w-full p-2 border border-slate-300 rounded-md shadow-sm focus:ring-sky-500 focus:border-sky-500 text-center" />
                </div>
              </label>
              <label className="block">
                <span className="font-semibold text-slate-700">Mời bạn nhập số lượng bài toán cần làm:</span>
                <input type="number" value={problemCount} onChange={e => setProblemCount(e.target.value)} className="mt-2 w-full p-2 border border-slate-300 rounded-md shadow-sm focus:ring-sky-500 focus:border-sky-500" />
              </label>
               <label className="block">
                <span className="font-semibold text-slate-700">Số lượng phép tính mỗi bài:</span>
                <select 
                    value={numOperations} 
                    onChange={e => setNumOperations(parseInt(e.target.value, 10))}
                    className="mt-2 w-full p-2 border border-slate-300 rounded-md shadow-sm focus:ring-sky-500 focus:border-sky-500 bg-white"
                >
                    <option value={1}>1 phép tính</option>
                    <option value={2}>2 phép tính</option>
                </select>
              </label>
            </div>

            <div className="space-y-4">
               <div>
                <span className="font-semibold text-slate-700">Mời bạn chọn các phép tính cần thực hiện:</span>
                <div className="grid grid-cols-2 gap-3 mt-2">
                    <Checkbox label="Cộng" checked={operations.add} onChange={() => handleOperationChange('add')} />
                    <Checkbox label="Trừ" checked={operations.subtract} onChange={() => handleOperationChange('subtract')} />
                    <Checkbox label="Nhân" checked={operations.multiply} onChange={() => handleOperationChange('multiply')} />
                    <Checkbox label="Chia" checked={operations.divide} onChange={() => handleOperationChange('divide')} />
                </div>
              </div>
              <div>
                <span className="font-semibold text-slate-700">Tùy chọn khác:</span>
                <div className="mt-2">
                    <Checkbox label="Có ngoặc ( )" checked={useParentheses} onChange={setUseParentheses} />
                </div>
              </div>
            </div>
          </div>
          
          <div className="mt-6 pt-6 border-t border-slate-200">
            {error && <p className="text-red-600 text-center mb-4">{error}</p>}
            <button 
              onClick={handleGenerate} 
              disabled={isLoading}
              className="w-full bg-sky-600 text-white font-bold py-3 px-4 rounded-lg shadow-md hover:bg-sky-700 disabled:bg-slate-400 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-opacity-75 transition-all duration-200 flex items-center justify-center"
            >
              {isLoading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Đang tạo...
                </>
              ) : (
                'Khởi tạo'
              )}
            </button>
          </div>
        </div>

        {problems.length > 0 && <ProblemSheet problems={problems} />}
      </main>
    </div>
  );
};

export default App;