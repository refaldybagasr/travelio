import { useEffect, useRef } from 'react';
import rater from 'rater-js';

export default function StarRating({ averageRating, ratingsCount }) {
  const containerRef = useRef(null);

  useEffect(() => {
    if (averageRating == null || !containerRef.current) return;

    const instance = rater({
      element: containerRef.current,
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
      containerRef.current.innerHTML = '';
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
