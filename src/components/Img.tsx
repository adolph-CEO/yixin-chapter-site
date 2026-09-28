/* eslint-disable @next/next/no-img-element */
type Props = { src?: string; alt: string; className?: string; dark?: boolean; label?: string };

/** 有圖就顯示圖，沒圖顯示「圖片待置換」佔位，版面不會塌 */
export default function Img({ src, alt, className = "", dark, label = "圖片待置換" }: Props) {
  if (src) return <img src={src} alt={alt} className={`object-cover ${className}`} loading="lazy" />;
  return (
    <div role="img" aria-label={alt} className={`${dark ? "ph-dark text-white/40" : "ph text-black/35"} ${className.includes("absolute") ? "" : "relative"} ${className}`}>
      {label && <span className="eyebrow !text-[10px] absolute top-3 right-3">{label}</span>}
    </div>
  );
}
