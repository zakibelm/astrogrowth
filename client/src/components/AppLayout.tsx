import { ReactNode } from "react";
import BottomNav from "./BottomNav";

interface AppLayoutProps {
  children: ReactNode;
}

/**
 * Layout principal de l'application avec bottom navigation
 */
export default function AppLayout({ children }: AppLayoutProps) {
  return (
    <div className="min-h-screen bg-background pb-16 md:pb-0">
      {children}
      <BottomNav />
    </div>
  );
}
