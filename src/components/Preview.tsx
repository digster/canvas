import { useEffect, useRef, memo } from 'react';

interface PreviewProps {
  srcDoc: string;
}

export const Preview = memo(function Preview({ srcDoc }: PreviewProps) {
  const iframeRef = useRef<HTMLIFrameElement>(null);

  useEffect(() => {
    if (iframeRef.current) {
      // Force iframe reload to clear previous state
      const iframe = iframeRef.current;
      iframe.srcdoc = srcDoc;
    }
  }, [srcDoc]);

  return (
    <div className="preview-container">
      <iframe
        ref={iframeRef}
        title="preview"
        sandbox="allow-scripts"
        className="preview-iframe"
      />
    </div>
  );
});

