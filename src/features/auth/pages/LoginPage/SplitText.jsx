import { useRef, useEffect, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const SplitText = ({
  text,
  className = '',
  delay = 100,
  duration = 0.6,
  ease = 'power3.out',
  splitType = 'chars',
  from = { opacity: 0, y: 40 },
  to = { opacity: 1, y: 0 },
  threshold = 0.1,
  rootMargin = '-100px',
  textAlign = 'center',
  tag = 'p',
  onLetterAnimationComplete,
  playOnMount = false,
  loop = false,
  loopDelay = 0.8,
  color = 'inherit',
}) => {
  const ref = useRef(null);
  const animationCompletedRef = useRef(false);
  const [fontsLoaded, setFontsLoaded] = useState(false);

  useEffect(() => {
    if (document.fonts.status === 'loaded') {
      setFontsLoaded(true);
    } else {
      document.fonts.ready.then(() => {
        setFontsLoaded(true);
      });
    }
  }, []);

  useEffect(() => {
    if (!ref.current || !text || !fontsLoaded) return;
    const el = ref.current;

    // cleanup any previous content
    el.innerHTML = '';

    const startPct = (1 - threshold) * 100;
    const marginMatch = /^(-?\d+(?:\.\d+)?)(px|em|rem|%)?$/.exec(rootMargin);
    const marginValue = marginMatch ? parseFloat(marginMatch[1]) : 0;
    const marginUnit = marginMatch ? marginMatch[2] || 'px' : 'px';
    const sign =
      marginValue === 0
        ? ''
        : marginValue < 0
          ? `-=${Math.abs(marginValue)}${marginUnit}`
          : `+=${marginValue}${marginUnit}`;
    const start = `top ${startPct}%${sign}`;

    // build spans for chars or words
    const buildSpans = () => {
      if (splitType === 'words') {
        return text.split(/(\s+)/).map(part => {
          if (/^\s+$/.test(part)) return part;
          return `<span class="split-word" style="display:inline-block;white-space:nowrap">${part}</span>`;
        }).join('');
      }
      // default: chars
      return Array.from(text).map(ch => (ch === ' ' ? ' ' : `<span class="split-char" style="display:inline-block">${ch}</span>`)).join('');
    };

    el.innerHTML = buildSpans();

    const targets = el.querySelectorAll('.split-char, .split-word');

    const onComplete = () => {
      animationCompletedRef.current = true;
      onLetterAnimationComplete?.();
    };

    const tweenOptions = {
      ...to,
      duration,
      ease,
      stagger: delay / 1000,
      onComplete,
      willChange: 'transform, opacity',
      force3D: true,
      repeat: loop ? -1 : 0,
      repeatDelay: loop ? loopDelay : 0,
    };

    if (!playOnMount) {
      tweenOptions.scrollTrigger = {
        trigger: el,
        start,
        once: true,
        fastScrollEnd: true,
        anticipatePin: 0.4,
      };
    }

    const tween = gsap.fromTo(targets, { ...from }, tweenOptions);

    return () => {
      tween.kill();
      ScrollTrigger.getAll().forEach(st => {
        if (st.trigger === el) st.kill();
      });
      // restore plain text
      try {
        el.innerHTML = text;
      } catch (_) {
        /* noop */
      }
    };
  }, [text, delay, duration, ease, splitType, JSON.stringify(from), JSON.stringify(to), threshold, rootMargin, fontsLoaded, onLetterAnimationComplete, playOnMount, loop, loopDelay]);

  const renderTag = () => {
    const style = {
      textAlign,
      overflow: 'hidden',
      display: 'inline-block',
      whiteSpace: 'normal',
      wordWrap: 'break-word',
      willChange: 'transform, opacity',
      color,
    };
    const classes = `split-parent ${className}`;
    switch (tag) {
      case 'h1':
        return (
          <h1 ref={ref} style={style} className={classes}>
            {text}
          </h1>
        );
      case 'h2':
        return (
          <h2 ref={ref} style={style} className={classes}>
            {text}
          </h2>
        );
      case 'h3':
        return (
          <h3 ref={ref} style={style} className={classes}>
            {text}
          </h3>
        );
      case 'h4':
        return (
          <h4 ref={ref} style={style} className={classes}>
            {text}
          </h4>
        );
      case 'h5':
        return (
          <h5 ref={ref} style={style} className={classes}>
            {text}
          </h5>
        );
      case 'h6':
        return (
          <h6 ref={ref} style={style} className={classes}>
            {text}
          </h6>
        );
      default:
        return (
          <p ref={ref} style={style} className={classes}>
            {text}
          </p>
        );
    }
  };
  return renderTag();
};

export default SplitText;
