/**
 * Accepts either a raw folder ID or a Figma URL containing the folder ID
 * (e.g. https://www.figma.com/files/folder/123456/Name or the legacy
 * /files/project/123456/Name format) and returns the numeric ID string.
 */
export function parseFolderId(input: string): string {
  const match = input.match(/(?:folder|project)\/(\d+)/);
  return match ? match[1] : input.trim();
}
