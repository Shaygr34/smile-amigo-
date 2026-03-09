export interface InstagramPost {
  id: string;
  caption?: string;
  media_type: "IMAGE" | "VIDEO" | "CAROUSEL_ALBUM";
  media_url: string;
  thumbnail_url?: string;
  permalink: string;
  timestamp: string;
}

export async function getInstagramFeed(limit = 12): Promise<InstagramPost[]> {
  const token = process.env.INSTAGRAM_ACCESS_TOKEN;
  const userId = process.env.INSTAGRAM_USER_ID;
  if (!token || !userId) return [];

  try {
    const res = await fetch(
      `https://graph.instagram.com/v21.0/${userId}/media?fields=id,caption,media_type,media_url,thumbnail_url,permalink,timestamp&limit=${limit}&access_token=${token}`,
      { next: { revalidate: 3600 } }
    );
    if (!res.ok) return [];
    const data = await res.json();
    return (data.data || []) as InstagramPost[];
  } catch {
    return [];
  }
}

export function getPostImageUrl(post: InstagramPost): string {
  if (post.media_type === "VIDEO") return post.thumbnail_url || post.media_url;
  return post.media_url;
}
