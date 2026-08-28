export function ClosureCoverage({ resolved, total }: { resolved: number; total: number }) {
  const percent = total ? Math.round((resolved / total) * 100) : 100;
  return <div className="closure-coverage" aria-label={`已安放 ${resolved} 项，共 ${total} 项`}><div><span>已安放 {resolved}</span><span>还悬着 {Math.max(0, total - resolved)}</span></div><progress max="100" value={percent}>{percent}%</progress></div>;
}
