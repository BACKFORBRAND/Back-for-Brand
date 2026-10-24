import React, { useEffect } from 'react';

/**
 * Lightweight, accessible motion layer for public pages and dashboard tabs.
 * Re-observes content when the app switches views or renders a new tab.
 */
export const MotionExperience: React.FC = () => {
  useEffect(() => {
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduceMotion) return;

    const observed = new WeakSet<Element>();
    let observer: IntersectionObserver | null = null;

    const revealCurrentContent = () => {
      if (!observer) return;
      const main = document.querySelector('main');
      if (!main) return;

      Array.from(main.children).forEach((target, index) => {
        if (observed.has(target)) return;
        observed.add(target);
        const element = target as HTMLElement;
        element.classList.add('motion-reveal');
        element.style.setProperty('--motion-delay', `${Math.min(index * 70, 280)}ms`);
        observer?.observe(element);
      });
    };

    if ('IntersectionObserver' in window) {
      observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('motion-visible');
            observer?.unobserve(entry.target);
          }
        });
      }, { threshold: 0.08, rootMargin: '0px 0px -40px 0px' });
    }

    revealCurrentContent();

    const mutationObserver = new MutationObserver(() => revealCurrentContent());
    mutationObserver.observe(document.body, { childList: true, subtree: true });

    return () => {
      mutationObserver.disconnect();
      observer?.disconnect();
    };
  }, []);

  return null;
};
