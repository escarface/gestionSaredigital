import React from 'react';
import KPICards from './KPICards';
import ChartsSection from './ChartsSection';
import ActiveProjects from './ActiveProjects';
import PendingTasks from './PendingTasks';

const Dashboard: React.FC = () => {
  return (
    <div className="flex flex-col gap-4 animate-in fade-in duration-300">
      <KPICards />
      <ChartsSection />
      <ActiveProjects />
      <PendingTasks />
    </div>
  );
};

export default Dashboard;
