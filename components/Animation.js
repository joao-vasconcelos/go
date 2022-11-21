import { useEffect, useRef } from 'react';
import lottie from 'lottie-web';

/* * */
/* ANIMATION */
/* Explanation needed. */
/* * */

export default function Animation({ name }) {
  //

  const ref = useRef(null);

  useEffect(() => {
    if (lottie && ref.current) {
      const animation = lottie.loadAnimation({
        container: ref.current,
        renderer: 'svg',
        loop: true,
        autoplay: true,
        // path to your animation file, place it inside public folder
        path: '/media/animations/' + name + '.json',
      });

      return () => animation.destroy();
    }
  }, [name]);

  return <div ref={ref} />;
}
