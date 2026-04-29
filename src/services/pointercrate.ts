/**
 * Service to interact with the Pointercrate API
 */

export interface Demon {
  id: number;
  position: number;
  name: string;
  video: string;
  publisher: {
    id: number;
    name: string;
  };
  verifier: {
    id: number;
    name: string;
  };
}

export interface DemonDetail extends Demon {
  thumbnail: string;
  description: string;
  records: Array<{
    id: number;
    player: { name: string };
    progress: number;
    video: string;
  }>;
}

const BASE_URL = 'https://pointercrate.com/api/v2';

export async function getDemonList(limit = 50, after = 0): Promise<Demon[]> {
  const response = await fetch(`${BASE_URL}/demons/listed/?limit=${limit}&after=${after}`);
  if (!response.ok) throw new Error('Failed to fetch demon list');
  return response.json();
}

export async function getDemonDetail(id: number): Promise<DemonDetail> {
  const response = await fetch(`${BASE_URL}/demons/${id}`);
  if (!response.ok) throw new Error('Failed to fetch demon details');
  const data = await response.json();
  return data.data;
}

export function getYoutubeThumbnail(url: string): string {
  if (!url) return 'https://picsum.photos/seed/gd/400/225';
  const videoIdMatch = url.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([^&?]+)/);
  const videoId = videoIdMatch ? videoIdMatch[1] : null;
  return videoId ? `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg` : 'https://picsum.photos/seed/gd/400/225';
}
