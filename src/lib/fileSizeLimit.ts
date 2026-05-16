/**
 * All tools are FREE with no file size limits.
 */

import { toast } from "@/hooks/use-toast";

export const FREE_FILE_SIZE_LIMIT = Infinity;

export const formatFileSize = (bytes: number): string => {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
};

export const checkFileSizeLimit = (file: File, _isPremium: boolean): boolean => {
  if (!file || file.size === 0) {
    toast({
      title: "Invalid file",
      description: "This file is empty or unreadable. Please choose a valid file.",
      variant: "destructive",
    });
    return false;
  }
  return true;
};

export const filterFilesBySize = (files: File[], isPremium: boolean): File[] => {
  return files.filter((file) => checkFileSizeLimit(file, isPremium));
};
