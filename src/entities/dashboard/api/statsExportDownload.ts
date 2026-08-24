export function downloadStatsXlsx(blob: Blob, filename: string) {
  if (typeof window === "undefined") {
    return;
  }

  const objectUrl = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = objectUrl;
  anchor.download = filename;
  anchor.rel = "noopener";
  anchor.style.display = "none";
  document.body.appendChild(anchor);
  anchor.click();
  document.body.removeChild(anchor);
  window.setTimeout(() => URL.revokeObjectURL(objectUrl), 1000);
}

export function buildStatsXlsxFallbackFilename(startDate: string, endDate: string) {
  const exportedAt = new Date().toISOString().slice(0, 10);
  return `Statystyka_Autolux_${exportedAt}_${startDate}_${endDate}.xlsx`;
}
