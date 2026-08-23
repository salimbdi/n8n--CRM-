import React from 'react';

interface DentalChartProps {
  selectedTeeth: number[];
  onToggleTooth: (toothNumber: number) => void;
  readOnly?: boolean;
}

export const DentalChart: React.FC<DentalChartProps> = ({
  selectedTeeth,
  onToggleTooth,
  readOnly = false,
}) => {
  // Adult FDI Tooth Numbering System
  // Upper Right: 18 - 11
  // Upper Left:  21 - 28
  // Lower Right: 48 - 41
  // Lower Left:  31 - 38

  const upperRight = [18, 17, 16, 15, 14, 13, 12, 11];
  const upperLeft = [21, 22, 23, 24, 25, 26, 27, 28];
  const lowerRight = [48, 47, 46, 45, 44, 43, 42, 41];
  const lowerLeft = [31, 32, 33, 34, 35, 36, 37, 38];

  const renderTooth = (num: number, isUpper: boolean) => {
    const isSelected = selectedTeeth.includes(num);
    const isMolar = [18, 17, 16, 26, 27, 28, 48, 47, 46, 36, 37, 38].includes(num);
    const isPremolar = [15, 14, 24, 25, 45, 44, 34, 35].includes(num);

    return (
      <button
        key={num}
        type="button"
        disabled={readOnly}
        onClick={() => !readOnly && onToggleTooth(num)}
        title={`سن رقم ${num}`}
        className={`flex flex-col items-center p-1.5 rounded-lg border transition-all cursor-pointer ${
          isSelected
            ? 'bg-teal-50 border-teal-500 text-teal-800 shadow-sm ring-2 ring-teal-400/30'
            : 'bg-white border-slate-200 text-slate-700 hover:border-teal-300 hover:bg-slate-50'
        } ${readOnly ? 'cursor-default' : ''}`}
      >
        <span className="text-[10px] font-bold tracking-wider mb-1 text-slate-500">
          #{num}
        </span>
        <div
          className={`w-6 h-8 rounded-t-md flex items-center justify-center border text-[9px] font-semibold ${
            isSelected
              ? 'bg-teal-600 border-teal-700 text-white'
              : 'bg-slate-100 border-slate-300 text-slate-600'
          } ${isMolar ? 'w-8 h-8 rounded-md' : isPremolar ? 'w-7 h-8' : ''}`}
        >
          {isSelected ? '✓' : isUpper ? '▲' : '▼'}
        </div>
      </button>
    );
  };

  return (
    <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 dir-ltr">
      <div className="flex items-center justify-between mb-3 dir-rtl">
        <h4 className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-teal-500"></span>
          خريطة الأسنان التفاعلية (اختر الأسنان المتأثرة للعلاج)
        </h4>
        <div className="flex items-center gap-3 text-xs">
          <span className="flex items-center gap-1 text-slate-600">
            <span className="w-3 h-3 rounded bg-teal-600 border border-teal-700 inline-block"></span>
            محدد للعلاج
          </span>
          <span className="flex items-center gap-1 text-slate-600">
            <span className="w-3 h-3 rounded bg-slate-100 border border-slate-300 inline-block"></span>
            سليم
          </span>
        </div>
      </div>

      {/* Upper Jaw */}
      <div className="mb-4">
        <div className="text-[11px] font-semibold text-center text-slate-500 mb-1">
          الفك العلوي (Upper Arch)
        </div>
        <div className="flex justify-center gap-1 overflow-x-auto pb-1">
          <div className="flex gap-1 border-r border-slate-300 pr-1.5">
            {upperRight.map((n) => renderTooth(n, true))}
          </div>
          <div className="flex gap-1 pl-1.5">
            {upperLeft.map((n) => renderTooth(n, true))}
          </div>
        </div>
      </div>

      <div className="border-t border-dashed border-slate-300 my-2 relative">
        <span className="absolute left-1/2 -top-2.5 -translate-x-1/2 bg-slate-100 px-2 text-[10px] text-slate-400 font-medium">
          خط المنتصف
        </span>
      </div>

      {/* Lower Jaw */}
      <div className="mt-4">
        <div className="flex justify-center gap-1 overflow-x-auto pt-1">
          <div className="flex gap-1 border-r border-slate-300 pr-1.5">
            {lowerRight.map((n) => renderTooth(n, false))}
          </div>
          <div className="flex gap-1 pl-1.5">
            {lowerLeft.map((n) => renderTooth(n, false))}
          </div>
        </div>
        <div className="text-[11px] font-semibold text-center text-slate-500 mt-1">
          الفك السفلي (Lower Arch)
        </div>
      </div>

      {selectedTeeth.length > 0 && (
        <div className="mt-3 pt-2 border-t border-slate-200 flex items-center justify-between text-xs dir-rtl">
          <span className="text-slate-600 font-medium">
            الأسنان المحددة ({selectedTeeth.length}):
          </span>
          <span className="font-bold text-teal-700 bg-teal-50 px-2 py-0.5 rounded border border-teal-200">
            {selectedTeeth.sort((a, b) => a - b).join(', #')}#
          </span>
        </div>
      )}
    </div>
  );
};
