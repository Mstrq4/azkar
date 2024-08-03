// app/page.tsx
import { Button } from "@/components/ui/button";
import { RadialBackground } from "@/components/RadialBackground";
import { ThreeDModel } from "@/components/ThreeDModel";

export default function Homee() {
  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden">
      <RadialBackground />
      <div className="container mx-auto px-4 z-10">
        <div className="flex flex-col md:flex-row items-center justify-center text-center">
          <div className="md:w-1/2 text-center md:text-left mb-8 md:mb-0">
            <h1 className="text-4xl md:text-6xl font-bold mb-4">أذكار المسلم</h1>
            <p className="text-xl mb-6">صحيح الأذكار المأثورة مترجمة لعدة لغات</p>
            <Button size="lg" className="rounded-full">
              تحميل التطبيق
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}