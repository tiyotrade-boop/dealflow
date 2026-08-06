'use client';

import { useState, useEffect } from 'react';

interface DealFlowCalculatorProps {
  onValuesChange?: (values: {
    purchasePrice: number;
    renovationBudget: number;
    holdingCosts: number;
    arv: number;
    profit: number;
    roi: number;
  }) => void;
}

export default function DealFlowCalculator({ onValuesChange }: DealFlowCalculatorProps) {
  const [purchasePrice, setPurchasePrice] = useState('');
  const [renovationBudget, setRenovationBudget] = useState('');
  const [holdingCosts, setHoldingCosts] = useState('');
  const [arv, setArv] = useState('');

  const pp = parseFloat(purchasePrice) || 0;
  const rb = parseFloat(renovationBudget) || 0;
  const hc = parseFloat(holdingCosts) || 0;
  const arvVal = parseFloat(arv) || 0;

  const totalCost = pp + rb + hc;
  const profit = arvVal - totalCost;
  const roi = totalCost > 0 ? (profit / totalCost) * 100 : 0;

  const hasValues = pp > 0 || rb > 0 || hc > 0 || arvVal > 0;

  useEffect(() => {
    if (onValuesChange) {
      onValuesChange({
        purchasePrice: pp,
        renovationBudget: rb,
        holdingCosts: hc,
        arv: arvVal,
        profit,
        roi,
      });
    }
  }, [pp, rb, hc, arvVal, profit, roi, onValuesChange]);

  const getProfitColor = () => {
    if (!hasValues) return 'text-gray-400';
    if (profit < 0) return 'text-red-600';
    if (roi < 20) return 'text-yellow-600';
    return 'text-green-600';
  };

  const formatCurrency = (value: number) =>
    new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold text-gray-800">📊 Flip Profit Calculator</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Purchase Price */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Purchase Price</label>
          <input
            type="number"
            value={purchasePrice}
            onChange={(e) => setPurchasePrice(e.target.value)}
            placeholder="e.g. 200000"
            className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            step="1000"
            min="0"
          />
          {pp > 0 && <div className="text-xs text-gray-400 mt-1">{formatCurrency(pp)}</div>}
        </div>

        {/* Renovation Budget */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Renovation Budget</label>
          <input
            type="number"
            value={renovationBudget}
            onChange={(e) => setRenovationBudget(e.target.value)}
            placeholder="e.g. 50000"
            className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            step="1000"
            min="0"
          />
          {rb > 0 && <div className="text-xs text-gray-400 mt-1">{formatCurrency(rb)}</div>}
        </div>

        {/* Holding Costs */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Holding Costs</label>
          <input
            type="number"
            value={holdingCosts}
            onChange={(e) => setHoldingCosts(e.target.value)}
            placeholder="e.g. 2000"
            className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            step="100"
            min="0"
          />
          {hc > 0 && <div className="text-xs text-gray-400 mt-1">{formatCurrency(hc)}</div>}
        </div>

        {/* After Repair Value */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">After Repair Value (ARV)</label>
          <input
            type="number"
            value={arv}
            onChange={(e) => setArv(e.target.value)}
            placeholder="e.g. 300000"
            className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            step="1000"
            min="0"
          />
          {arvVal > 0 && <div className="text-xs text-gray-400 mt-1">{formatCurrency(arvVal)}</div>}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t border-gray-200">
        <div className="bg-gray-50 p-4 rounded-lg">
          <p className="text-sm text-gray-500">Total Cost</p>
          <p className="text-xl font-bold text-gray-800">
            {hasValues ? formatCurrency(totalCost) : '—'}
          </p>
        </div>
        <div className="bg-gray-50 p-4 rounded-lg">
          <p className="text-sm text-gray-500">Profit</p>
          <p className={`text-xl font-bold ${getProfitColor()}`}>
            {hasValues ? formatCurrency(profit) : '—'}
          </p>
        </div>
        <div className="bg-gray-50 p-4 rounded-lg">
          <p className="text-sm text-gray-500">ROI</p>
          <p className={`text-xl font-bold ${getProfitColor()}`}>
            {hasValues ? `${roi.toFixed(1)}%` : '—'}
          </p>
        </div>
      </div>

      {hasValues && (
        <div className="flex items-center gap-2">
          <div className={`w-3 h-3 rounded-full ${getProfitColor().replace('text-', 'bg-')}`} />
          <span className="text-sm text-gray-600">
            {profit < 0 && '⚠️ Negative profit — reconsider this deal'}
            {profit >= 0 && roi < 20 && '📊 Low ROI — proceed with caution'}
            {roi >= 20 && '✅ Great ROI — this deal looks promising!'}
          </span>
        </div>
      )}
    </div>
  );
}