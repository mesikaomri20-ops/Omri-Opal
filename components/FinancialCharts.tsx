"use client";

import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  Legend,
} from "recharts";

const MOCK_DATA = [
  { year: "2019", הכנסות: 4000, תזרים: 2400, חוב: 2400 },
  { year: "2020", הכנסות: 3000, תזרים: 1398, חוב: 3210 },
  { year: "2021", הכנסות: 2000, תזרים: -9800, חוב: 4290 },
  { year: "2022", הכנסות: 2780, תזרים: 3908, חוב: 4000 },
  { year: "2023", הכנסות: 1890, תזרים: 4800, חוב: 3100 },
  { year: "2024", הכנסות: 2390, תזרים: 3800, חוב: 2500 },
  { year: "2025", הכנסות: 3490, תזרים: 4300, חוב: 2100 },
];

export default function FinancialCharts() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 h-full">
      {/* Revenue vs FCF */}
      <div className="bg-background border border-brand-border p-4 rounded-xl flex flex-col shadow-lg">
        <div className="mb-4">
          <h3 className="text-sm font-bold text-gray-200 uppercase tracking-wider">הכנסות נגד תזרים אמת (FCF)</h3>
          <p className="text-xs text-gray-500 font-mono mt-1">האם החברה באמת מייצרת מזומן, או רק רושמת מספרים בביליון דולר?</p>
        </div>
        <div className="flex-1 w-full min-h-[250px]" dir="ltr">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={MOCK_DATA} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="colorFcf" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#39ff14" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#39ff14" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#8884d8" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#8884d8" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#333" vertical={false} />
              <XAxis dataKey="year" stroke="#888" fontSize={12} tickLine={false} axisLine={false} />
              <YAxis stroke="#888" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `$${value}`} />
              <Tooltip 
                contentStyle={{ backgroundColor: '#121212', borderColor: '#333', color: '#fff', direction: 'rtl' }}
                itemStyle={{ color: '#fff' }}
              />
              <Legend iconType="circle" wrapperStyle={{ direction: 'rtl' }} />
              <Area type="monotone" dataKey="הכנסות" stroke="#8884d8" fillOpacity={1} fill="url(#colorRev)" />
              <Area type="monotone" dataKey="תזרים" stroke="#39ff14" fillOpacity={1} fill="url(#colorFcf)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Debt Levels */}
      <div className="bg-background border border-brand-border p-4 rounded-xl flex flex-col shadow-lg">
        <div className="mb-4">
          <h3 className="text-sm font-bold text-brand-crimson uppercase tracking-wider">מעקב אחרי מינוף חובות</h3>
          <p className="text-xs text-gray-500 font-mono mt-1">חוב גדול + תזרים יורד = פשיטת רגל בדרך.</p>
        </div>
        <div className="flex-1 w-full min-h-[250px]" dir="ltr">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={MOCK_DATA} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#333" vertical={false} />
              <XAxis dataKey="year" stroke="#888" fontSize={12} tickLine={false} axisLine={false} />
              <YAxis stroke="#888" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `$${value}`} />
              <Tooltip 
                cursor={{ fill: '#1a1a1a' }}
                contentStyle={{ backgroundColor: '#121212', borderColor: '#333', color: '#fff', direction: 'rtl' }}
              />
              <Legend iconType="circle" wrapperStyle={{ direction: 'rtl' }} />
              <Bar dataKey="חוב" fill="#ff0033" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
