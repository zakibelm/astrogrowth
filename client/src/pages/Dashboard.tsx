import { trpc } from "@/lib/trpc";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BarChart3, TrendingUp, Users, FileText, Send, Eye } from "lucide-react";
import { Link } from "wouter";
import { DashboardChart } from "@/components/DashboardChart";
import { DashboardSkeleton } from "@/components/DashboardSkeleton";

export default function Dashboard() {
  const { data: metrics, isLoading } = trpc.dashboard.metrics.useQuery();
  const { data: campaigns } = trpc.campaigns.list.useQuery();
  const { data: recentContents } = trpc.contents.listByUser.useQuery({ status: undefined });

  if (isLoading) {
    return <DashboardSkeleton />;
  }

  const stats = [
    {
      title: "Leads Générés",
      value: metrics?.totalLeads || 0,
      icon: Users,
      description: "Total des prospects identifiés",
      color: "text-blue-600",
      bgColor: "bg-blue-50",
    },
    {
      title: "Contenus Créés",
      value: metrics?.totalContents || 0,
      icon: FileText,
      description: "Posts marketing générés",
      color: "text-purple-600",
      bgColor: "bg-purple-50",
    },
    {
      title: "Posts Publiés",
      value: metrics?.totalPublished || 0,
      icon: Send,
      description: "Publications sur LinkedIn",
      color: "text-green-600",
      bgColor: "bg-green-50",
    },
    {
      title: "Engagement Total",
      value: (metrics?.totalLikes || 0) + (metrics?.totalComments || 0) + (metrics?.totalShares || 0),
      icon: TrendingUp,
      description: "Likes, commentaires et partages",
      color: "text-orange-600",
      bgColor: "bg-orange-50",
    },
  ];

  const activeCampaigns = campaigns?.filter(c => c.status === 'running') || [];
  const recentContent = recentContents?.slice(0, 5) || [];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b bg-card">
        <div className="container py-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold text-foreground mb-2">
                Tableau de Bord
              </h1>
              <p className="text-muted-foreground text-lg">
                Vue d'ensemble de vos campagnes marketing
              </p>
            </div>
            <Link href="/campaigns/new">
              <Button size="lg" className="gap-2">
                <BarChart3 className="h-5 w-5" />
                Nouvelle Campagne
              </Button>
            </Link>
          </div>
        </div>
      </div>

      <div className="container py-8">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat) => {
            const Icon = stat.icon;
            return (
              <Card key={stat.title} className="overflow-hidden transition-all duration-300 hover:shadow-lg hover:scale-105 cursor-pointer">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    {stat.title}
                  </CardTitle>
                  <div className={`p-2 rounded-lg ${stat.bgColor}`}>
                    <Icon className={`h-5 w-5 ${stat.color}`} />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-foreground mb-1">
                    {stat.value.toLocaleString('fr-CA')}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {stat.description}
                  </p>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Evolution Chart */}
        <div className="grid grid-cols-1 gap-8 mb-8">
          <DashboardChart 
            title="Évolution des Métriques"
            description="Progression de vos leads, contenus et publications sur les 7 derniers jours"
            data={[
              { name: 'Lun', leads: 12, contenus: 8, publications: 6 },
              { name: 'Mar', leads: 19, contenus: 15, publications: 12 },
              { name: 'Mer', leads: 15, contenus: 12, publications: 10 },
              { name: 'Jeu', leads: 25, contenus: 20, publications: 18 },
              { name: 'Ven', leads: 22, contenus: 18, publications: 15 },
              { name: 'Sam', leads: 18, contenus: 14, publications: 12 },
              { name: 'Dim', leads: 20, contenus: 16, publications: 14 },
            ]}
            type="area"
          />
        </div>

        {/* Engagement Details */}
        {metrics && (metrics.totalLikes > 0 || metrics.totalComments > 0 || metrics.totalShares > 0) && (
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Eye className="h-5 w-5" />
                Détails d'Engagement
              </CardTitle>
              <CardDescription>
                Performance de vos publications LinkedIn
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="text-center p-4 bg-muted rounded-lg">
                  <div className="text-2xl font-bold text-foreground mb-1">
                    {metrics.totalLikes.toLocaleString('fr-CA')}
                  </div>
                  <div className="text-sm text-muted-foreground">Likes</div>
                </div>
                <div className="text-center p-4 bg-muted rounded-lg">
                  <div className="text-2xl font-bold text-foreground mb-1">
                    {metrics.totalComments.toLocaleString('fr-CA')}
                  </div>
                  <div className="text-sm text-muted-foreground">Commentaires</div>
                </div>
                <div className="text-center p-4 bg-muted rounded-lg">
                  <div className="text-2xl font-bold text-foreground mb-1">
                    {metrics.totalShares.toLocaleString('fr-CA')}
                  </div>
                  <div className="text-sm text-muted-foreground">Partages</div>
                </div>
                <div className="text-center p-4 bg-muted rounded-lg">
                  <div className="text-2xl font-bold text-foreground mb-1">
                    {metrics.totalImpressions.toLocaleString('fr-CA')}
                  </div>
                  <div className="text-sm text-muted-foreground">Impressions</div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Active Campaigns */}
          <Card>
            <CardHeader>
              <CardTitle>Campagnes Actives</CardTitle>
              <CardDescription>
                {activeCampaigns.length} campagne{activeCampaigns.length !== 1 ? 's' : ''} en cours
              </CardDescription>
            </CardHeader>
            <CardContent>
              {activeCampaigns.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <p className="mb-4">Aucune campagne active</p>
                  <Link href="/campaigns/new">
                    <Button variant="outline">Créer une campagne</Button>
                  </Link>
                </div>
              ) : (
                <div className="space-y-4">
                  {activeCampaigns.map((campaign) => (
                    <Link key={campaign.id} href={`/campaigns/${campaign.id}`}>
                      <div className="p-4 border rounded-lg hover:bg-muted transition-colors cursor-pointer">
                        <div className="flex items-center justify-between mb-2">
                          <h3 className="font-semibold text-foreground">{campaign.name}</h3>
                          <span className="text-xs px-2 py-1 bg-green-100 text-green-700 rounded-full">
                            En cours
                          </span>
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {campaign.targetIndustry} • {campaign.targetLocation}
                        </div>
                        <div className="flex gap-4 mt-3 text-xs text-muted-foreground">
                          <span>{campaign.totalLeads || 0} leads</span>
                          <span>{campaign.totalContent || 0} contenus</span>
                          <span>{campaign.totalPublished || 0} publiés</span>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Recent Content */}
          <Card>
            <CardHeader>
              <CardTitle>Contenus Récents</CardTitle>
              <CardDescription>
                Derniers contenus générés
              </CardDescription>
            </CardHeader>
            <CardContent>
              {recentContent.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <p>Aucun contenu généré</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {recentContent.map((content) => (
                    <div key={content.id} className="p-4 border rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <span className={`text-xs px-2 py-1 rounded-full ${
                          content.status === 'published' ? 'bg-green-100 text-green-700' :
                          content.status === 'approved' ? 'bg-blue-100 text-blue-700' :
                          content.status === 'rejected' ? 'bg-red-100 text-red-700' :
                          'bg-yellow-100 text-yellow-700'
                        }`}>
                          {content.status === 'published' ? 'Publié' :
                           content.status === 'approved' ? 'Approuvé' :
                           content.status === 'rejected' ? 'Rejeté' :
                           'En attente'}
                        </span>
                        <span className="text-xs text-muted-foreground">
                          Score: {content.qualityScore}/100
                        </span>
                      </div>
                      <p className="text-sm text-foreground line-clamp-2">
                        {content.textContent}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
