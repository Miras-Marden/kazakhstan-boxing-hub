import { useEffect } from 'react';

export function useDocumentTitle(title: string, description?: string) {
  useEffect(() => {
    const suffix = 'KPBF REC';
    const fullTitle = title ? `${title} | ${suffix}` : suffix;
    document.title = fullTitle;

    if (description) {
      const ensureMeta = (selector: string, attr: 'name' | 'property', value: string) => {
        let meta = document.querySelector(selector);
        if (!meta) {
          meta = document.createElement('meta');
          meta.setAttribute(attr, value);
          document.head.appendChild(meta);
        }
        return meta;
      };

      ensureMeta('meta[name="description"]', 'name', 'description').setAttribute('content', description);
      ensureMeta('meta[property="og:title"]', 'property', 'og:title').setAttribute('content', fullTitle);
      ensureMeta('meta[property="og:description"]', 'property', 'og:description').setAttribute('content', description);
      ensureMeta('meta[name="twitter:title"]', 'name', 'twitter:title').setAttribute('content', fullTitle);
      ensureMeta('meta[name="twitter:description"]', 'name', 'twitter:description').setAttribute('content', description);
    }

    return () => { document.title = suffix; };
  }, [title, description]);
}
