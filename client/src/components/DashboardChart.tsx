import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { LineChart, Line, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

interface DashboardChartProps {
  title: string;
  description: string;
  data: Array<{
    name: string;
    leads?: number;
    contenus?: number;
    publications?: number;
  }>;
  type?: 'line' | 'area';
}

export function DashboardChart({ title, description, data, type = 'area' }: DashboardChartProps) {
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-card border border-border rounded-lg shadow-lg p-3">
          <p className="font-semibold text-foreground mb-2">{label}</p>
          {payload.map((entry: any, index: number) => (
            <p key={index} className="text-sm" style={{ color: entry.color }}>
              {entry.name}: <span className="font-bold">{entry.value}</span>
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <Card className="col-span-full lg:col-span-2">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          {type === 'line' ? (
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
              <XAxis 
                dataKey="name" 
                className="text-xs text-muted-foreground"
                tick={{ fill: 'currentColor' }}
              />
              <YAxis 
                className="text-xs text-muted-foreground"
                tick={{ fill: 'currentColor' }}
              />
              <Tooltip content={<CustomTooltip />} />
              <Legend />
              {data[0]?.leads !== undefined && (
                <Line 
                  type="monotone" 
                  dataKey="leads" 
                  stroke="hsl(var(--chart-1))" 
                  strokeWidth={2}
                  name="Leads"
                  dot={{ fill: 'hsl(var(--chart-1))' }}
                />
              )}
              {data[0]?.contenus !== undefined && (
                <Line 
                  type="monotone" 
                  dataKey="contenus" 
                  stroke="hsl(var(--chart-2))" 
                  strokeWidth={2}
                  name="Contenus"
                  dot={{ fill: 'hsl(var(--chart-2))' }}
                />
              )}
              {data[0]?.publications !== undefined && (
                <Line 
                  type="monotone" 
                  dataKey="publications" 
                  stroke="hsl(var(--chart-3))" 
                  strokeWidth={2}
                  name="Publications"
                  dot={{ fill: 'hsl(var(--chart-3))' }}
                />
              )}
            </LineChart>
          ) : (
            <AreaChart data={data}>
              <defs>
                <linearGradient id="colorLeads" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="hsl(var(--chart-1))" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="hsl(var(--chart-1))" stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="colorContenus" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="hsl(var(--chart-2))" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="hsl(var(--chart-2))" stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="colorPublications" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="hsl(var(--chart-3))" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="hsl(var(--chart-3))" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
              <XAxis 
                dataKey="name" 
                className="text-xs text-muted-foreground"
                tick={{ fill: 'currentColor' }}
              />
              <YAxis 
                className="text-xs text-muted-foreground"
                tick={{ fill: 'currentColor' }}
              />
              <Tooltip content={<CustomTooltip />} />
              <Legend />
              {data[0]?.leads !== undefined && (
                <Area 
                  type="monotone" 
                  dataKey="leads" 
                  stroke="hsl(var(--chart-1))" 
                  fillOpacity={1}
                  fill="url(#colorLeads)"
                  name="Leads"
                />
              )}
              {data[0]?.contenus !== undefined && (
                <Area 
                  type="monotone" 
                  dataKey="contenus" 
                  stroke="hsl(var(--chart-2))" 
                  fillOpacity={1}
                  fill="url(#colorContenus)"
                  name="Contenus"
                />
              )}
              {data[0]?.publications !== undefined && (
                <Area 
                  type="monotone" 
                  dataKey="publications" 
                  stroke="hsl(var(--chart-3))" 
                  fillOpacity={1}
                  fill="url(#colorPublications)"
                  name="Publications"
                />
              )}
            </AreaChart>
          )}
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
