import { Check, Clock3, Feather, Sunrise } from "lucide-react";
import type { ClosureMapState } from "../types";
const columns = [
  { key: "done", label: "完成", icon: Check },
  { key: "tomorrow", label: "明天", icon: Sunrise },
  { key: "waiting", label: "等待", icon: Clock3 },
  { key: "release", label: "放下", icon: Feather },
] as const;
export function ClosureMap({ map }: { map: ClosureMapState }) {
  return <aside className="closure-map" aria-label="收尾地图"><h2>今晚的去处</h2>{columns.map(({ key, label, icon: Icon }) => <section key={key} className={`map-lane map-${key}`}><header><Icon /><span>{label}</span><b>{map[key].length}</b></header><div>{map[key].length ? map[key].map((item) => <p className="map-item" key={item.id}>{item.summary}</p>) : <span className="map-empty">—</span>}</div></section>)}</aside>;
}
