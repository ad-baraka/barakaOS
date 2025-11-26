import { useCallback } from "react";
import { Upload, FileText, X } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface MultiFileUploadZoneProps {
  label: string;
  description: string;
  files: File[];
  onFilesSelect: (files: File[]) => void;
  onFileClear: (index: number) => void;
  onClearAll: () => void;
  accept?: string;
}

export function MultiFileUploadZone({
  label,
  description,
  files,
  onFilesSelect,
  onFileClear,
  onClearAll,
  accept = ".csv",
}: MultiFileUploadZoneProps) {
  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();

      const droppedFiles = Array.from(e.dataTransfer.files);
      const csvFiles = droppedFiles.filter((f) => f.name.endsWith(".csv"));

      if (csvFiles.length > 0) {
        onFilesSelect([...files, ...csvFiles]);
      }
    },
    [files, onFilesSelect]
  );

  const handleFileInput = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const selectedFiles = Array.from(e.target.files || []);
      if (selectedFiles.length > 0) {
        onFilesSelect([...files, ...selectedFiles]);
      }
      e.target.value = "";
    },
    [files, onFilesSelect]
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
          multiple
          onChange={handleFileInput}
          className="sr-only"
          data-testid={`input-file-${label.toLowerCase().replace(/\s+/g, "-")}`}
        />

        <div className="flex flex-col items-center justify-center p-6 min-h-[180px]">
          {files.length > 0 ? (
            <div className="flex flex-col items-center w-full">
              <FileText className="w-10 h-10 text-primary mb-3" />
              <p className="text-sm font-medium text-foreground mb-2">
                {files.length} file{files.length > 1 ? 's' : ''} selected
              </p>
              <div className="w-full max-h-[120px] overflow-y-auto space-y-1 mb-3 px-2">
                {files.map((file, index) => (
                  <div
                    key={`${file.name}-${index}`}
                    className="flex items-center justify-between bg-muted/50 rounded px-2 py-1 text-xs"
                  >
                    <span className="truncate flex-1 mr-2">{file.name}</span>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="h-5 w-5 shrink-0"
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        onFileClear(index);
                      }}
                      data-testid={`button-remove-file-${index}`}
                    >
                      <X className="w-3 h-3" />
                    </Button>
                  </div>
                ))}
              </div>
              <div className="flex gap-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                  }}
                  data-testid="button-add-more-files"
                  className="gap-1 text-xs"
                >
                  <Upload className="w-3 h-3" />
                  Add More
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    onClearAll();
                  }}
                  data-testid="button-clear-all-files"
                  className="gap-1 text-xs"
                >
                  <X className="w-3 h-3" />
                  Clear All
                </Button>
              </div>
            </div>
          ) : (
            <>
              <Upload className="w-12 h-12 text-muted-foreground mb-3" />
              <p className="text-foreground mb-1 text-[23px] font-bold">
                {label}
              </p>
              <p className="text-xs text-muted-foreground font-normal text-center">
                {description}
              </p>
            </>
          )}
        </div>
      </label>
    </Card>
  );
}
