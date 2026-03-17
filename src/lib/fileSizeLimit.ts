/**
 * All tools are FREE with no file size limits.
 */

export const FREE_FILE_SIZE_LIMIT = Infinity;

export const formatFileSize = (bytes: number): string => {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
};

export const checkFileSizeLimit = (_file: File, _isPremium: boolean): boolean => {
  return true;
};

export const filterFilesBySize = (files: File[], _isPremium: boolean): File[] => {
  return files;
};
