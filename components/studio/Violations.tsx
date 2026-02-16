import { Card } from "@/components/ui/card";

interface ViolationsAlertProps {
  violations: string[];
}

export function ViolationsAlert({ violations }: ViolationsAlertProps) {
  if (violations.length === 0) return null;

  return (
    <Card className="p-2 bg-red-50 dark:bg-red-900/20 border-red-200">
      <div className="text-xs font-semibold text-red-700 dark:text-red-400">Violations</div>
      <ul className="text-xs mt-1">
        {violations.map((v, i) => (
          <li key={i} className="text-red-600 dark:text-red-300">
            {v}
          </li>
        ))}
      </ul>
    </Card>
  );
}
