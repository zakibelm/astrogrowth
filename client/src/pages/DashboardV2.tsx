import { trpc } from "@/lib/trpc";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { BarChart3, TrendingUp, TrendingDown, Users, FileText, Send, Eye, ArrowUpRight, Sparkles, Zap } from "lucide-react";
import { Link } from "wouter";
import { DashboardChart } from "@/components/DashboardChart";
import { DashboardSkeleton } from "@/components/DashboardSkeleton";
import { motion } from "framer-motion";

/**
 * Dashboard V2 - Design Ultra-Moderne et Impressionnant
 * Features:
 * - Glassmorphism effects
 * - Animated cards avec framer-motion
 * - Sparklines pour tendances
 * - Gradients et accents néon
 * - Micro-interactions sophistiquées
 */
export default function DashboardV2() {
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
      bgColor: "bg-gradient-to-br from-blue-500 to-blue-600",
      trend: "+12.5%",
      trendUp: true,
      sparkline: [12, 19, 15, 25, 22, 18, 20],
    },
    {
      title: "Contenus Créés",
      value: metrics?.totalContents || 0,
      icon: FileText,
      description: "Posts marketing générés",
      color: "text-purple-600",
      bgColor: "bg-gradient-to-br from-purple-500 to-purple-600",
      trend: "+8.3%",
      trendUp: true,
      sparkline: [8, 15, 12, 20, 18, 14, 16],
    },
    {
      title: "Posts Publiés",
      value: metrics?.totalPublished || 0,
      icon: Send,
      description: "Publications sur LinkedIn",
      color: "text-green-600",
      bgColor: "bg-gradient-to-br from-green-500 to-green-600",
      trend: "+15.7%",
      trendUp: true,
      sparkline: [6, 12, 10, 18, 15, 12, 14],
    },
    {
      title: "Engagement Total",
      value: (metrics?.totalLikes || 0) + (metrics?.totalComments || 0) + (metrics?.totalShares || 0),
      icon: TrendingUp,
      description: "Likes, commentaires et partages",
      color: "text-orange-600",
      bgColor: "bg-gradient-to-br from-orange-500 to-orange-600",
      trend: "+23.1%",
      trendUp: true,
      sparkline: [30, 45, 38, 55, 48, 42, 50],
    },
  ];

  const activeCampaigns = campaigns?.filter(c => c.status === 'running') || [];
  const recentContent = recentContents?.slice(0, 5) || [];

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.5
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      {/* Hero Header avec Glassmorphism */}
      <div className="relative overflow-hidden border-b bg-gradient-to-r from-primary/5 via-purple-500/5 to-blue-500/5 backdrop-blur-xl">
        {/* Animated background elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-primary/10 rounded-full blur-3xl animate-pulse" />
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl animate-pulse delay-1000" />
        </div>

        <div className="container py-12 relative z-10">
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="flex items-center justify-between"
          >
            <div>
              <div className="flex items-center gap-3 mb-3">
                <h1 className="text-5xl font-bold bg-gradient-to-r from-foreground via-primary to-purple-600 bg-clip-text text-transparent">
                  Tableau de Bord
                </h1>
                <Badge variant="secondary" className="px-3 py-1 text-xs font-semibold bg-primary/10 text-primary border-primary/20">
                  <Sparkles className="h-3 w-3 mr-1 inline" />
                  Live
                </Badge>
              </div>
              <p className="text-muted-foreground text-lg flex items-center gap-2">
                <Zap className="h-4 w-4 text-primary" />
                Vue d'ensemble de vos campagnes marketing en temps réel
              </p>
            </div>
            <Link href="/campaigns/new">
              <Button size="lg" className="gap-2 shadow-lg shadow-primary/25 hover:shadow-xl hover:shadow-primary/40 transition-all duration-300 hover:scale-105">
                <BarChart3 className="h-5 w-5" />
                Nouvelle Campagne
                <ArrowUpRight className="h-4 w-4" />
              </Button>
            </Link>
          </motion.div>
        </div>
      </div>

      <div className="container py-12">
        {/* Stats Grid avec Animations */}
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12"
        >
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            const TrendIcon = stat.trendUp ? TrendingUp : TrendingDown;
            
            return (
              <motion.div key={stat.title} variants={itemVariants}>
                <Card className="group relative overflow-hidden border-2 hover:border-primary/50 transition-all duration-500 hover:shadow-2xl hover:shadow-primary/20 cursor-pointer">
                  {/* Gradient overlay on hover */}
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/0 to-primary/0 group-hover:from-primary/5 group-hover:to-transparent transition-all duration-500" />
                  
                  <CardHeader className="flex flex-row items-center justify-between pb-3 relative z-10">
                    <CardTitle className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
                      {stat.title}
                    </CardTitle>
                    <div className={`p-3 rounded-xl ${stat.bgColor} shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                      <Icon className="h-6 w-6 text-white" />
                    </div>
                  </CardHeader>
                  
                  <CardContent className="relative z-10">
                    <div className="flex items-end justify-between mb-3">
                      <div className="text-5xl font-bold text-foreground group-hover:scale-105 transition-transform duration-300">
                        {stat.value.toLocaleString('fr-CA')}
                      </div>
                      <Badge 
                        variant={stat.trendUp ? "default" : "destructive"}
                        className="gap-1 px-2 py-1"
                      >
                        <TrendIcon className="h-3 w-3" />
                        {stat.trend}
                      </Badge>
                    </div>
                    
                    <p className="text-sm text-muted-foreground mb-4">
                      {stat.description}
                    </p>

                    {/* Mini Sparkline */}
                    <div className="h-12 flex items-end gap-1">
                      {stat.sparkline.map((value, i) => (
                        <motion.div
                          key={i}
                          initial={{ height: 0 }}
                          animate={{ height: `${(value / Math.max(...stat.sparkline)) * 100}%` }}
                          transition={{ delay: index * 0.1 + i * 0.05, duration: 0.5 }}
                          className={`flex-1 ${stat.bgColor} rounded-t opacity-50 group-hover:opacity-100 transition-opacity duration-300`}
                        />
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </motion.div>

        {/* Enhanced Chart avec Glassmorphism */}
        <motion.div 
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.6 }}
          className="mb-12"
        >
          <Card className="border-2 shadow-xl backdrop-blur-sm bg-card/95">
            <CardHeader className="border-b bg-gradient-to-r from-primary/5 to-transparent">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-2xl font-bold flex items-center gap-2">
                    <BarChart3 className="h-6 w-6 text-primary" />
                    Évolution des Métriques
                  </CardTitle>
                  <CardDescription className="text-base mt-1">
                    Progression de vos leads, contenus et publications sur les 7 derniers jours
                  </CardDescription>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm">7 jours</Button>
                  <Button variant="ghost" size="sm">30 jours</Button>
                  <Button variant="ghost" size="sm">90 jours</Button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="pt-6">
              <DashboardChart 
                title=""
                description=""
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
            </CardContent>
          </Card>
        </motion.div>

        {/* Engagement Details avec design premium */}
        {metrics && (metrics.totalLikes > 0 || metrics.totalComments > 0 || metrics.totalShares > 0) && (
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.6 }}
          >
            <Card className="mb-12 border-2 shadow-xl">
              <CardHeader className="border-b bg-gradient-to-r from-orange-500/5 to-transparent">
                <CardTitle className="flex items-center gap-2 text-2xl">
                  <Eye className="h-6 w-6 text-orange-600" />
                  Détails d'Engagement
                </CardTitle>
                <CardDescription className="text-base">
                  Performance de vos publications LinkedIn
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-8">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                  {[
                    { label: "Likes", value: metrics.totalLikes, color: "from-red-500 to-pink-500" },
                    { label: "Commentaires", value: metrics.totalComments, color: "from-blue-500 to-cyan-500" },
                    { label: "Partages", value: metrics.totalShares, color: "from-green-500 to-emerald-500" },
                    { label: "Impressions", value: metrics.totalImpressions, color: "from-purple-500 to-violet-500" },
                  ].map((item, i) => (
                    <motion.div
                      key={item.label}
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: 0.6 + i * 0.1, type: "spring" }}
                      className="text-center p-6 rounded-xl bg-gradient-to-br from-muted/50 to-muted/30 border-2 hover:border-primary/50 transition-all duration-300 hover:shadow-lg cursor-pointer group"
                    >
                      <div className={`text-4xl font-bold bg-gradient-to-r ${item.color} bg-clip-text text-transparent mb-2 group-hover:scale-110 transition-transform duration-300`}>
                        {item.value.toLocaleString('fr-CA')}
                      </div>
                      <div className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
                        {item.label}
                      </div>
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Two Column Grid avec animations */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7, duration: 0.6 }}
          className="grid grid-cols-1 lg:grid-cols-2 gap-8"
        >
          {/* Active Campaigns */}
          <Card className="border-2 shadow-xl">
            <CardHeader className="border-b bg-gradient-to-r from-green-500/5 to-transparent">
              <CardTitle className="text-xl font-bold">Campagnes Actives</CardTitle>
              <CardDescription>
                {activeCampaigns.length} campagne{activeCampaigns.length !== 1 ? 's' : ''} en cours
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              {activeCampaigns.length === 0 ? (
                <div className="text-center py-12">
                  <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-muted flex items-center justify-center">
                    <BarChart3 className="h-8 w-8 text-muted-foreground" />
                  </div>
                  <p className="text-muted-foreground mb-4 text-lg">Aucune campagne active</p>
                  <Link href="/campaigns/new">
                    <Button className="gap-2">
                      <Sparkles className="h-4 w-4" />
                      Créer une campagne
                    </Button>
                  </Link>
                </div>
              ) : (
                <div className="space-y-4">
                  {activeCampaigns.map((campaign, i) => (
                    <motion.div
                      key={campaign.id}
                      initial={{ x: -20, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      transition={{ delay: 0.8 + i * 0.1 }}
                    >
                      <Link href={`/campaigns/${campaign.id}`}>
                        <div className="group p-5 border-2 rounded-xl hover:border-primary/50 hover:bg-primary/5 transition-all duration-300 cursor-pointer hover:shadow-lg">
                          <div className="flex items-center justify-between mb-3">
                            <h3 className="font-bold text-lg text-foreground group-hover:text-primary transition-colors">
                              {campaign.name}
                            </h3>
                            <Badge className="bg-green-500/10 text-green-700 border-green-500/20">
                              ● En cours
                            </Badge>
                          </div>
                          <div className="text-sm text-muted-foreground mb-4">
                            {campaign.targetIndustry} • {campaign.targetLocation}
                          </div>
                          <div className="flex gap-6 text-sm">
                            <div className="flex items-center gap-2">
                              <div className="w-2 h-2 rounded-full bg-blue-500" />
                              <span className="font-semibold">{campaign.totalLeads || 0}</span>
                              <span className="text-muted-foreground">leads</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <div className="w-2 h-2 rounded-full bg-purple-500" />
                              <span className="font-semibold">{campaign.totalContent || 0}</span>
                              <span className="text-muted-foreground">contenus</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <div className="w-2 h-2 rounded-full bg-green-500" />
                              <span className="font-semibold">{campaign.totalPublished || 0}</span>
                              <span className="text-muted-foreground">publiés</span>
                            </div>
                          </div>
                        </div>
                      </Link>
                    </motion.div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Recent Content */}
          <Card className="border-2 shadow-xl">
            <CardHeader className="border-b bg-gradient-to-r from-purple-500/5 to-transparent">
              <CardTitle className="text-xl font-bold">Contenus Récents</CardTitle>
              <CardDescription>
                {recentContent.length} contenu{recentContent.length !== 1 ? 's' : ''} généré{recentContent.length !== 1 ? 's' : ''}
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              {recentContent.length === 0 ? (
                <div className="text-center py-12">
                  <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-muted flex items-center justify-center">
                    <FileText className="h-8 w-8 text-muted-foreground" />
                  </div>
                  <p className="text-muted-foreground text-lg">Aucun contenu généré</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {recentContent.map((content, i) => (
                    <motion.div
                      key={content.id}
                      initial={{ x: 20, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      transition={{ delay: 0.8 + i * 0.1 }}
                      className="group p-5 border-2 rounded-xl hover:border-primary/50 hover:bg-primary/5 transition-all duration-300 cursor-pointer hover:shadow-lg"
                    >
                      <div className="flex items-start gap-4">
                        {content.imageUrl && (
                          <img 
                            src={content.imageUrl} 
                            alt="Content preview"
                            className="w-20 h-20 rounded-lg object-cover border-2 group-hover:scale-105 transition-transform duration-300"
                          />
                        )}
                        <div className="flex-1 min-w-0">
                          <p className="text-sm text-foreground line-clamp-2 mb-2 group-hover:text-primary transition-colors">
                            {content.textContent.substring(0, 100)}...
                          </p>
                          <div className="flex items-center gap-3">
                            <Badge variant="outline" className="text-xs">
                              Score: {content.qualityScore}
                            </Badge>
                            <Badge 
                              variant={
                                content.status === 'published' ? 'default' : 
                                content.status === 'approved' ? 'secondary' : 
                                'outline'
                              }
                              className="text-xs"
                            >
                              {content.status === 'published' ? 'Publié' : 
                               content.status === 'approved' ? 'Approuvé' : 
                               content.status === 'rejected' ? 'Rejeté' : 
                               'En attente'}
                            </Badge>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
