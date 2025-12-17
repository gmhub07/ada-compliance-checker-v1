import React from 'react';

export default function HtmlInput({ html, setHtml, onSubmit, loading }) {
  return (
    <>
      <textarea
        value={html}
        onChange={e => setHtml(e.target.value)}
        placeholder="Paste or write HTML here..."
        style={{ width: '100%', height: 250 }}
      />
      <button onClick={onSubmit} disabled={loading}>
        {loading ? 'Checking...' : 'Check Accessibility'}
      </button>
    </>
  );
}
