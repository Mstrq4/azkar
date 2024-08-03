// components/CategoriesStats.tsx
import { StatsCard } from './StatsCard';
import useSWR from 'swr';

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export function CategoriesStats() {
  const { data: categories, error } = useSWR<any[]>('/api/categories?type=categories', fetcher);

  if (error) return <div>فشل في تحميل الإحصائيات</div>;
  if (!categories) return <div>جاري التحميل...</div>;

  return (
    <StatsCard
      title="عدد التصنيفات"
      value={categories.length}
      icon={
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          className="h-4 w-4 text-muted-foreground"
        >
          <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
        </svg>
      }
    />
  );
}