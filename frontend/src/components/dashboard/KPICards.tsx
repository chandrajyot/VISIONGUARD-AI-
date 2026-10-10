import React from 'react';
import { Package, AlertTriangle, Percent, TrendingUp, TrendingDown, CheckCircle2 } from 'lucide-react';
import type { AnalyticsSummary } from '../../types';

interface KPICardsProps {
  data: AnalyticsSummary | null;
}

export const KPICards: React.FC<KPICardsProps> = ({ data }) => {
  const totalInspected = data?.total_inspected ?? 1248;
  const totalDefects = data?.total_defects ?? 87;
  const defectRate = data?.defect_rate ?? 6.97;
  const firstPassYield = data?.first_pass_yield ?? 93.03;

  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
      {/* 1. Products Inspected */}
      <div className="bg-[#0F192C] border border-[#1A2A47] rounded-xl p-3 flex flex-col justify-between shadow-md">
        <div className="w-7 h-7 rounded-lg bg-[#152238] border border-[#23324D] flex items-center justify-center mb-2">
          <Package className="w-3.5 h-3.5 text-blue-400" />
        </div>
        <div>
          <h2 className="text-lg font-black text-white font-mono tracking-tight">{totalInspected.toLocaleString()}</h2>
          <p className="text-[10px] text-slate-400 font-medium leading-tight mt-0.5">Products Inspected</p>
          <div className="flex items-center space-x-0.5 text-[10px] font-bold text-[#10B981] mt-1">
            <TrendingUp className="w-3 h-3" />
            <span>+12%</span>
          </div>
        </div>
      </div>

      {/* 2. Defective Products */}
      <div className="bg-[#0F192C] border border-[#1A2A47] rounded-xl p-3 flex flex-col justify-between shadow-md">
        <div className="w-7 h-7 rounded-lg bg-[#28151E] border border-[#451B27] flex items-center justify-center mb-2">
          <AlertTriangle className="w-3.5 h-3.5 text-red-400" />
        </div>
        <div>
          <h2 className="text-lg font-black text-white font-mono tracking-tight">{totalDefects}</h2>
          <p className="text-[10px] text-slate-400 font-medium leading-tight mt-0.5">Defective Products</p>
          <div className="flex items-center space-x-0.5 text-[10px] font-bold text-[#EF4444] mt-1">
            <TrendingDown className="w-3 h-3" />
            <span>+3%</span>
          </div>
        </div>
      </div>

      {/* 3. Defect Rate */}
      <div className="bg-[#0F192C] border border-[#1A2A47] rounded-xl p-3 flex flex-col justify-between shadow-md">
        <div className="w-7 h-7 rounded-lg bg-[#0E2822] border border-[#17463B] flex items-center justify-center mb-2">
          <Percent className="w-3.5 h-3.5 text-emerald-400" />
        </div>
        <div>
          <h2 className="text-lg font-black text-white font-mono tracking-tight">{defectRate}%</h2>
          <p className="text-[10px] text-slate-400 font-medium leading-tight mt-0.5">Defect Rate</p>
          <div className="flex items-center space-x-0.5 text-[10px] font-bold text-[#10B981] mt-1">
            <TrendingUp className="w-3 h-3" />
            <span>-2.1%</span>
          </div>
        </div>
      </div>

      {/* 4. First Pass Yield */}
      <div className="bg-[#0F192C] border border-[#1A2A47] rounded-xl p-3 flex flex-col justify-between shadow-md">
        <div className="w-7 h-7 rounded-lg bg-[#0E2822] border border-[#17463B] flex items-center justify-center mb-2">
          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
        </div>
        <div>
          <h2 className="text-lg font-black text-white font-mono tracking-tight">{firstPassYield}%</h2>
          <p className="text-[10px] text-slate-400 font-medium leading-tight mt-0.5">First Pass Yield</p>
          <div className="flex items-center space-x-0.5 text-[10px] font-bold text-[#10B981] mt-1">
            <TrendingUp className="w-3 h-3" />
            <span>+2.1%</span>
          </div>
        </div>
      </div>
    </div>
  );
};
