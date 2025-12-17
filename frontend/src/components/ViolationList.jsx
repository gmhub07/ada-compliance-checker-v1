import React from 'react';

export default function ViolationList({ violations, onHighlight }) {
  if (!violations.length) return <p>No violations found.</p>;

  return (
    <ul>
      {violations.map((v, i) => (
        <li
          key={i}
          onClick={() => onHighlight(v.selector)}
          style={{ cursor: 'pointer', color: 'red', marginBottom: 8 }}
          title={v.message}
        >
          <strong>{v.ruleId}</strong>: {v.message}
        </li>
      ))}
    </ul>
  );
}
