import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { TrendingUp, Users, FileText, Send } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useState } from 'react';

/**
 * Page Analytics avec graphiques de performance
 * Affiche l'évolution des leads, contenus et engagement
 */
export default function Analytics() {
  const [period, setPeriod] = useState<7 | 30 | 90>(30);
  
  // Données de démonstration pour les graphiques
  const leadsData = [
    { date: '1 Jan', leads: 5, contenus: 3, posts: 0 },
    { date: '5 Jan', leads: 12, contenus: 8, posts: 2 },
    { date: '10 Jan', leads: 18, contenus: 15, posts: 5 },
    { date: '15 Jan', leads: 25, contenus: 20, posts: 8 },
    { date: '20 Jan', leads: 35, contenus: 28, posts: 12 },
    { date: '25 Jan', leads: 42, contenus: 35, posts: 15 },
    { date: 'Aujourd\'hui', leads: 47, contenus: 43, posts: 18 },
  ];

  const engagementData = [
    { type: 'Likes', valeur: 42 },
    { type: 'Commentaires', valeur: 8 },
    { type: 'Partages', valeur: 5 },
    { type: 'Impressions', valeur: 125 }, // Divisé par 10 pour l'échelle
  ];

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Header */}
      <div className="bg-card border-b border-border p-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Analytics</h1>
            <p className="text-sm text-muted-foreground mt-1">
              Performance de vos campagnes marketing
            </p>
          </div>
          <div className="flex gap-2">
            <Button
              variant={period === 7 ? "default" : "outline"}
              size="sm"
              onClick={() => setPeriod(7)}
            >
              7 jours
            </Button>
            <Button
              variant={period === 30 ? "default" : "outline"}
              size="sm"
              onClick={() => setPeriod(30)}
            >
              30 jours
            </Button>
            <Button
              variant={period === 90 ? "default" : "outline"}
              size="sm"
              onClick={() => setPeriod(90)}
            >
              90 jours
            </Button>
          </div>
        </div>
      </div>

      <div className="p-6 space-y-6">
        {/* Métriques principales */}
        <div className="grid grid-cols-2 gap-4">
          <Card className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Taux de Conversion</p>
                <p className="text-2xl font-bold text-foreground mt-1">91.5%</p>
                <p className="text-xs text-primary mt-1 flex items-center gap-1">
                  <TrendingUp className="h-3 w-3" />
                  +12.3%
                </p>
              </div>
              <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                <TrendingUp className="h-6 w-6 text-primary" />
              </div>
            </div>
          </Card>

          <Card className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">ROI Moyen</p>
                <p className="text-2xl font-bold text-foreground mt-1">385%</p>
                <p className="text-xs text-primary mt-1 flex items-center gap-1">
                  <TrendingUp className="h-3 w-3" />
                  +28.5%
                </p>
              </div>
              <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                <Users className="h-6 w-6 text-primary" />
              </div>
            </div>
          </Card>
        </div>

        {/* Graphique d'évolution */}
        <Card className="p-6">
          <h2 className="text-lg font-semibold text-foreground mb-4">
            Évolution des Métriques
          </h2>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={leadsData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis 
                dataKey="date" 
                stroke="#6b7280"
                style={{ fontSize: '12px' }}
              />
              <YAxis 
                stroke="#6b7280"
                style={{ fontSize: '12px' }}
              />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#fff',
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px'
                }}
              />
              <Legend />
              <Line 
                type="monotone" 
                dataKey="leads" 
                stroke="#00D084" 
                strokeWidth={2}
                name="Leads"
              />
              <Line 
                type="monotone" 
                dataKey="contenus" 
                stroke="#8b5cf6" 
                strokeWidth={2}
                name="Contenus"
              />
              <Line 
                type="monotone" 
                dataKey="posts" 
                stroke="#3b82f6" 
                strokeWidth={2}
                name="Posts"
              />
            </LineChart>
          </ResponsiveContainer>
        </Card>

        {/* Graphique d'engagement */}
        <Card className="p-6">
          <h2 className="text-lg font-semibold text-foreground mb-4">
            Engagement LinkedIn
          </h2>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={engagementData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis 
                dataKey="type" 
                stroke="#6b7280"
                style={{ fontSize: '12px' }}
              />
              <YAxis 
                stroke="#6b7280"
                style={{ fontSize: '12px' }}
              />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#fff',
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px'
                }}
              />
              <Bar dataKey="valeur" fill="#00D084" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </Card>

        {/* Statistiques détaillées */}
        <div className="grid grid-cols-2 gap-4">
          <Card className="p-4">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <Users className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Leads Qualifiés</p>
                <p className="text-lg font-bold text-foreground">43/47</p>
              </div>
            </div>
          </Card>

          <Card className="p-4">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-purple-500/10 flex items-center justify-center">
                <FileText className="h-5 w-5 text-purple-500" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Contenus Approuvés</p>
                <p className="text-lg font-bold text-foreground">38/43</p>
              </div>
            </div>
          </Card>

          <Card className="p-4">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-blue-500/10 flex items-center justify-center">
                <Send className="h-5 w-5 text-blue-500" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Taux Publication</p>
                <p className="text-lg font-bold text-foreground">88.4%</p>
              </div>
            </div>
          </Card>

          <Card className="p-4">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-orange-500/10 flex items-center justify-center">
                <TrendingUp className="h-5 w-5 text-orange-500" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Croissance</p>
                <p className="text-lg font-bold text-foreground">+156%</p>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
