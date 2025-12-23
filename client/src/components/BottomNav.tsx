import { useLocation } from "wouter";
import { Home, BarChart3, FileText, Settings, TrendingUp } from "lucide-react";

/**
 * Bottom Navigation Bar pour mobile
 * Design selon les maquettes fournies
 */
export default function BottomNav() {
  const [location, setLocation] = useLocation();

  const navItems = [
    {
      icon: Home,
      label: "Accueil",
      path: "/dashboard",
    },
    {
      icon: BarChart3,
      label: "Campagnes",
      path: "/campaigns",
    },
    {
      icon: TrendingUp,
      label: "Analytics",
      path: "/analytics",
    },
    {
      icon: FileText,
      label: "Contenus",
      path: "/contents",
    },
    {
      icon: Settings,
      label: "Paramètres",
      path: "/settings",
    },
  ];

  const isActive = (path: string) => {
    if (path === "/dashboard") {
      return location === "/" || location === "/dashboard";
    }
    return location.startsWith(path);
  };

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-card border-t border-border z-50 shadow-lg">
      <div className="flex items-center justify-around h-16">
        {navItems.map((item) => {
          const Icon = item.icon;
          const active = isActive(item.path);

          return (
            <button
              key={item.path}
              onClick={() => setLocation(item.path)}
              className={`flex flex-col items-center justify-center flex-1 h-full transition-colors ${
                active
                  ? "text-primary"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <Icon className={`h-6 w-6 ${active ? "stroke-[2.5]" : ""}`} />
              <span className={`text-xs mt-1 ${active ? "font-semibold" : ""}`}>
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
