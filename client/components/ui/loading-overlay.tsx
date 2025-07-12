import { Loader2 } from "lucide-react";

interface LoadingOverlayProps {
  isVisible: boolean;
  message?: string;
  progress?: string;
}

export function LoadingOverlay({
  isVisible,
  message = "Loading...",
  progress,
}: LoadingOverlayProps) {
  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-8 max-w-sm w-full mx-4 text-center">
        <Loader2 className="w-12 h-12 animate-spin text-primary mx-auto mb-4" />
        <h3 className="text-lg font-semibold mb-2">{message}</h3>
        {progress && (
          <p className="text-sm text-muted-foreground">{progress}</p>
        )}
        <div className="mt-4 text-xs text-muted-foreground">
          Please wait, this may take a few moments...
        </div>
      </div>
    </div>
  );
}
