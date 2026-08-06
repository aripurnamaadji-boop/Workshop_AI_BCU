import { useState } from "react";
import { Outlet, useLocation } from "react-router-dom";
import Sidebar from "./Sidebar";
import Topbar from "./Topbar";
import MobileHeader from "./MobileHeader";
import { titles, type ScreenId } from "../data/mockData";
import styles from "./AppShell.module.css";

const mobileChips: Record<ScreenId, string[]> = {
  dashboard: ["Q3 2026", "Semua region", "Semua level"],
  coverage: ["Q3 2026", "Semua region"],
  people: ["Q3 2026", "Hi-po + Core"],
  hours: ["Q3 2026"],
  eval: ["Q3 2026"],
  analysis: ["Q3 2026"],
  "update-data": [],
};

export default function AppShell() {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const { pathname } = useLocation();
  const screen = (pathname.replace("/", "") || "dashboard") as ScreenId;
  const title = titles[screen] ?? "Dashboard";

  return (
    <div className={styles.shell}>
      <Sidebar open={drawerOpen} onNavigate={() => setDrawerOpen(false)} />
      <div className={styles.main}>
        <Topbar title={title} />
        <MobileHeader title={title} chips={mobileChips[screen] ?? []} onMenuClick={() => setDrawerOpen(true)} />
        <div className={styles.content}>
          <Outlet />
        </div>
      </div>
    </div>
  );
}
