export function downloadFile(file: Blob, filename: string): void {
    const a = document.createElement('a');
    const url = URL.createObjectURL(file);
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
}
