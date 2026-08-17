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
    <g fill={color}>
    <circle cx="16" cy="24" r="3"/>
    <circle cx="24" cy="24" r="3"/>
    <circle cx="32" cy="24" r="3"/>
  </g>
</svg>
  );
}
export function IconLaptop({ size=48, color='var(--brand)' }){
  return (
    <svg width="48" height="48" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg" fill="none" aria-hidden="true">
      <g stroke="#2563EB" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <rect x="8" y="8" width="32" height="20" rx="3"/>
        <circle cx="24" cy="12" r="1" fill="#2563EB" stroke="none"/>
        <path d="M6 32h36l-3 6H9l-3-6z"/>
        <path d="M22 32h4"/>
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
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640" aria-hidden="true">
  
  <path fill="#2563EB" d="M300.9 149.2L184.3 278.8C179.7 283.9 179.9 291.8 184.8 296.7C215.3 327.2 264.8 327.2 295.3 296.7L327.1 264.9C331.3 260.7 336.6 258.4 342 258C348.8 257.4 355.8 259.7 361 264.9L537.6 440L608 384L608 96L496 160L472.2 144.1C456.4 133.6 437.9 128 418.9 128L348.5 128C347.4 128 346.2 128 345.1 128.1C328.2 129 312.3 136.6 300.9 149.2zM148.6 246.7L255.4 128L215.8 128C190.3 128 165.9 138.1 147.9 156.1L144 160L32 96L32 384L188.4 514.3C211.4 533.5 240.4 544 270.3 544L286 544L279 537C269.6 527.6 269.6 512.4 279 503.1C288.4 493.8 303.6 493.7 312.9 503.1L353.9 544.1L362.9 544.1C382 544.1 400.7 539.8 417.7 531.8L391 505C381.6 495.6 381.6 480.4 391 471.1C400.4 461.8 415.6 461.7 424.9 471.1L456.9 503.1L474.4 485.6C483.3 476.7 485.9 463.8 482 452.5L344.1 315.7L329.2 330.6C279.9 379.9 200.1 379.9 150.8 330.6C127.8 307.6 126.9 270.7 148.6 246.6z"/>
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

export function IconWhatsapp({ size=24, color='currentColor' }){
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16"
        width="24" height="24" fill={color} aria-hidden="true">
      <path d="M13.601 2.326A7.85 7.85 0 0 0 7.994 0C3.627 0 .068 3.558.064 7.926c0 1.399.366 2.76 1.057 3.965L0 16l4.204-1.102a7.9 7.9 0 0 0 3.79.965h.004c4.368 0 7.926-3.558 7.93-7.93A7.9 7.9 0 0 0 13.6 2.326zM7.994 14.521a6.6 6.6 0 0 1-3.356-.92l-.24-.144-2.494.654.666-2.433-.156-.251a6.56 6.56 0 0 1-1.007-3.505c0-3.626 2.957-6.584 6.591-6.584a6.56 6.56 0 0 1 4.66 1.931 6.56 6.56 0 0 1 1.928 4.66c-.004 3.639-2.961 6.592-6.592 6.592m3.615-4.934c-.197-.099-1.17-.578-1.353-.646-.182-.065-.315-.099-.445.099-.133.197-.513.646-.627.775-.114.133-.232.148-.43.05-.197-.1-.836-.308-1.592-.985-.59-.525-.985-1.175-1.103-1.372-.114-.198-.011-.304.088-.403.087-.088.197-.232.296-.346.1-.114.133-.198.198-.33.065-.134.034-.248-.015-.347-.05-.099-.445-1.076-.612-1.47-.16-.389-.323-.335-.445-.34-.114-.007-.247-.007-.38-.007a.73.73 0 0 0-.529.247c-.182.198-.691.677-.691 1.654s.71 1.916.81 2.049c.098.133 1.394 2.132 3.383 2.992.47.205.84.326 1.129.418.475.152.904.129 1.246.08.38-.058 1.171-.48 1.338-.943.164-.464.164-.86.114-.943-.049-.084-.182-.133-.38-.232"/>
    </svg>

  );
}

export function IconShare({size=42 , color='currentColor'}){
  return(
  <svg fill={color} width={size} height={size} viewBox="0 0 50 50" xmlns="http://www.w3.org/2000/svg">
    <path d="M30.3 13.7L25 8.4l-5.3 5.3-1.4-1.4L25 5.6l6.7 6.7z"/>
    <path d="M24 7h2v21h-2z"/>
    <path d="M35 40H15c-1.7 0-3-1.3-3-3V19c0-1.7 1.3-3 3-3h7v2h-7c-.6 0-1 .4-1 1v18c0 .6.4 1 1 1h20c.6 0 1-.4 1-1V19c0-.6-.4-1-1-1h-7v-2h7c1.7 0 3 1.3 3 3v18c0 1.7-1.3 3-3 3z"/>
  </svg>

  )
}
