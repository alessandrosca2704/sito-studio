export function IconChart({ size=48, color='var(--brand)' }){
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M8 8v32h32" stroke={color} strokeWidth="2.5" strokeLinecap="round"/>
      <path d="M14 30l8-10 6 6 10-14" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
      <circle cx="38" cy="12" r="2" fill={color}/>
    </svg>
  );
}

export function IconTarget({ size=48, color='var(--brand)' }){
  return (
    <svg
  width={size}
  height={size}
  viewBox="0 0 48 48"
  fill="none"
  xmlns="http://www.w3.org/2000/svg"
  aria-hidden="true"
>
  <g
    stroke={color}
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    vectorEffect="non-scaling-stroke"
    fill="none"
  >
    <circle cx="24" cy="24" r="16" />
    <circle cx="24" cy="24" r="9" />
    {/* tacche cardinali, tutte lunghe 4px dal bordo del cerchio esterno */}
    <path d="M24 8V4" />
    <path d="M40 24H44" />
    <path d="M24 40V44" />
    <path d="M8 24H4" />
  </g>
  <circle cx="24" cy="24" r="3" fill={color} />
</svg>
  );
}

export function IconBars({ size=48, color='var(--brand)' }){
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M8 40h6V22H8v18zm13 0h6V12h-6v28zm13 0h6V18h-6v22z" stroke={color} strokeWidth="2.5" fill="none"/>
      <path d="M6 40h36" stroke={color} strokeWidth="2.5"/>
    </svg>
  );
}
export function IconMore({ size=48, color='var(--brand)' }){
  return (
   <svg width="48" height="48" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
    <g fill="#2563EB">
    <circle cx="16" cy="24" r="3"/>
    <circle cx="24" cy="24" r="3"/>
    <circle cx="32" cy="24" r="3"/>
  </g>
</svg>
  );
}

export function IconScale({ size=48, color='var(--brand)' }){
  return (
   <svg
  width={size}
  height={size}
  viewBox="0 0 48 48"
  fill="none"
  xmlns="http://www.w3.org/2000/svg"
  aria-hidden="true"
>
  <g stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" fill="none">
    {/* colonna e perno centrale */}
    <path d="M24 8V34" />
    <circle cx="24" cy="14" r="2" />

    {/* trave */}
    <path d="M12 14H36" />

    {/* funi sinistra */}
    <path d="M14 14L8 28M14 14L20 28" />
    {/* piattino sinistro */}
    <path d="M8 28Q14 34 20 28" />

    {/* funi destra */}
    <path d="M34 14L28 28M34 14L40 28" />
    {/* piattino destro */}
    <path d="M28 28Q34 34 40 28" />

    {/* base */}
    <path d="M24 34V36M16 36H32" />
  </g>

  {/* puntale superiore (decorativo) */}
  <circle cx="24" cy="8" r="2" fill={color} />
</svg>

  );
}

export function IconHandshake({ size=48, color='var(--brand)' }){
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M6 18l10 2 6-4 6 4 10-2" stroke={color} strokeWidth="2.5" strokeLinejoin="round"/>
      <path d="M14 20l6 10m-2-8l6 10m-2-8l6 10" stroke={color} strokeWidth="2.5" strokeLinecap="round"/>
      <path d="M4 16l6-6h8l6 4m20 2l-6-6h-8l-6 4" stroke={color} strokeWidth="2.5"/>
    </svg>
  );
}

export function IconPhone({ size=24, color='var(--brand)' }){
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M6.5 3h4l1.5 4-2 1.5a12 12 0 006.5 6.5L18 13l4 1.5v4a2 2 0 01-2 2C10.06 20.5 3.5 13.94 3.5 6a2 2 0 012-2z" stroke={color} strokeWidth="1.8" fill="none"/>
    </svg>
  );
}

export function IconLinkedIn({ size=24, color='currentColor' }){
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M4 3a2 2 0 110 4 2 2 0 010-4zM4 8h4v12H4V8zm6 0h3v2h.1c.4-.8 1.5-1.7 3.1-1.7C19 8.3 20 10 20 12.8V20h-4v-6c0-1.5-.5-2.6-1.8-2.6-1 0-1.6.7-1.9 1.4-.1.2-.1.6-.1.9V20h-4V8z" fill={color}/>
    </svg>
  );
}

export function IconFacebook({ size=24, color='currentColor' }){
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M13 20v-7h2.5l.5-3H13V8.2c0-.9.3-1.5 1.6-1.5H16V4.1C15.7 4 14.9 4 14 4c-2.3 0-3.9 1.4-3.9 3.9V10H7v3h3v7h3z" fill={color}/>
    </svg>
  );
}

