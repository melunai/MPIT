import  { useMemo } from "react";

type Provider = "yandex" | "osm";

export default function MapCard({
  from,
  to,
  provider = "osm",
  zoom = 13
}: {
  from: { lat: number; lon: number };
  to: { lat: number; lon: number };
  provider?: Provider;
  zoom?: number;
}) {
  const center = { lat: (from.lat + to.lat) / 2, lon: (from.lon + to.lon) / 2 };

  const src = useMemo(() => {
    if (provider === "yandex") {
      return `https://static-maps.yandex.ru/1.x/?lang=ru_RU&ll=${center.lon},${center.lat}&z=${zoom}&size=450,260&pt=${from.lon},${from.lat},pm2blm~${to.lon},${to.lat},pm2grm&l=map`;
    }
    return `https://staticmap.openstreetmap.de/staticmap.php?center=${center.lat},${center.lon}&zoom=${zoom}&size=450x260&markers=${from.lat},${from.lon},lightblue1|${to.lat},${to.lon},green&maptype=mapnik`;
  }, [from, to, center.lat, center.lon, zoom, provider]);

  return (
    <div className="rounded-[16px] overflow-hidden border border-neutral-200 dark:border-neutral-800 bg-neutral-200">
      <div className="relative h-[220px] w-full">
        <img src={src} alt="Маршрут" className="w-full h-full object-cover" />
        <div className="absolute right-2 top-2 flex flex-col gap-2">
          <button className="h-8 w-8 rounded-full bg-white/90 shadow text-xl leading-8">+</button>
          <button className="h-8 w-8 rounded-full bg-white/90 shadow text-xl leading-8">−</button>
        </div>
        <div className="absolute left-2 top-2 px-2 py-1 rounded-md text-xs font-medium text-white" style={{background:"#2aa84a"}}>
          20 мин. • 4,2 км
        </div>
        <div className="absolute right-10 top-3 px-2 py-1 rounded-md text-xs font-medium text-white" style={{background:"#2a75e6"}}>
          2 мин. • 331 м
        </div>
      </div>
    </div>
  );
}
