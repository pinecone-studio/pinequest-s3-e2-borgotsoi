/** Build the app URL that streams a file from R2 (`/api/exam-file`). */
export function examFileDownloadUrl(requestOrigin: string, key: string): string {
  return `${requestOrigin}/api/exam-file?k=${encodeURIComponent(key)}`;
}
