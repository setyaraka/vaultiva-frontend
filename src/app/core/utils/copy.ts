export async function copyTextToClipboard(text: string): Promise<void> {
    try {
      await navigator.clipboard.writeText(text);
    } catch (err) {
      alert('Failed to copy. Please copy it manually.');
    }
  }
  