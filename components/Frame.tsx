import type { ReactNode } from "react";

/* A design-tool selection frame: outline, four handles, a name tag and an
   optional size tag. Decorative parts are hidden from assistive tech. */
export function Frame({ tag, size, children, className = "" }: { tag?: string; size?: string; children: ReactNode; className?: string }) {
  return (
    <div className={`frame ${className}`}>
      {tag ? <span className="frame__tag" aria-hidden="true">{tag}</span> : null}
      <i className="frame__h frame__h--tl" aria-hidden="true" />
      <i className="frame__h frame__h--tr" aria-hidden="true" />
      <i className="frame__h frame__h--bl" aria-hidden="true" />
      <i className="frame__h frame__h--br" aria-hidden="true" />
      {children}
      {size ? <span className="frame__size" aria-hidden="true">{size}</span> : null}
    </div>
  );
}
