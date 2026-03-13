import { toast } from "@/hooks/use-toast";

export const FREE_FILE_SIZE_LIMIT = 10 * 1024 * 1024; // 10MB

export const formatFileSize = (bytes: number): string => {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
};

/**
 * Check if file exceeds the free plan size limit.
 * Returns true if file is OK to use, false if blocked.
 */
export const checkFileSizeLimit = (file: File, isPremium: boolean): boolean => {
  if (isPremium) return true;
  if (file.size <= FREE_FILE_SIZE_LIMIT) return true;

  toast({
    title: "File too large for free plan",
    description: `Free users can process files up to 10MB (your file: ${formatFileSize(file.size)}). Upgrade to Premium for unlimited file sizes.`,
    variant: "destructive",
  });
  return false;
};

/**
 * Check multiple files against size limit.
 * Returns array of files that pass the check.
 */
export const filterFilesBySize = (files: File[], isPremium: boolean): File[] => {
  if (isPremium) return files;
  
  const validFiles = files.filter(f => f.size <= FREE_FILE_SIZE_LIMIT);
  const blockedCount = files.length - validFiles.length;
  
  if (blockedCount > 0) {
    toast({
      title: "Some files too large for free plan",
      description: `${blockedCount} file(s) exceed the 10MB free limit. Upgrade to Premium for unlimited file sizes.`,
      variant: "destructive",
    });
  }
  
  return validFiles;
};
