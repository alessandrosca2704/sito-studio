import React, { useEffect, useRef } from 'react';
import 'quill/dist/quill.snow.css';

const toolbar = [
  [{ header: [1, 2, 3, false] }],
  ['bold', 'italic', 'underline', 'strike'],
  [{ list: 'ordered' }, { list: 'bullet' }],
  ['link', 'blockquote', 'code-block'],
  [{ align: [] }],
  [{ color: [] }, { background: [] }],
  ['clean'],
];

export default function RichEditor({ value = '', onChange, placeholder = 'Scrivi qui...' }) {
  const elRef = useRef(null);
  const qRef = useRef(null);

  useEffect(() => {
    if (!elRef.current) return;
    let active = true;
    import('quill').then(({ default: Quill }) => {
      if (!active || !elRef.current) return;
      if (!qRef.current) {
        qRef.current = new Quill(elRef.current, { theme: 'snow', modules: { toolbar }, placeholder });
        qRef.current.on('text-change', () => onChange?.(qRef.current.root.innerHTML));
      }
      if (value != null && qRef.current.root.innerHTML !== value) qRef.current.root.innerHTML = value;
    });
    return () => { active = false; };
  }, [value, placeholder, onChange]);

  return <div className="quill-editor" ref={elRef} />;
}

