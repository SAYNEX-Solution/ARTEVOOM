'use client'

import { useState } from 'react';
import styles from "./Admin.module.css";

interface DataPoint {
  date: string;
  amount: number;
  count: number;
  refundCount: number;
}

export default function RevenueChart({ data }: { data: DataPoint[] }) {
  const [hoveredPoint, setHoveredPoint] = useState<number | null>(null);
  const [tooltipPos, setTooltipPos] = useState({ x: 0, y: 0 });

  const maxRevenue = Math.max(...data.map(d => d.amount), 1000000);
  const chartPoints = data.map((d, i) => ({
    x: 50 + (i * 116.6),
    y: 275 - (d.amount / maxRevenue * 200),
    ...d
  }));

  const handleMouseMove = (e: React.MouseEvent, index: number, p: any) => {
    setHoveredPoint(index);
    setTooltipPos({ x: p.x, y: p.y });
  };

  return (
    <div className={styles.chartArea}>
      <svg viewBox="0 0 800 300" className={styles.lineChart} onMouseLeave={() => setHoveredPoint(null)}>
        {/* Grid Lines */}
        {[0, 1, 2, 3, 4, 5].map(i => (
          <line key={i} x1="50" y1={50 * i + 25} x2="750" y2={50 * i + 25} stroke="rgba(255,255,255,0.05)" />
        ))}
        
        {/* Area */}
        <path 
          d={`M${chartPoints[0].x},275 ${chartPoints.map(p => `L${p.x},${p.y}`).join(' ')} L${chartPoints[chartPoints.length-1].x},275 Z`} 
          fill="url(#gradient)" 
          opacity="0.1" 
        />
        
        {/* Line */}
        <path 
          d={`M${chartPoints[0].x},${chartPoints[0].y} ${chartPoints.slice(1).map(p => `L${p.x},${p.y}`).join(' ')}`} 
          fill="none" 
          stroke="#c5a368" 
          strokeWidth="2" 
        />
        
        <defs>
          <linearGradient id="gradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#c5a368" />
            <stop offset="100%" stopColor="transparent" />
          </linearGradient>
        </defs>

        {/* Interactive Dots */}
        {chartPoints.map((p, i) => (
          <g key={i}>
            {/* Larger invisible hit area */}
            <circle 
              cx={p.x} 
              cy={p.y} 
              r="20" 
              fill="transparent" 
              onMouseMove={(e) => handleMouseMove(e, i, p)}
              style={{ cursor: 'pointer' }}
            />
            {/* Visual Dot */}
            <circle 
              cx={p.x} 
              cy={p.y} 
              r={hoveredPoint === i ? "6" : "4"} 
              fill={hoveredPoint === i ? "#c5a368" : "#161514"} 
              stroke="#c5a368" 
              strokeWidth="2" 
              style={{ transition: 'all 0.2s ease' }}
            />
          </g>
        ))}

        {/* Labels */}
        <g className={styles.axisLabels}>
          {data.map((d, i) => (
            <text key={i} x={50 + (i * 116.6)} y="295" textAnchor="middle">{d.date}</text>
          ))}
        </g>
        <g className={styles.yAxisLabels}>
          <text x="40" y="30" textAnchor="end">{(maxRevenue / 10000).toLocaleString()}만</text>
          <text x="40" y="130" textAnchor="end">{(maxRevenue / 20000).toLocaleString()}만</text>
          <text x="40" y="230" textAnchor="end">{(maxRevenue / 100000).toLocaleString()}만</text>
          <text x="40" y="280" textAnchor="end">0</text>
        </g>
      </svg>

      {/* Tooltip */}
      {hoveredPoint !== null && (
        <div 
          className={styles.chartTooltip}
          style={{ 
            left: `${(tooltipPos.x / 800) * 100}%`,
            top: `${(tooltipPos.y / 300) * 100}%`,
            transform: 'translate(-50%, -120%)'
          }}
        >
          <div className={styles.tooltipDate}>{data[hoveredPoint].date} 현황</div>
          <div className={styles.tooltipRow}>
            <span>주문 건수:</span>
            <strong>{data[hoveredPoint].count} 건</strong>
          </div>
          <div className={styles.tooltipRow}>
            <span>환불 건수:</span>
            <strong style={{ color: '#ff4444' }}>{data[hoveredPoint].refundCount} 건</strong>
          </div>
          <div className={styles.tooltipRow}>
            <span>일일 매출:</span>
            <strong>₩{data[hoveredPoint].amount.toLocaleString()}</strong>
          </div>
          <div className={styles.tooltipArrow} />
        </div>
      )}
    </div>
  );
}
