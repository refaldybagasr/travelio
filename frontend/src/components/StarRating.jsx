import { useEffect, useRef } from 'react';
import rater from 'rater-js';

export default function StarRating({ averageRating, ratingsCount }) {
  const containerRef = useRef(null);

  useEffect(() => {
    if (averageRating == null || !containerRef.current) return;

    // Capture the node now, not in the cleanup: React nulls out
    // containerRef.current synchronously once the DOM node is actually
    // removed (e.g. on unmount, or when averageRating flips to null and
    // this div is replaced by the "No ratings yet" span), but the effect
    // cleanup runs in a later, deferred pass. Reading containerRef.current
    // inside the cleanup would then risk it already being null.
    const node = containerRef.current;

    const instance = rater({
      element: node,
      rating: averageRating,
      max: 5,
      readOnly: true,
      step: 0.5,
    });

    return () => {
      // rater-js appends DOM nodes to the container but its dispose()
      // only removes event listeners, not the appended nodes. Without
      // clearing the container here, React 18 StrictMode's dev-mode
      // double-invoke of effects (and any re-run of this effect) would
      // stack duplicate star widgets inside the same div.
      instance.dispose();
      node.innerHTML = '';
    };
  }, [averageRating]);

  if (averageRating == null) {
    return <span className="text-sm text-gray-400">No ratings yet</span>;
  }

  return (
    <div className="flex items-center gap-2">
      <div ref={containerRef}></div>
      <span className="text-sm text-gray-500">
        {averageRating.toFixed(1)} ({ratingsCount ?? 0})
      </span>
    </div>
  );
}
