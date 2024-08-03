// pages/dashboard.tsx

import { StatsCards } from "./components/StatsCards";


export default function Dashboard() {
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">لوحة التحكم</h1>
      
      <div className=" grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <StatsCards />
      </div>

      {/* باقي محتوى لوحة التحكم */}
    </div>
  );
}

