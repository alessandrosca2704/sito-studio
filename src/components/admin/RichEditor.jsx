import React, { useEffect, useRef } from 'react';

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
    const Quill = window.Quill;
    if (!elRef.current || !Quill) return;
    if (!qRef.current) {
      qRef.current = new Quill(elRef.current, {
        theme: 'snow',
        modules: { toolbar },
        placeholder,
      });
      qRef.current.on('text-change', () => {
        onChange?.(qRef.current.root.innerHTML);
      });
    }
    // keep external value in sync
    if (qRef.current && value != null && qRef.current.root.innerHTML !== value) {
      qRef.current.root.innerHTML = value;
    }
  }, [value, placeholder, onChange]);

  return <div className="quill-editor" ref={elRef} />;
}

