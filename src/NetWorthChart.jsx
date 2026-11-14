import { useEffect, useRef } from 'react';
import {
  Chart,
  LineController,
  LineElement,
  PointElement,
  LinearScale,
  CategoryScale,
  Filler,
  Tooltip,
  Legend,
} from 'chart.js';
import { rm, rmCompact } from './i18n.js';

Chart.register(LineController, LineElement, PointElement, LinearScale, CategoryScale, Filler, Tooltip, Legend);

const PALETTE = {
  light: {
    asbf: '#1d4ed8',
    asbfFill: 'rgba(29, 78, 216, 0.14)',
    cash: '#c2570c',
    paid: '#6b7689',
    grid: 'rgba(15, 27, 45, 0.08)',
    text: '#55627a',
    marker: '#0f1b2d',
    surface: '#ffffff',
  },
  dark: {
    asbf: '#6ea0ff',
    asbfFill: 'rgba(110, 160, 255, 0.18)',
    cash: '#ffa860',
    paid: '#9aa7bd',
    grid: 'rgba(232, 237, 247, 0.1)',
    text: '#9aa7bd',
    marker: '#e8edf7',
    surface: '#141d2e',
  },
};

export default function NetWorthChart({ rows, year, onSelect, dark, labels, ariaLabel }) {
  const canvas = useRef(null);
  const chart = useRef(null);
  const live = useRef({ year, onSelect, labels });
  live.current = { year, onSelect, labels };

  useEffect(() => {
    const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
    const pick = (_evt, elements) => {
      if (elements.length) live.current.onSelect(elements[0].index + 1);
    };

    // Vertical marker on the selected year.
    const marker = {
      id: 'selectedYear',
      afterDatasetsDraw(c) {
        const i = live.current.year - 1;
        const meta = c.getDatasetMeta(0);
        const point = meta.data[i];
        if (!point) return;
        const { ctx, chartArea } = c;
        ctx.save();
        ctx.strokeStyle = c.options.plugins.selectedYear.color;
        ctx.globalAlpha = 0.55;
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.moveTo(point.x, chartArea.top);
        ctx.lineTo(point.x, chartArea.bottom);
        ctx.stroke();
        ctx.globalAlpha = 1;
        c.data.datasets.slice(0, 2).forEach((ds, k) => {
          const p = c.getDatasetMeta(k).data[i];
          if (!p) return;
          ctx.beginPath();
          ctx.arc(p.x, p.y, 5, 0, Math.PI * 2);
          ctx.fillStyle = ds.borderColor;
          ctx.fill();
          ctx.lineWidth = 2;
          ctx.strokeStyle = c.options.plugins.selectedYear.surface;
          ctx.stroke();
        });
        ctx.restore();
      },
    };

    chart.current = new Chart(canvas.current, {
      type: 'line',
      data: {
        labels: [],
        datasets: [
          { data: [], borderWidth: 2.5, fill: 'origin', tension: 0.25, pointRadius: 0, pointHitRadius: 12 },
          { data: [], borderWidth: 2.5, borderDash: [7, 5], tension: 0.25, pointRadius: 0, pointHitRadius: 12 },
          { data: [], borderWidth: 2, borderDash: [2, 4], tension: 0, pointRadius: 0, pointHitRadius: 12 },
        ],
      },
      plugins: [marker],
      options: {
        responsive: true,
        maintainAspectRatio: false,
        animation: reduced ? false : { duration: 250 },
        interaction: { mode: 'index', intersect: false },
        onClick: pick,
        onHover: pick,
        scales: {
          x: {
            grid: { display: false },
            ticks: { maxTicksLimit: 9, maxRotation: 0, font: { family: 'IBM Plex Sans' } },
          },
          y: {
            beginAtZero: true,
            border: { display: false },
            ticks: { callback: (v) => rmCompact(v), maxTicksLimit: 6, font: { family: 'IBM Plex Sans' } },
          },
        },
        plugins: {
          selectedYear: {},
          legend: {
            position: 'bottom',
            labels: { usePointStyle: true, pointStyle: 'line', boxWidth: 28, padding: 16, font: { family: 'IBM Plex Sans', size: 13 } },
            onClick: () => {},
          },
          tooltip: {
            padding: 10,
            titleFont: { family: 'Sora', weight: '600' },
            bodyFont: { family: 'IBM Plex Sans' },
            callbacks: {
              title: (items) => live.current.labels.yearN(items[0].dataIndex + 1),
              label: (item) => ` ${item.dataset.label}: ${rm(item.parsed.y)}`,
            },
          },
        },
      },
    });
    return () => chart.current.destroy();
  }, []);

  // Data, labels and theme.
  useEffect(() => {
    const c = chart.current;
    const p = dark ? PALETTE.dark : PALETTE.light;
    c.data.labels = rows.map((r) => r.year);
    const [asbf, cash, paid] = c.data.datasets;
    Object.assign(asbf, { label: labels.asbf, data: rows.map((r) => r.asbf), borderColor: p.asbf, backgroundColor: p.asbfFill });
    Object.assign(cash, { label: labels.cash, data: rows.map((r) => r.cashTotal), borderColor: p.cash, backgroundColor: p.cash });
    Object.assign(paid, { label: labels.paid, data: rows.map((r) => r.totalPaid), borderColor: p.paid, backgroundColor: p.paid });
    c.options.scales.x.ticks.color = p.text;
    c.options.scales.y.ticks.color = p.text;
    c.options.scales.y.grid.color = p.grid;
    c.options.plugins.legend.labels.color = p.text;
    c.options.plugins.selectedYear = { color: p.marker, surface: p.surface };
    c.update();
  }, [rows, dark, labels]);

  // Selection only needs a redraw.
  useEffect(() => {
    chart.current.draw();
  }, [year]);

  return (
    <div className="chart-box">
      <canvas ref={canvas} role="img" aria-label={ariaLabel} />
    </div>
  );
}
