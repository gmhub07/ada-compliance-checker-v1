import React, { useEffect, useRef, useState } from 'react';

export default function HtmlPreview({ html, highlightedSelector }) {
  const iframeRef = useRef(null);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const iframe = iframeRef.current;
    if (!iframe) return;

    const handleLoad = () => {
      try {
        const doc = iframe.contentDocument || iframe.contentWindow.document;
        if (!doc) return;

        // Clear any existing highlights
        doc.querySelectorAll('.highlight').forEach(el => {
          el.classList.remove('highlight');
        });

        // Apply highlighting if selector is provided
        if (highlightedSelector && isLoaded) {
          try {
            const elements = doc.querySelectorAll(highlightedSelector);
            elements.forEach(el => {
              el.classList.add('highlight');
              el.scrollIntoView({ behavior: 'smooth', block: 'center' });
            });
          } catch (error) {
            console.warn('Could not highlight element:', error);
          }
        }
      } catch (error) {
        console.warn('Error accessing iframe document:', error);
      }
    };

    iframe.addEventListener('load', handleLoad);
    return () => iframe.removeEventListener('load', handleLoad);
  }, [html, highlightedSelector, isLoaded]);

  useEffect(() => {
    const iframe = iframeRef.current;
    if (!iframe) return;

    try {
      const doc = iframe.contentDocument || iframe.contentWindow.document;
      if (!doc) return;

      doc.open();
      doc.write(`
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1">
          <style>
            html, body {
              margin: 0;
              padding: 16px;
              font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
              line-height: 1.6;
              color: #333;
              height: 100%;
              min-height: 100%;
              box-sizing: border-box;
            }
            body {
              display: flex;
              flex-direction: column;
            }
            .content-wrapper {
              flex: 1;
              display: flex;
              flex-direction: column;
              min-height: 0;
            }
            .highlight {
              outline: 3px solid #ff6b35 !important;
              background-color: rgba(255, 107, 53, 0.1) !important;
              border-radius: 4px;
              padding: 2px;
              transition: all 0.3s ease;
            }
            h1, h2, h3, h4, h5, h6 {
              margin-top: 0;
              margin-bottom: 16px;
            }
            p {
              margin-bottom: 16px;
            }
            img {
              max-width: 100%;
              height: auto;
              border: 1px solid #ddd;
              border-radius: 4px;
            }
            a {
              color: #0066cc;
              text-decoration: none;
            }
            a:hover {
              text-decoration: underline;
            }
            code {
              background-color: #f5f5f5;
              padding: 2px 4px;
              border-radius: 3px;
              font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
            }
          </style>
        </head>
        <body>
          <div class="content-wrapper">
            ${html || '<p>No HTML content to preview</p>'}
          </div>
        </body>
        </html>
      `);
      doc.close();
      
      // Set loaded state after a short delay to ensure content is rendered
      setTimeout(() => setIsLoaded(true), 100);
    } catch (error) {
      console.warn('Error writing to iframe:', error);
    }
  }, [html]);

  return (
    <div style={{ position: 'relative', width: '100%', height: '100%', display: 'flex', flexDirection: 'column' }}>
      <iframe
        title="HTML Preview"
        ref={iframeRef}
        style={{
          width: '100%',
          height: '100%',
          border: 'none',
          borderRadius: '8px',
          backgroundColor: 'white',
          flex: '1',
          minHeight: '0'
        }}
        sandbox="allow-same-origin allow-scripts"
        onError={(e) => console.warn('Iframe error:', e)}
      />
      {!isLoaded && (
        <div
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            color: '#666',
            fontSize: '14px'
          }}
        >
          Loading preview...
        </div>
      )}
    </div>
  );
}
