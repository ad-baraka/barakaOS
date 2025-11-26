import { useCallback } from "react";
import { Upload, FileText, X } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface FileUploadZoneProps {
  label: string;
  description: string;
  file: File | null;
  onFileSelect: (file: File) => void;
  onFileClear: () => void;
  accept?: string;
}

export function FileUploadZone({
  label,
  description,
  file,
  onFileSelect,
  onFileClear,
  accept = ".csv",
}: FileUploadZoneProps) {
  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();

      const droppedFiles = Array.from(e.dataTransfer.files);
      const csvFile = droppedFiles.find((f) => f.name.endsWith(".csv"));

      if (csvFile) {
        onFileSelect(csvFile);
      }
    },
    [onFileSelect]
  );

  const handleFileInput = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const selectedFile = e.target.files?.[0];
      if (selectedFile) {
        onFileSelect(selectedFile);
      }
    },
    [onFileSelect]
  );

  return (
    <Card
      className="relative overflow-visible border-2 border-dashed transition-colors hover-elevate"
      onDragOver={handleDragOver}
      onDrop={handleDrop}
      data-testid={`upload-zone-${label.toLowerCase().replace(/\s+/g, "-")}`}
    >
      <label className="block cursor-pointer">
        <input
          type="file"
          accept={accept}
          onChange={handleFileInput}
          className="sr-only"
          data-testid={`input-file-${label.toLowerCase().replace(/\s+/g, "-")}`}
        />

        <div className="flex flex-col items-center justify-center p-6 min-h-[180px]">
          {file ? (
            <div className="flex flex-col items-center w-full">
              <FileText className="w-12 h-12 text-primary mb-3" />
              <p className="text-sm font-medium text-foreground mb-1 text-center break-all px-4">
                {file.name}
              </p>
              <p className="text-xs text-muted-foreground mb-3">
                {(file.size / 1024).toFixed(2)} KB
              </p>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={(e) => {
                  e.preventDefault();
                  onFileClear();
                }}
                data-testid={`button-clear-${label.toLowerCase().replace(/\s+/g, "-")}`}
                className="gap-2"
              >
                <X className="w-4 h-4" />
                Remove File
              </Button>
            </div>
          ) : (
            <>
              <Upload className="w-12 h-12 text-muted-foreground mb-3" />
              <p className="text-foreground mb-1 text-[23px] font-bold">
                {label}
              </p>
              <p className="text-xs text-muted-foreground font-normal">
                {description}
              </p>
            </>
          )}
        </div>
      </label>
    </Card>
  );
}
