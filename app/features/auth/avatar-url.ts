const AVATAR_BASE_URL = "http://localhost:84/storage/avatars";

export function resolveAvatarUrl(userId: string, avatarUrl?: string | null) {
  if (!avatarUrl) {
    return null;
  }

  const sanitized = avatarUrl.split("?")[0];
  const filename = sanitized.split("/").pop();

  if (!filename) {
    return null;
  }

  return `${AVATAR_BASE_URL}/${userId}/${filename}`;
}
