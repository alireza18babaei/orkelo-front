const LOCAL_HOSTNAMES = new Set(["localhost", "127.0.0.1"]);

export const getBackendOrigin = () => {
  const apiBase = import.meta.env.VITE_API_BASE_URL;
  try {
    return new URL(String(apiBase)).origin;
  } catch {
    return "";
  }
};

export const resolveUserAvatarUrl = (value) => {
  const raw = String(value || "").trim();
  if (!raw) return "";

  if (raw.startsWith("blob:") || raw.startsWith("data:")) return raw;

  const backendOrigin = getBackendOrigin();

  if (/^https?:\/\//i.test(raw)) {
    if (!backendOrigin) return raw;
    try {
      const parsed = new URL(raw);
      if (LOCAL_HOSTNAMES.has(parsed.hostname)) {
        return `${backendOrigin}${parsed.pathname}${parsed.search}${parsed.hash}`;
      }
    } catch {
      return raw;
    }
    return raw;
  }

  if (!backendOrigin) return raw;

  const cleaned = raw.replace(/^\/+/, "");

  if (cleaned.startsWith("storage/")) {
    return `${backendOrigin}/${cleaned}`;
  }

  if (cleaned.includes("/")) {
    return `${backendOrigin}/${cleaned}`;
  }

  // DB values like "avatar.jpg" are usually served from "/storage/avatar.jpg".
  return `${backendOrigin}/storage/${cleaned}`;
};
