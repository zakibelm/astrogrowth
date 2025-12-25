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
  // Colors matching the dashboard cards
  const colors = {
    leads: "#2563eb", // blue-600
    contenus: "#9333ea", // purple-600
    publications: "#16a34a", // green-600
  };

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-background/95 backdrop-blur-sm border border-border/50 rounded-xl shadow-xl p-4">
          <p className="font-bold text-foreground mb-2">{label}</p>
          {payload.map((entry: any, index: number) => (
            <div key={index} className="flex items-center gap-2 mb-1 last:mb-0">
              <div
                className="w-3 h-3 rounded-full shadow-sm"
                style={{ backgroundColor: entry.color }}
              />
              <p className="text-sm font-medium text-muted-foreground">
                {entry.name}: <span className="text-foreground font-bold ml-1">{entry.value}</span>
              </p>
            </div>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <Card className="col-span-full lg:col-span-2 border-none shadow-none bg-transparent">
      {/* 
        Note: The container Card in DashboardV2 already has style. 
        We rely on the parent to provide the "Card" look or we simply render content here.
        The code in DashboardV2 wraps this component in a CardContent, so here we might just render the chart.
        However, looking at the original code, this component RENDERED A CARD itself.
        But in DashboardV2 it is INSIDE a CardContent??
        
        Let's check DashboardV2 usage again:
        <Card>
          <CardHeader>...</CardHeader>
          <CardContent>
             <DashboardChart ... />
          </CardContent>
        </Card>
        
        BUT the original DashboardChart component code (lines 34-149) WAS returning a <Card> wrapper!
        This means we had nested Cards, which might be ugly.
        
        Wait, looking at DashboardV2 lines 215-250:
        <Card> ... <CardContent> <DashboardChart /> ... </CardContent> </Card>
        
        And DashboardChart lines 34: <Card ...> ... </Card>
        
        Yes, it was a Card inside a Card. That's definitely part of the "confusing" look (double borders).
        I will modify this to ONLY return the ResponsiveContainer graph, and let the parent handle the container.
        This will make it much cleaner.
      */}
      <div className="w-full h-[350px]">
        <ResponsiveContainer width="100%" height="100%">
          {type === 'line' ? (
            <LineChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} className="stroke-muted/20" />
              <XAxis
                dataKey="name"
                axisLine={false}
                tickLine={false}
                tickMargin={10}
                className="text-xs font-medium text-muted-foreground"
                tick={{ fill: 'currentColor' }}
              />
              <YAxis
                axisLine={false}
                tickLine={false}
                className="text-xs font-medium text-muted-foreground"
                tick={{ fill: 'currentColor' }}
              />
              <Tooltip content={<CustomTooltip />} cursor={{ stroke: 'hsl(var(--muted-foreground))', strokeWidth: 1, strokeDasharray: '4 4' }} />
              <Legend iconType="circle" />
              {data[0]?.leads !== undefined && (
                <Line
                  type="monotone"
                  dataKey="leads"
                  stroke={colors.leads}
                  strokeWidth={3}
                  name="Leads"
                  dot={{ fill: colors.leads, strokeWidth: 2, r: 4, stroke: 'white' }}
                  activeDot={{ r: 6, strokeWidth: 0 }}
                />
              )}
              {data[0]?.contenus !== undefined && (
                <Line
                  type="monotone"
                  dataKey="contenus"
                  stroke={colors.contenus}
                  strokeWidth={3}
                  name="Contenus"
                  dot={{ fill: colors.contenus, strokeWidth: 2, r: 4, stroke: 'white' }}
                  activeDot={{ r: 6, strokeWidth: 0 }}
                />
              )}
              {data[0]?.publications !== undefined && (
                <Line
                  type="monotone"
                  dataKey="publications"
                  stroke={colors.publications}
                  strokeWidth={3}
                  name="Publications"
                  dot={{ fill: colors.publications, strokeWidth: 2, r: 4, stroke: 'white' }}
                  activeDot={{ r: 6, strokeWidth: 0 }}
                />
              )}
            </LineChart>
          ) : (
            <AreaChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="colorLeads" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={colors.leads} stopOpacity={0.3} />
                  <stop offset="95%" stopColor={colors.leads} stopOpacity={0} />
                </linearGradient>
                <linearGradient id="colorContenus" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={colors.contenus} stopOpacity={0.3} />
                  <stop offset="95%" stopColor={colors.contenus} stopOpacity={0} />
                </linearGradient>
                <linearGradient id="colorPublications" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={colors.publications} stopOpacity={0.3} />
                  <stop offset="95%" stopColor={colors.publications} stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} className="stroke-muted/20" />
              <XAxis
                dataKey="name"
                axisLine={false}
                tickLine={false}
                tickMargin={10}
                className="text-xs font-medium text-muted-foreground"
                tick={{ fill: 'currentColor' }}
              />
              <YAxis
                axisLine={false}
                tickLine={false}
                className="text-xs font-medium text-muted-foreground"
                tick={{ fill: 'currentColor' }}
              />
              <Tooltip content={<CustomTooltip />} cursor={{ stroke: 'hsl(var(--muted-foreground))', strokeWidth: 1 }} />
              <Legend iconType="circle" wrapperStyle={{ paddingTop: '20px' }} />

              {data[0]?.leads !== undefined && (
                <Area
                  type="monotone"
                  dataKey="leads"
                  stroke={colors.leads}
                  strokeWidth={3}
                  fillOpacity={1}
                  fill="url(#colorLeads)"
                  name="Leads"
                />
              )}
              {data[0]?.contenus !== undefined && (
                <Area
                  type="monotone"
                  dataKey="contenus"
                  stroke={colors.contenus}
                  strokeWidth={3}
                  fillOpacity={1}
                  fill="url(#colorContenus)"
                  name="Contenus"
                />
              )}
              {data[0]?.publications !== undefined && (
                <Area
                  type="monotone"
                  dataKey="publications"
                  stroke={colors.publications}
                  strokeWidth={3}
                  fillOpacity={1}
                  fill="url(#colorPublications)"
                  name="Publications"
                />
              )}
            </AreaChart>
          )}
        </ResponsiveContainer>
      </div>
    </Card>
  );
}
