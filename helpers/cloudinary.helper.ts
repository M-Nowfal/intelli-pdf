export function getPublicIdFromUrl(url: string) {
  const regex = /.*\/(avatars\/[^.]+)\./; 
  const match = url.match(regex);
  return match ? match[1] : null;
}

export function getOptimizedAvatar(url: string | null | undefined) {
  if (!url || !url.includes("cloudinary.com")) return url || undefined;

  return url.replace("/upload/", "/upload/c_fill,g_face,w_400,h_400,q_auto/");
}