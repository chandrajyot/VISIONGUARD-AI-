import React, { useState, useEffect } from 'react';
import { Layers } from 'lucide-react';
import type { ProductionLineItem, ProductItem } from '../types';
import { api } from '../services/api';

export const ProductsLinesPage: React.FC = () => {
  const [lines, setLines] = useState<ProductionLineItem[]>([]);
  const [products, setProducts] = useState<ProductItem[]>([]);

  useEffect(() => {
    api.getProductionLines().then(setLines).catch(() => {});
    api.getProducts().then(setProducts).catch(() => {});
  }, []);

  return (
    <div className="space-y-6 pb-8 animate-fade-in">
      <div className="bg-navy-800 border border-navy-600 rounded-2xl p-5 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center space-x-3">
          <Layers className="w-6 h-6 text-brand-blue" />
          <div>
            <h1 className="text-xl lg:text-2xl font-extrabold text-white tracking-tight">
              Production Lines & Product Catalog
            </h1>
            <p className="text-xs text-slate-400 mt-1 font-medium">
              Configure factory conveyers, camera assignments, active SKU targets, and defect tolerance levels
            </p>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <h2 className="text-sm font-bold text-white uppercase tracking-wider">Active Factory Lines</h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {lines.map((l) => (
            <div key={l.id} className="bg-navy-800 border border-navy-600 rounded-2xl p-5 shadow-xl space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-bold text-base text-white">{l.id}</h3>
                  <p className="text-xs text-slate-400">{l.name}</p>
                </div>
                <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold border ${
                  l.status === 'Operational' ? 'bg-brand-green/10 text-brand-green border-brand-green/30' : 'bg-brand-amber/10 text-brand-amber border-brand-amber/30'
                }`}>
                  {l.status}
                </span>
              </div>

              <div className="p-3 bg-navy-850 rounded-xl border border-navy-600 space-y-2 text-xs font-mono">
                <div className="flex justify-between text-slate-400">
                  <span>Assigned Camera:</span>
                  <span className="text-brand-blue font-bold">{l.camera_id}</span>
                </div>
                <div className="flex justify-between text-slate-400">
                  <span>Active SKU:</span>
                  <span className="text-white font-bold">{l.product_sku}</span>
                </div>
                <div className="flex justify-between text-slate-400">
                  <span>Inspected Today:</span>
                  <span className="text-slate-200">{l.total_inspected_today}</span>
                </div>
                <div className="flex justify-between text-slate-400">
                  <span>Defects Today:</span>
                  <span className="text-brand-red font-bold">{l.defect_count_today}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="space-y-4 pt-4 border-t border-navy-600">
        <h2 className="text-sm font-bold text-white uppercase tracking-wider">Product SKU Specs</h2>

        <div className="bg-navy-800 border border-navy-600 rounded-2xl overflow-hidden shadow-xl">
          <table className="w-full text-left text-xs font-mono">
            <thead className="bg-navy-850 text-slate-400 uppercase text-[10px] border-b border-navy-600">
              <tr>
                <th className="p-4">SKU</th>
                <th className="p-4">Product Name</th>
                <th className="p-4">Description</th>
                <th className="p-4">Defect Tolerance</th>
                <th className="p-4">Target FPS</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-navy-600/60 text-slate-200">
              {products.map((p) => (
                <tr key={p.id} className="hover:bg-navy-750 transition-colors">
                  <td className="p-4 font-bold text-brand-blue">{p.sku}</td>
                  <td className="p-4 font-bold text-white">{p.name}</td>
                  <td className="p-4 text-slate-400 max-w-xs truncate">{p.description}</td>
                  <td className="p-4 text-brand-amber font-bold">{p.defect_tolerance}%</td>
                  <td className="p-4 font-bold text-slate-200">{p.target_fps} FPS</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
