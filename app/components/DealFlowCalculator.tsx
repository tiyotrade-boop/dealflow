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
  const [purchasePrice, setPurchasePrice] = useState(200000);
  const [renovationBudget, setRenovationBudget] = useState(50000);
  const [holdingCosts, setHoldingCosts] = useState(2000);
  const [arv, setArv] = useState(300000);

  const totalCost = purchasePrice + renovationBudget + holdingCosts;
  const profit = arv - totalCost;
  const roi = totalCost > 0 ? (profit / totalCost) * 100 : 0;

  useEffect(() => {
    if (onValuesChange) {
      onValuesChange({
        purchasePrice,
        renovationBudget,
        holdingCosts,
        arv,
        profit,
        roi,
      });
    }
  }, [purchasePrice, renovationBudget, holdingCosts, arv, profit, roi, onValuesChange]);

  const getProfitColor = () => {
    if (profit < 0) return 'text-red-600';
    if (roi < 20) return 'text-yellow-600';
    return 'text-green-600';
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold text-gray-800">📊 Flip Profit Calculator</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Purchase Price: {formatCurrency(purchasePrice)}
          </label>
          <input
            type="range"
            min="50000"
            max="500000"
            step="5000"
            value={purchasePrice}
            onChange={(e) => setPurchasePrice(Number(e.target.value))}
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
          />
          <div className="flex justify-between text-xs text-gray-400 mt-1">
            <span>$50k</span>
            <span>$500k</span>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Renovation Budget: {formatCurrency(renovationBudget)}
          </label>
          <input
            type="range"
            min="10000"
            max="200000"
            step="5000"
            value={renovationBudget}
            onChange={(e) => setRenovationBudget(Number(e.target.value))}
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
          />
          <div className="flex justify-between text-xs text-gray-400 mt-1">
            <span>$10k</span>
            <span>$200k</span>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Holding Costs: {formatCurrency(holdingCosts)}
          </label>
          <input
            type="range"
            min="0"
            max="10000"
            step="500"
            value={holdingCosts}
            onChange={(e) => setHoldingCosts(Number(e.target.value))}
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
          />
          <div className="flex justify-between text-xs text-gray-400 mt-1">
            <span>$0</span>
            <span>$10k</span>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            After Repair Value (ARV): {formatCurrency(arv)}
          </label>
          <input
            type="range"
            min="100000"
            max="700000"
            step="10000"
            value={arv}
            onChange={(e) => setArv(Number(e.target.value))}
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
          />
          <div className="flex justify-between text-xs text-gray-400 mt-1">
            <span>$100k</span>
            <span>$700k</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t border-gray-200">
        <div className="bg-gray-50 p-4 rounded-lg">
          <p className="text-sm text-gray-500">Total Cost</p>
          <p className="text-xl font-bold text-gray-800">{formatCurrency(totalCost)}</p>
        </div>
        <div className="bg-gray-50 p-4 rounded-lg">
          <p className="text-sm text-gray-500">Profit</p>
          <p className={`text-xl font-bold ${getProfitColor()}`}>
            {formatCurrency(profit)}
          </p>
        </div>
        <div className="bg-gray-50 p-4 rounded-lg">
          <p className="text-sm text-gray-500">ROI</p>
          <p className={`text-xl font-bold ${getProfitColor()}`}>
            {roi.toFixed(1)}%
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <div className={`w-3 h-3 rounded-full ${getProfitColor().replace('text-', 'bg-')}`} />
        <span className="text-sm text-gray-600">
          {profit < 0 && '⚠️ Negative profit — reconsider this deal'}
          {profit >= 0 && roi < 20 && '📊 Low ROI — proceed with caution'}
          {roi >= 20 && '✅ Great ROI — this deal looks promising!'}
        </span>
      </div>
    </div>
  );
}