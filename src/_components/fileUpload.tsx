import {
  AlertCircleIcon,
  ImageIcon,
  UploadIcon,
  XIcon,
  GripVerticalIcon,
} from "lucide-react";

import { formatBytes, useFileUpload } from "@/hooks/use-file-upload";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";

interface FileUploadProps {
  value?: File[];
  onChange?: (files: File[]) => void;
  maxSizeMB?: number;
  maxFiles?: number;
  accept?: string;
  className?: string;
}

export default function Component({
  value = [],
  onChange,
  maxSizeMB = 5,
  maxFiles = 6,
  accept = "image/svg+xml,image/png,image/jpeg,image/jpg,image/gif",
  className = "",
}: FileUploadProps = {}) {
  const maxSize = maxSizeMB * 1024 * 1024;
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);

  const [
    { files, isDragging, errors },
    {
      handleDragEnter,
      handleDragLeave,
      handleDragOver,
      handleDrop,
      openFileDialog,
      removeFile,
      reorderFiles,
      setFiles,
      clearFiles,
      getInputProps,
    },
  ] = useFileUpload({
    accept,
    maxSize,
    multiple: true,
    maxFiles,
    // Supprimer onFilesChange pour éviter les mises à jour pendant le rendu
  });

  // Gérer les changements de fichiers avec useEffect pour éviter les mises à jour pendant le rendu
  useEffect(() => {
    if (onChange) {
      const actualFiles = files
        .map((f) => f.file)
        .filter((file): file is File => file instanceof File);

      // Utiliser setTimeout pour différer la mise à jour
      const timeoutId = setTimeout(() => {
        onChange(actualFiles);
      }, 0);

      return () => clearTimeout(timeoutId);
    }
  }, [files, onChange]);

  // Synchroniser avec la prop value
  useEffect(() => {
    if (value && value.length > 0) {
      // Vérifier si les fichiers ont changé
      const currentFiles = files
        .map((f) => f.file)
        .filter((file): file is File => file instanceof File);
      const valuesChanged =
        value.length !== currentFiles.length ||
        value.some((file, index) => file !== currentFiles[index]);

      if (valuesChanged) {
        setFiles(value);
      }
    } else if (value && value.length === 0 && files.length > 0) {
      // Si value est vide mais qu'on a des fichiers, les supprimer
      clearFiles();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]); // Intentionnellement limité à 'value' pour éviter les boucles infinies

  const handleReorderFiles = (fromIndex: number, toIndex: number) => {
    reorderFiles(fromIndex, toIndex);
  };

  const handleDragStart = (
    e: React.DragEvent<HTMLDivElement>,
    index: number
  ) => {
    setDraggedIndex(index);
    e.dataTransfer.effectAllowed = "move";
    e.dataTransfer.setData("text/html", index.toString());
  };

  const handleDragOverItem = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
  };

  const handleDropItem = (
    e: React.DragEvent<HTMLDivElement>,
    dropIndex: number
  ) => {
    e.preventDefault();

    if (draggedIndex === null) return;

    if (draggedIndex !== dropIndex) {
      handleReorderFiles(draggedIndex, dropIndex);
    }

    setDraggedIndex(null);
  };

  const handleDragEnd = () => {
    setDraggedIndex(null);
  };

  return (
    <div className={`flex flex-col gap-2 ${className}`}>
      {/* Drop area */}
      <div
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        data-dragging={isDragging || undefined}
        data-files={files.length > 0 || undefined}
        className="bg-primary data-[dragging=true]:bg-secondary has-[input:focus]:border-ring has-[input:focus]:ring-ring/50 relative flex min-h-52 flex-col items-center overflow-hidden rounded-xl p-4 transition-colors not-data-[files]:justify-center has-[input:focus]:ring-[3px]"
      >
        <input
          {...getInputProps()}
          className="sr-only"
          aria-label="Ajouter une image"
        />
        <div className="flex flex-col items-center justify-center px-4 py-3 text-center">
          <div
            className="bg-background mb-2 flex size-11 shrink-0 items-center justify-center rounded-full border"
            aria-hidden="true"
          >
            <ImageIcon className="size-4 opacity-60" />
          </div>
          <p className="mb-1.5 text-sm font-medium">Déposez vos images ici</p>
          <p className="text-muted-foreground text-xs">
            SVG, PNG ou JPG (max. {maxSizeMB}MB)
          </p>
          <Button
            variant="outline"
            className="mt-4 bg-secondary hover:bg-secondary-hover"
            onClick={openFileDialog}
          >
            <UploadIcon className="-ms-1 opacity-60" aria-hidden="true" />
            Selectionner des images
          </Button>
        </div>
      </div>

      {errors.length > 0 && (
        <div
          className="text-destructive flex items-center gap-1 text-xs"
          role="alert"
        >
          <AlertCircleIcon className="size-3 shrink-0" />
          <span>{errors[0]}</span>
        </div>
      )}

      {/* File list */}
      {files.length > 0 && (
        <div className="space-y-2">
          {files.map((fileItem, index) => {
            const file = fileItem.file;
            const fileName = file instanceof File ? file.name : file.name;
            const fileSize = file instanceof File ? file.size : file.size;

            return (
              <div
                key={fileItem.id}
                draggable
                onDragStart={(e) => handleDragStart(e, index)}
                onDragOver={handleDragOverItem}
                onDrop={(e) => handleDropItem(e, index)}
                onDragEnd={handleDragEnd}
                className={`bg-primary flex items-center justify-between gap-2 rounded-lg p-2 pe-3 cursor-move transition-all ${
                  draggedIndex === index ? "opacity-50 scale-95" : ""
                } hover:bg-secondary`}
              >
                <div className="flex items-center gap-3 overflow-hidden">
                  <div className="flex items-center">
                    <GripVerticalIcon className="size-4 text-muted-foreground mr-2" />
                    <div className="aspect-square shrink-0 rounded">
                      {fileItem.preview ? (
                        <img
                          src={fileItem.preview}
                          alt={fileName}
                          className="size-10 rounded object-cover"
                        />
                      ) : (
                        <ImageIcon className="size-10 text-gray-400" />
                      )}
                    </div>
                  </div>
                  <div className="flex min-w-0 flex-col gap-0.5">
                    <p className="truncate text-[13px] font-medium">
                      {fileName}
                    </p>
                    <p className="text-muted-foreground text-xs">
                      {formatBytes(fileSize)}
                    </p>
                  </div>
                </div>

                <Button
                  size="icon"
                  className="bg-transparent text-white hover:bg-secondary"
                  onClick={() => removeFile(fileItem.id)}
                  aria-label="Supprimer l'image"
                >
                  <XIcon aria-hidden="true" />
                </Button>
              </div>
            );
          })}

          {/* Remove all files button */}
          {files.length > 1 && (
            <div>
              <Button variant="default" onClick={clearFiles}>
                Supprimer les images
              </Button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
