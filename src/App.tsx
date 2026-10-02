import React from 'react';
import { HabitProvider, useHabit } from './context/HabitContext';
import { DeviceSimulatorBar } from './components/DeviceSimulatorBar';
import { Header } from './components/Header';
import { TodayView } from './components/TodayView';
import { AnalyticsView } from './components/AnalyticsView';
import { SocialView } from './components/SocialView';
import { SyncBackupView } from './components/SyncBackupView';
import { BottomNav } from './components/BottomNav';
import { NewHabitModal } from './components/NewHabitModal';
import { ArchitectureModal } from './components/ArchitectureModal';

const AppContent: React.FC = () => {
  const { activeTab, deviceMode, syncNotification } = useHabit();

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col text-[#131b2e] antialiased">
      {/* Top Device & Network Simulator Controls */}
      <DeviceSimulatorBar />

      {/* Main Viewport Container */}
      <div className="flex-1 flex justify-center items-start p-0 sm:py-4 sm:px-2 overflow-y-auto">
        {/* Device Frame */}
        <div
          className={`w-full transition-all duration-300 relative flex flex-col bg-[#faf8ff] ${
            deviceMode === 'phone'
              ? 'max-w-[420px] min-h-[880px] sm:rounded-[44px] sm:shadow-[0_24px_70px_rgba(0,0,0,0.6)] sm:border-[8px] sm:border-slate-800 overflow-hidden'
              : deviceMode === 'tablet'
              ? 'max-w-[768px] min-h-[900px] sm:rounded-[36px] sm:shadow-[0_24px_70px_rgba(0,0,0,0.6)] sm:border-[8px] sm:border-slate-800 overflow-hidden'
              : 'max-w-5xl min-h-screen sm:rounded-2xl sm:shadow-xl'
          }`}
        >
          {/* Simulated Mobile Notch / Dynamic Island when in phone mode */}
          {deviceMode === 'phone' && (
            <div className="hidden sm:flex justify-center pt-2 pb-1 bg-[#faf8ff] z-50">
              <div className="w-28 h-4 bg-slate-900 rounded-full" />
            </div>
          )}

          {/* Sync & Offline Status Floating Toast */}
          {syncNotification && (
            <div className="sticky top-16 z-50 px-4 py-2 mx-4 my-2 rounded-2xl bg-[#131b2e] text-white text-xs font-semibold shadow-xl border border-white/10 flex items-center justify-between animate-pop-check">
              <div className="flex items-center gap-2 truncate">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                <span className="truncate">{syncNotification}</span>
              </div>
            </div>
          )}

          {/* HabitSpark Header */}
          <Header />

          {/* View Tab Routing */}
          <main className="flex-1 flex flex-col">
            {activeTab === 'today' && <TodayView />}
            {activeTab === 'analytics' && <AnalyticsView />}
            {activeTab === 'social' && <SocialView />}
            {activeTab === 'sync' && <SyncBackupView />}
          </main>

          {/* Floating Navigation Bar */}
          <BottomNav />

          {/* Modals */}
          <NewHabitModal />
          <ArchitectureModal />
        </div>
      </div>
    </div>
  );
};

export default function App() {
  return (
    <HabitProvider>
      <AppContent />
    </HabitProvider>
  );
}
