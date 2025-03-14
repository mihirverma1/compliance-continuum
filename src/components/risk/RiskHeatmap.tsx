
import React from "react";
import { RiskItem } from "./RiskRegister";

interface RiskHeatmapProps {
  risks: RiskItem[];
}

const RiskHeatmap: React.FC<RiskHeatmapProps> = ({ risks }) => {
  // Create a 4x4 grid for impact (y-axis, 1-4) and likelihood (x-axis, 0-3)
  const grid = Array(4).fill(0).map(() => Array(4).fill(0));
  
  // Count risks in each cell
  risks.forEach(risk => {
    // Adjust indices to match array indices (0-3 for both)
    const impactIndex = risk.impact - 1; // Convert from 1-4 to 0-3
    const likelihoodIndex = risk.likelihood; // Already 0-3
    
    if (impactIndex >= 0 && impactIndex < 4 && likelihoodIndex >= 0 && likelihoodIndex < 4) {
      grid[impactIndex][likelihoodIndex]++;
    }
  });
  
  // Determine cell colors based on risk level
  const getCellColor = (impact: number, likelihood: number) => {
    const riskScore = impact * likelihood;
    if (riskScore >= 9) return "bg-red-500";
    if (riskScore >= 6) return "bg-orange-400";
    if (riskScore >= 3) return "bg-yellow-300";
    return "bg-green-200";
  };

  // Row and column labels (reversed for impact to show high at top)
  const impactLabels = ["4 (Critical)", "3 (High)", "2 (Medium)", "1 (Low)"];
  const likelihoodLabels = ["0 (Rare)", "1 (Unlikely)", "2 (Possible)", "3 (Likely)"];

  return (
    <div className="bg-white p-4 rounded-lg border">
      <div className="flex">
        {/* Y-axis labels (Impact) */}
        <div className="flex flex-col justify-around pr-2 text-sm font-medium">
          {impactLabels.map((label, index) => (
            <div key={index} className="h-14 flex items-center">
              {label}
            </div>
          ))}
        </div>
        
        {/* Grid */}
        <div className="flex-1">
          <div className="grid grid-cols-4 gap-1">
            {grid.map((row, impactIndex) => (
              // For each row (impact level)
              row.map((count, likelihoodIndex) => {
                // Calculate actual impact for coloring (4 - index because we displayed high impact at top)
                const actualImpact = 4 - impactIndex;
                // Calculate actual impact for coloring (index + 1)
                const actualLikelihood = likelihoodIndex;
                return (
                  <div 
                    key={`${impactIndex}-${likelihoodIndex}`}
                    className={`h-14 flex items-center justify-center rounded ${getCellColor(actualImpact, actualLikelihood)}`}
                  >
                    <span className="font-bold text-lg">{count}</span>
                  </div>
                );
              })
            ))}
          </div>
          
          {/* X-axis labels (Likelihood) */}
          <div className="flex justify-around mt-2 text-sm font-medium">
            {likelihoodLabels.map((label, index) => (
              <div key={index} className="text-center">
                {label}
              </div>
            ))}
          </div>
        </div>
      </div>
      
      <div className="mt-4 flex justify-center">
        <div className="text-center text-sm font-medium">Likelihood</div>
      </div>
      
      <div className="absolute -mt-36 -ml-12 transform -rotate-90 text-sm font-medium">
        <div>Impact</div>
      </div>
    </div>
  );
};

export default RiskHeatmap;
