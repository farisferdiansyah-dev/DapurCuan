import { Search } from "lucide-react";
import { Button } from "@/components/ui/button";

interface EmptyStateProps {
  message?: string;
  actionLabel?: string;
  onAction?: () => void;
}

export function EmptyState({ message = "Maaf, kami belum menemukan resep yang sesuai dengan budget dan preferensimu.", actionLabel = "Coba filter lain", onAction }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center rounded-xl border bg-card p-12 text-center">
      <div className="mb-4 rounded-full bg-secondary p-4">
        <Search className="size-8 text-secondary-foreground" aria-hidden="true" />
      </div>
      <h3 className="text-xl font-semibold">Tidak ada resep yang cocok</h3>
      <p className="mt-2 max-w-md text-muted-foreground">{message}</p>
      {onAction && (
        <Button variant="outline" className="mt-6" onClick={onAction}>
          {actionLabel}
        </Button>
      )}
    </div>
  );
}
