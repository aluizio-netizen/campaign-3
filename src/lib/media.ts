/**
 * Resolve a URL pública de um arquivo de mídia.
 *
 * Local: NEXT_PUBLIC_MEDIA_BASE_URL vazio -> serve de /public (ex.: /media/...).
 * Produção (Render): defina NEXT_PUBLIC_MEDIA_BASE_URL com a URL do bucket
 *   (R2/S3/CDN), ex.: "https://cdn.seusite.com". O caminho salvo no banco
 *   (/media/audio/...) é apenas concatenado ao base.
 *
 * Sincronize a pasta public/media para o bucket mantendo o prefixo "media/"
 * (ex.: `aws s3 sync public/media s3://SEU-BUCKET/media`).
 */
export function mediaUrl(src: string): string {
  if (!src) return src;
  if (/^https?:\/\//i.test(src)) return src; // já é uma URL absoluta
  const base = (process.env.NEXT_PUBLIC_MEDIA_BASE_URL ?? "").replace(/\/$/, "");
  return base ? base + (src.startsWith("/") ? src : `/${src}`) : src;
}
