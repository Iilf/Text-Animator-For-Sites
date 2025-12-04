import React, { useState, useEffect } from 'react';
import { Copy, Type, Sparkles, Activity, ArrowUp, Code, Maximize, Sun, Moon, AlignLeft, AlignCenter, AlignRight, ArrowUpCircle, MinusCircle, Link as LinkIcon, Eye, Clock, MoveHorizontal, ZoomIn, Aperture, RotateCcw, Download, Timer, RefreshCw, ArrowDownCircle, Shuffle, Bold, Italic } from 'lucide-react';

export default function App() {
  const [text, setText] = useState('Mix and match styles!');
  const [linkUrl, setLinkUrl] = useState('');
  
  // CHANGED: animations is now an array to support mixing
  const [animations, setAnimations] = useState<string[]>(['typewriter', 'neon']); 
  
  const [fontSize, setFontSize] = useState(40);
  const [textColor, setTextColor] = useState('#ffffff');
  const [bgColor, setBgColor] = useState('#000000');
  const [isTransparent, setIsTransparent] = useState(false);
  const [allowWrap, setAllowWrap] = useState(false);
  const [fontFamily, setFontFamily] = useState('Inter');
  
  // NEW: Font Styling State
  const [isBold, setIsBold] = useState(false);
  const [isItalic, setIsItalic] = useState(false);

  const [duration, setDuration] = useState(2);
  const [copied, setCopied] = useState(false);
  const [startOnView, setStartOnView] = useState(true);
  
  // Countdown State
  const [targetDate, setTargetDate] = useState('');
  const [countdownString, setCountdownString] = useState('00d 00h 00m 00s');

  // Alignment State
  const [alignH, setAlignH] = useState<'left' | 'center' | 'right'>('center');
  const [alignV, setAlignV] = useState<'flex-start' | 'center' | 'flex-end'>('center');

  const [stageMode, setStageMode] = useState<'dark' | 'light'>('dark');
  const [previewTypedText, setPreviewTypedText] = useState('');

  // Set default target date
  useEffect(() => {
    const date = new Date();
    date.setDate(date.getDate() + 1);
    const localIso = new Date(date.getTime() - (date.getTimezoneOffset() * 60000)).toISOString().slice(0, 16);
    setTargetDate(localIso);
  }, []);

  // Randomize Function
  const randomizeStyle = () => {
    const fonts = ['Inter', 'Roboto', 'Open Sans', 'Montserrat', 'Oswald', 'Playfair Display', 'Merriweather', 'Courier Prime', 'Pacifico', 'Dancing Script', 'Press Start 2P'];
    const colors = ['#ffffff', '#ff0055', '#0099ff', '#00ff99', '#ffaa00', '#aa00ff', '#ff00cc', '#ffff00'];
    const animOptions = ['typewriter', 'fadeup', 'neon', 'gradient', 'bounce', 'slide', 'zoom', 'blur', 'spin'];
    
    // Random Font & Color
    setFontFamily(fonts[Math.floor(Math.random() * fonts.length)]);
    setTextColor(colors[Math.floor(Math.random() * colors.length)]);
    setIsBold(Math.random() > 0.5);
    setIsItalic(Math.random() > 0.8);
    
    // Random Animations (1 or 2 mixed)
    const numAnims = Math.random() > 0.7 ? 2 : 1;
    const newAnims: string[] = [];
    
    for (let i = 0; i < numAnims; i++) {
        const randAnim = animOptions[Math.floor(Math.random() * animOptions.length)];
        if (!newAnims.includes(randAnim)) {
            newAnims.push(randAnim);
        }
    }
    setAnimations(newAnims);
  };

  // Toggle Animation Logic
  const toggleAnimation = (id: string) => {
    setAnimations(prev => {
      // Conflict Resolution
      if (id === 'countdown') {
         const clean = prev.filter(a => a !== 'typewriter' && a !== 'countdown');
         return [...clean, id];
      }
      if (id === 'typewriter') {
         const clean = prev.filter(a => a !== 'countdown' && a !== 'typewriter');
         return [...clean, id];
      }
      
      // Standard Toggle
      if (prev.includes(id)) {
        return prev.filter(a => a !== id);
      } else {
        return [...prev, id];
      }
    });
  };

  // Countdown Logic
  useEffect(() => {
    if (!animations.includes('countdown')) return;

    const interval = setInterval(() => {
      const now = new Date().getTime();
      const target = new Date(targetDate).getTime();
      const distance = target - now;

      if (distance < 0) {
        setCountdownString(text);
      } else {
        const days = Math.floor(distance / (1000 * 60 * 60 * 24));
        const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((distance % (1000 * 60)) / 1000);
        setCountdownString(`${days}d ${hours}h ${minutes}m ${seconds}s`);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [targetDate, animations, text]);

  // Helper to ensure URL is absolute
  const getSafeUrl = (url: string) => {
    if (!url) return '';
    const cleanUrl = url.trim();
    if (cleanUrl.startsWith('http://') || cleanUrl.startsWith('https://') || cleanUrl.startsWith('mailto:')) {
      return cleanUrl;
    }
    return `https://${cleanUrl}`;
  };

  // JS-based typewriter effect
  useEffect(() => {
    if (animations.includes('typewriter') && allowWrap) {
      setPreviewTypedText('');
      let currentIndex = 0;
      const charDelay = (duration * 1000) / Math.max(1, text.length);
      
      const intervalId = setInterval(() => {
        if (currentIndex < text.length) {
          setPreviewTypedText(prev => prev + text.charAt(currentIndex));
          currentIndex++;
        } else {
          clearInterval(intervalId);
        }
      }, charDelay);

      return () => clearInterval(intervalId);
    }
  }, [text, animations, allowWrap, duration]);

  // Render Preview Content
  const getPreviewContent = () => {
    const isCountdown = animations.includes('countdown');
    const isTypewriter = animations.includes('typewriter');

    const baseStyle: any = {
      color: textColor,
      fontSize: `${fontSize}px`,
      fontFamily: fontFamily,
      fontWeight: isBold ? 'bold' : 'normal',
      fontStyle: isItalic ? 'italic' : 'normal',
      textAlign: alignH,
      lineHeight: '1.2',
      whiteSpace: allowWrap ? 'normal' : 'nowrap',
      wordWrap: allowWrap ? 'break-word' : 'normal',
      textDecoration: 'none',
      cursor: linkUrl ? 'pointer' : 'default',
      animation: '', 
    };

    // Wrapper
    const Wrapper = ({ children, style, className }: any) => {
        if (linkUrl) {
            return (
                <a 
                    href={getSafeUrl(linkUrl)} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    style={{...style, display: style.display || 'inline-block'}} 
                    className={className}
                >
                    {children}
                </a>
            );
        }
        return <div style={style} className={className}>{children}</div>;
    };

    // --- Build Composite Styles ---
    const activeAnimationStrings: string[] = [];
    const specificStyle: any = { ...baseStyle };

    if (animations.includes('neon')) {
        specificStyle.textShadow = `0 0 5px #fff, 0 0 10px #fff, 0 0 20px ${textColor}, 0 0 30px ${textColor}, 0 0 40px ${textColor}`;
        activeAnimationStrings.push(`pulsate ${duration}s infinite alternate`);
    }
    if (animations.includes('gradient')) {
        specificStyle.background = `linear-gradient(to right, ${textColor}, #ff00cc, #3333ff, ${textColor})`;
        specificStyle.backgroundSize = '300% auto';
        specificStyle.WebkitBackgroundClip = 'text';
        specificStyle.WebkitTextFillColor = 'transparent';
        activeAnimationStrings.push(`shine ${duration}s linear infinite`);
    }

    if (animations.includes('fadeup')) activeAnimationStrings.push(`fadeInUp ${duration}s ease-out forwards`);
    if (animations.includes('bounce')) activeAnimationStrings.push(`bounceIn ${duration}s cubic-bezier(0.215, 0.610, 0.355, 1.000) both`);
    if (animations.includes('slide')) activeAnimationStrings.push(`slideIn ${duration}s ease-out forwards`);
    if (animations.includes('zoom')) activeAnimationStrings.push(`zoomIn ${duration}s ease-out forwards`);
    if (animations.includes('blur')) activeAnimationStrings.push(`blurIn ${duration}s ease-out forwards`);
    if (animations.includes('spin')) {
        activeAnimationStrings.push(`spinIn ${duration}s ease-out forwards`);
        specificStyle.transformStyle = 'preserve-3d';
    }

    // Typewriter CSS
    if (isTypewriter && !allowWrap) {
        specificStyle.display = 'inline-block';
        specificStyle.overflow = 'hidden';
        specificStyle.borderRight = `.15em solid ${textColor}`;
        specificStyle.whiteSpace = 'nowrap';
        specificStyle.margin = alignH === 'center' ? '0 auto' : (alignH === 'right' ? '0 0 0 auto' : '0');
        specificStyle.letterSpacing = '0.1em';
        specificStyle.maxWidth = '100%';
        activeAnimationStrings.push(`typing ${duration}s steps(${Math.max(1, text.length)}, end)`);
        activeAnimationStrings.push(`blink-caret-border .75s step-end infinite`);
    }

    if (activeAnimationStrings.length > 0) {
        specificStyle.animation = activeAnimationStrings.join(', ');
    }

    // --- Content Rendering ---
    
    // Case A: Countdown
    if (isCountdown) {
        return <Wrapper style={{...specificStyle, fontVariantNumeric: 'tabular-nums'}}>{countdownString}</Wrapper>;
    }

    // Case B: Multiline Typewriter (JS Based)
    if (isTypewriter && allowWrap) {
        return (
            <Wrapper style={{...specificStyle, whiteSpace: 'pre-wrap', display: 'block' }}>
                {previewTypedText}
                <span style={{ 
                    display: 'inline-block', 
                    width: '0.15em', 
                    height: '1em', 
                    backgroundColor: textColor,
                    verticalAlign: 'baseline',
                    marginLeft: '1px',
                    animation: 'blink-caret-opacity 0.75s step-end infinite'
                }}></span>
            </Wrapper>
        );
    }

    return <Wrapper style={specificStyle}>{text}</Wrapper>;
  };

  // Shared Keyframes
  const keyframesStyle = `
    @keyframes typing { from { width: 0 } to { width: 100% } }
    @keyframes blink-caret-border { from, to { border-color: transparent; } 50% { border-color: ${textColor}; } }
    @keyframes blink-caret-opacity { from, to { opacity: 0; } 50% { opacity: 1; } }
    @keyframes fadeInUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
    @keyframes pulsate { 100% { text-shadow: 0 0 4px #fff, 0 0 11px #fff, 0 0 19px #fff, 0 0 40px ${textColor}, 0 0 80px ${textColor}, 0 0 90px ${textColor}, 0 0 100px ${textColor}, 0 0 150px ${textColor}; } 0% { text-shadow: 0 0 2px #fff, 0 0 4px #fff, 0 0 6px #fff, 0 0 10px ${textColor}, 0 0 45px ${textColor}, 0 0 55px ${textColor}, 0 0 70px ${textColor}, 0 0 80px ${textColor}; } }
    @keyframes shine { to { background-position: 200% center; } }
    @keyframes bounceIn { 0% { opacity: 0; transform: scale3d(.3, .3, .3); } 20% { transform: scale3d(1.1, 1.1, 1.1); } 40% { transform: scale3d(.9, .9, .9); } 60% { opacity: 1; transform: scale3d(1.03, 1.03, 1.03); } 80% { transform: scale3d(.97, .97, .97); } 100% { opacity: 1; transform: scale3d(1, 1, 1); } }
    @keyframes slideIn { from { transform: translateX(-100px); opacity: 0; } to { transform: translateX(0); opacity: 1; } }
    @keyframes zoomIn { from { opacity: 0; transform: scale(0.5); } to { opacity: 1; transform: scale(1); } }
    @keyframes blurIn { from { opacity: 0; filter: blur(20px); } to { opacity: 1; filter: blur(0); } }
    @keyframes spinIn { from { opacity: 0; transform: rotate3d(0, 1, 0, 90deg); } to { opacity: 1; transform: rotate3d(0, 1, 0, 0deg); } }
  `;

  // --- HTML GENERATOR ---
  const generateCode = () => {
    const isCountdown = animations.includes('countdown');
    const isTypewriter = animations.includes('typewriter');
    
    let css = '';
    let htmlContent = '';
    let script = '';
    
    const finalBgColor = isTransparent ? 'transparent' : bgColor;
    const safeUrl = getSafeUrl(linkUrl);
    const tag = linkUrl ? 'a' : 'h1';
    const tagJs = linkUrl ? 'a' : 'div';
    const hrefAttr = linkUrl ? ` href="${safeUrl}" target="_blank" rel="noopener noreferrer"` : '';
    const cursorStyle = linkUrl ? 'cursor: pointer;' : '';
    
    // --- Compose CSS for Export ---
    const activeCSSAnimations: string[] = [];
    let specificCssProps = '';

    // Add font weights to CSS
    specificCssProps += `font-weight: ${isBold ? 'bold' : 'normal'}; `;
    specificCssProps += `font-style: ${isItalic ? 'italic' : 'normal'}; `;

    if (animations.includes('neon')) {
        specificCssProps += `text-shadow: 0 0 5px #fff, 0 0 10px #fff, 0 0 20px ${textColor}, 0 0 30px ${textColor}, 0 0 40px ${textColor};`;
        activeCSSAnimations.push(`pulsate ${duration}s infinite alternate`);
    }
    if (animations.includes('gradient')) {
        specificCssProps += `
            background: linear-gradient(to right, ${textColor}, #ff00cc, #3333ff, ${textColor});
            background-size: 200% auto;
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
        `;
        activeCSSAnimations.push(`shine ${duration}s linear infinite`);
    }
    
    if (animations.includes('fadeup')) activeCSSAnimations.push(`fadeInUp ${duration}s ease-out forwards`);
    if (animations.includes('bounce')) activeCSSAnimations.push(`bounceIn ${duration}s cubic-bezier(0.215, 0.610, 0.355, 1.000) both`);
    if (animations.includes('slide')) activeCSSAnimations.push(`slideIn ${duration}s ease-out forwards`);
    if (animations.includes('zoom')) activeCSSAnimations.push(`zoomIn ${duration}s ease-out forwards`);
    if (animations.includes('blur')) activeCSSAnimations.push(`blurIn ${duration}s ease-out forwards`);
    if (animations.includes('spin')) {
        activeCSSAnimations.push(`spinIn ${duration}s ease-out forwards`);
        specificCssProps += `transform-style: preserve-3d;`;
    }

    const commonCss = `
      body { margin: 0; padding: 20px; display: flex; flex-direction: column; justify-content: ${alignV}; align-items: stretch; min-height: 100vh; background-color: ${finalBgColor}; font-family: '${fontFamily}', sans-serif; overflow: hidden; box-sizing: border-box; }
      .container { width: 100%; text-align: ${alignH}; }
      .text { font-size: ${fontSize}px; color: ${textColor}; margin: 0; line-height: 1.2; white-space: ${allowWrap ? 'pre-wrap' : 'nowrap'}; word-wrap: ${allowWrap ? 'break-word' : 'normal'}; text-decoration: none; ${cursorStyle} ${specificCssProps} }
    `;

    // Observer for Scroll
    const observerScript = `
    <script>
      document.addEventListener("DOMContentLoaded", function() {
        const target = document.querySelector('.container');
        const text = document.querySelector('.text');
        
        function resetAnimation() {
            if (text) {
                text.style.animation = 'none';
                text.offsetHeight; 
                text.style.animation = null; 
            }
        }

        const observer = new IntersectionObserver((entries) => {
          entries.forEach(entry => {
            if (entry.isIntersecting) {
              ${allowWrap && isTypewriter 
                ? 'startTypewriter();' 
                : (isCountdown ? 'startCountdown();' : `if(text) text.style.animationPlayState = 'running';`)
              }
            } else {
              ${allowWrap && isTypewriter 
                ? 'resetTypewriter();' 
                : (isCountdown ? 'resetCountdown();' : `resetAnimation();`)
              }
            }
          });
        }, { threshold: 0.1 });
        
        if(target) observer.observe(target);
        
        ${!startOnView && allowWrap && isTypewriter ? 'setTimeout(startTypewriter, 500);' : ''}
        ${!startOnView && isCountdown ? 'startCountdown();' : ''}
      });
    </script>`;

    // --- Generate HTML based on Mode ---

    if (isCountdown) {
         htmlContent = `<div class="container"><${tagJs} class="text" id="countdown"${hrefAttr}>00d 00h 00m 00s</${tagJs}></div>`;
         
         const animString = activeCSSAnimations.length > 0 ? `animation: ${activeCSSAnimations.join(', ')}; ${startOnView ? 'animation-play-state: paused;' : ''}` : '';
         
         css = `
            ${commonCss}
            .text { font-variant-numeric: tabular-nums; ${animString} }
         `;
         script = `
         <script>
            let countdownInterval;

            function startCountdown() {
                if(countdownInterval) clearInterval(countdownInterval);
                const countDownDate = new Date("${targetDate}").getTime();
                const finishedText = "${text.replace(/"/g, '\\"')}";
                const el = document.getElementById("countdown");
                
                if(el) el.style.animationPlayState = 'running';

                countdownInterval = setInterval(function() {
                    const now = new Date().getTime();
                    const distance = countDownDate - now;

                    if (distance < 0) {
                        clearInterval(countdownInterval);
                        el.innerHTML = finishedText;
                        return;
                    }

                    const days = Math.floor(distance / (1000 * 60 * 60 * 24));
                    const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
                    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
                    const seconds = Math.floor((distance % (1000 * 60)) / 1000);

                    el.innerHTML = days + "d " + hours + "h " + minutes + "m " + seconds + "s ";
                }, 1000);
            }
            function resetCountdown() {
                if(countdownInterval) clearInterval(countdownInterval);
                const el = document.getElementById("countdown");
                if(el) {
                    el.style.animation = 'none';
                    el.offsetHeight; 
                    el.style.animation = null;
                }
            }
         </script>
         ${startOnView ? observerScript : '<script>startCountdown();</script>'}
         `;
    } else if (isTypewriter) {
        if (allowWrap) {
            // Multiline JS Typewriter
            const charDelay = (duration * 1000) / Math.max(1, text.length);
            const safeText = text.replace(/\\/g, '\\\\').replace(/"/g, '\\"').replace(/\n/g, '\\n');
            
            const animString = activeCSSAnimations.length > 0 ? `animation: ${activeCSSAnimations.join(', ')}; ${startOnView ? 'animation-play-state: paused;' : ''}` : '';

            htmlContent = `
            <div class="container">
                <${tagJs} class="text" id="typewriter-text"${hrefAttr}><span id="cursor"></span></${tagJs}>
            </div>`;

            css = `
                ${commonCss}
                .text { display: inline-block; text-align: ${alignH}; ${animString} }
                #cursor {
                    display: inline-block;
                    width: 0.15em;
                    height: 1em;
                    background-color: ${textColor};
                    margin-left: 1px;
                    vertical-align: baseline;
                    animation: blink-caret 0.75s step-end infinite;
                }
                @keyframes blink-caret { from, to { opacity: 0 } 50% { opacity: 1 } }
            `;

            script = `
                <script>
                    const text = "${safeText}";
                    const container = document.getElementById('typewriter-text');
                    let cursor = document.getElementById('cursor');
                    let i = 0;
                    let typeTimer;
                    
                    function startTypewriter() {
                        if(container) container.style.animationPlayState = 'running';
                        if (i < text.length) {
                            const char = text.charAt(i);
                            const span = document.createElement('span');
                            span.textContent = char;
                            container.insertBefore(span, cursor);
                            i++;
                            typeTimer = setTimeout(startTypewriter, ${charDelay});
                        }
                    }
                    function resetTypewriter() {
                        clearTimeout(typeTimer);
                        i = 0;
                        container.innerHTML = '<span id="cursor"></span>';
                        cursor = document.getElementById('cursor');
                        container.style.animation = 'none';
                        container.offsetHeight; 
                        container.style.animation = null;
                    }
                </script>
                ${startOnView ? observerScript : `<script>setTimeout(startTypewriter, 500);</script>`}
            `;
        } else {
            // Single line CSS Typewriter
            activeCSSAnimations.push(`typing ${duration}s steps(${text.length}, end)`);
            activeCSSAnimations.push(`blink-caret .75s step-end infinite`);
            const animString = activeCSSAnimations.length > 0 ? `animation: ${activeCSSAnimations.join(', ')}; ${startOnView ? 'animation-play-state: paused;' : ''}` : '';
            
            htmlContent = `<div class="container"><${tag} class="text"${hrefAttr}>${text}</${tag}></div>`;
            const marginLogic = alignH === 'center' ? '0 auto' : (alignH === 'right' ? '0 0 0 auto' : '0');
            css = `
                ${commonCss}
                .text {
                display: inline-block;
                overflow: hidden;
                border-right: .15em solid ${textColor};
                margin: ${marginLogic};
                letter-spacing: 0.1em;
                ${animString}
                max-width: 100%;
                }
                @keyframes typing { from { width: 0 } to { width: 100% } }
                @keyframes blink-caret { from, to { border-color: transparent } 50% { border-color: ${textColor} } }
            `;
            script = startOnView ? observerScript : '';
        }
    } else {
      // Standard animations
      htmlContent = `<div class="container"><${tag} class="text"${hrefAttr}>${text}</${tag}></div>`;
      const animString = activeCSSAnimations.length > 0 ? `animation: ${activeCSSAnimations.join(', ')}; ${startOnView ? 'animation-play-state: paused;' : ''}` : '';
      
      css = `${commonCss} .text { ${animString} }`;
      script = startOnView ? observerScript : '';
    }

    const fontImport = `<link href="https://fonts.googleapis.com/css2?family=${fontFamily.replace(' ', '+')}:wght@400;700&display=swap" rel="stylesheet">`;

    return `<!DOCTYPE html>
<html>
<head>
${fontImport}
<style>
${css}
</style>
</head>
<body>
${htmlContent}
${script}
</body>
</html>`;
  };

  const handleCopy = () => {
    const code = generateCode();
    const textArea = document.createElement('textarea');
    textArea.value = code;
    textArea.style.position = 'fixed';
    textArea.style.left = '-9999px';
    textArea.style.top = '0';
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    try {
      document.execCommand('copy');
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
    document.body.removeChild(textArea);
  };

  const handleDownload = () => {
    const code = generateCode();
    const blob = new Blob([code], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'animation.html';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="flex flex-col lg:flex-row h-screen bg-slate-50 text-slate-800 font-sans overflow-hidden">
      <style>{keyframesStyle}</style>

      {/* Sidebar Controls */}
      <div className="w-full lg:w-96 bg-white border-r border-slate-200 flex flex-col h-full overflow-y-auto z-20 shadow-xl shrink-0">
        <div className="p-6 border-b border-slate-100 flex justify-between items-center">
          <div>
            <h1 className="text-xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-indigo-600" />
                Text Animator
            </h1>
            <p className="text-xs text-slate-500 mt-1">Create embeddable animations for Google Sites</p>
          </div>
          <button 
            onClick={randomizeStyle}
            className="p-2 text-indigo-600 bg-indigo-50 hover:bg-indigo-100 rounded-full transition-colors"
            title="Randomize Style"
          >
            <Shuffle className="w-4 h-4" />
          </button>
        </div>

        <div className="p-6 space-y-6 flex-1">
          {/* Text Input */}
          <div className="space-y-2">
            <label className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                {animations.includes('countdown') ? 'Message when Finished' : 'Content'}
            </label>
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              className="w-full px-4 py-3 rounded-lg bg-slate-50 border border-slate-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition-all resize-y min-h-[80px]"
              placeholder={animations.includes('countdown') ? "e.g. We are Live!" : "Enter your text..."}
            />
          </div>

          {/* Countdown Date Picker */}
          {animations.includes('countdown') && (
            <div className="space-y-2">
                <label className="text-xs font-semibold uppercase tracking-wider text-indigo-500 flex items-center gap-1">
                    <Clock className="w-3 h-3" /> Target Date & Time
                </label>
                <input 
                    type="datetime-local"
                    value={targetDate}
                    onChange={(e) => setTargetDate(e.target.value)}
                    className="w-full px-3 py-2 text-sm border border-indigo-200 rounded-lg bg-indigo-50 text-indigo-900 focus:ring-2 focus:ring-indigo-200 outline-none transition-all"
                />
            </div>
          )}
          
           {/* Hyperlink Input */}
           <div className="space-y-2">
            <label className="text-xs font-semibold uppercase tracking-wider text-slate-400">Hyperlink (Optional)</label>
            <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 focus-within:ring-2 focus-within:ring-indigo-200 focus-within:border-indigo-500 transition-all">
                <LinkIcon className="w-4 h-4 text-slate-400" />
                <input
                type="text"
                value={linkUrl}
                onChange={(e) => setLinkUrl(e.target.value)}
                className="bg-transparent w-full outline-none text-sm text-slate-600 placeholder-slate-400"
                placeholder="https://example.com"
                />
            </div>
            </div>

          {/* Animation Type */}
          <div className="space-y-2">
            <label className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                Animation Mix <span className="text-[10px] text-indigo-500 font-normal ml-1">(Click multiple!)</span>
            </label>
            <div className="grid grid-cols-2 gap-2">
              {[
                { id: 'typewriter', name: 'Typewriter', icon: Type },
                { id: 'fadeup', name: 'Fade Up', icon: ArrowUp },
                { id: 'neon', name: 'Neon Glow', icon: Activity },
                { id: 'gradient', name: 'Flow', icon: RefreshCw },
                { id: 'bounce', name: 'Bounce In', icon: ArrowUpCircle },
                { id: 'slide', name: 'Slide In', icon: MoveHorizontal },
                { id: 'zoom', name: 'Zoom In', icon: ZoomIn },
                { id: 'blur', name: 'Focus', icon: Aperture },
                { id: 'spin', name: '3D Spin', icon: RotateCcw },
                { id: 'countdown', name: 'Countdown', icon: Timer },
              ].map((anim) => {
                const isActive = animations.includes(anim.id);
                return (
                    <button
                    key={anim.id}
                    onClick={() => toggleAnimation(anim.id)}
                    className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm transition-all border ${
                        isActive
                        ? 'bg-indigo-600 text-white border-indigo-600 shadow-md shadow-indigo-200'
                        : 'bg-white border-slate-200 hover:bg-slate-50 text-slate-600'
                    }`}
                    >
                    <anim.icon className="w-4 h-4" />
                    {anim.name}
                    </button>
                )
              })}
            </div>
          </div>

          {/* Appearance Controls */}
          <div className="space-y-4">
            <label className="text-xs font-semibold uppercase tracking-wider text-slate-400">Appearance</label>
            
            <div className="space-y-2">
              <div className="flex justify-between text-xs text-slate-500">
                <span>Size</span>
                <span>{fontSize}px</span>
              </div>
              <input
                type="range"
                min="12"
                max="120"
                value={fontSize}
                onChange={(e) => setFontSize(Number(e.target.value))}
                className="w-full accent-indigo-600 h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer"
              />
            </div>

            <div className="space-y-2">
               <label className="text-xs text-slate-500 flex items-center gap-1">
                  <Clock className="w-3 h-3" /> Animation Duration (Seconds)
               </label>
              <input
                type="number"
                min="0.1"
                step="0.1"
                value={duration}
                onChange={(e) => setDuration(Math.max(0.1, Number(e.target.value)))}
                className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg bg-slate-50 focus:bg-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition-all"
              />
            </div>

            {/* Font Family Controls (Updated with Bold/Italic) */}
             <div className="space-y-2 pt-2">
                <label className="text-xs text-slate-500 mb-1 block">Font Family</label>
                <div className="flex gap-2">
                    <select 
                        value={fontFamily}
                        onChange={(e) => setFontFamily(e.target.value)}
                        className="w-full p-2 text-sm border border-slate-200 rounded bg-white"
                    >
                        <option value="Inter">Inter (Modern)</option>
                        <option value="Roboto">Roboto (Clean)</option>
                        <option value="Open Sans">Open Sans (Neutral)</option>
                        <option value="Montserrat">Montserrat (Geometric)</option>
                        <option value="Oswald">Oswald (Bold/Condensed)</option>
                        <option value="Playfair Display">Playfair Display (Serif)</option>
                        <option value="Merriweather">Merriweather (Classic Serif)</option>
                        <option value="Courier Prime">Courier Prime (Mono)</option>
                        <option value="Pacifico">Pacifico (Handwriting)</option>
                        <option value="Dancing Script">Dancing Script (Cursive)</option>
                        <option value="Press Start 2P">Press Start 2P (Retro/Pixel)</option>
                    </select>
                    
                    <button 
                        onClick={() => setIsBold(!isBold)}
                        className={`p-2 rounded border transition-all ${isBold ? 'bg-indigo-600 text-white border-indigo-600' : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'}`}
                        title="Toggle Bold"
                    >
                        <Bold className="w-4 h-4" />
                    </button>
                    
                    <button 
                        onClick={() => setIsItalic(!isItalic)}
                        className={`p-2 rounded border transition-all ${isItalic ? 'bg-indigo-600 text-white border-indigo-600' : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'}`}
                        title="Toggle Italic"
                    >
                        <Italic className="w-4 h-4" />
                    </button>
                </div>
            </div>

            {/* Alignment Controls */}
            <div className="space-y-2">
                <label className="text-xs font-semibold uppercase tracking-wider text-slate-400">Embed Alignment</label>
                <div className="flex gap-2">
                    {/* Horizontal */}
                    <div className="flex bg-slate-100 p-1 rounded-md border border-slate-200">
                        <button onClick={() => setAlignH('left')} className={`p-1.5 rounded ${alignH === 'left' ? 'bg-white shadow text-indigo-600' : 'text-slate-500 hover:text-slate-700'}`} title="Align Left"><AlignLeft className="w-4 h-4"/></button>
                        <button onClick={() => setAlignH('center')} className={`p-1.5 rounded ${alignH === 'center' ? 'bg-white shadow text-indigo-600' : 'text-slate-500 hover:text-slate-700'}`} title="Align Center"><AlignCenter className="w-4 h-4"/></button>
                        <button onClick={() => setAlignH('right')} className={`p-1.5 rounded ${alignH === 'right' ? 'bg-white shadow text-indigo-600' : 'text-slate-500 hover:text-slate-700'}`} title="Align Right"><AlignRight className="w-4 h-4"/></button>
                    </div>
                    {/* Vertical */}
                    <div className="flex bg-slate-100 p-1 rounded-md border border-slate-200">
                        <button onClick={() => setAlignV('flex-start')} className={`p-1.5 rounded ${alignV === 'flex-start' ? 'bg-white shadow text-indigo-600' : 'text-slate-500 hover:text-slate-700'}`} title="Align Top"><ArrowUpCircle className="w-4 h-4"/></button>
                        <button onClick={() => setAlignV('center')} className={`p-1.5 rounded ${alignV === 'center' ? 'bg-white shadow text-indigo-600' : 'text-slate-500 hover:text-slate-700'}`} title="Align Middle"><MinusCircle className="w-4 h-4"/></button>
                        <button onClick={() => setAlignV('flex-end')} className={`p-1.5 rounded ${alignV === 'flex-end' ? 'bg-white shadow text-indigo-600' : 'text-slate-500 hover:text-slate-700'}`} title="Align Bottom"><ArrowDownCircle className="w-4 h-4"/></button>
                    </div>
                </div>
                <p className="text-[10px] text-slate-400">Adjust text position within the embed box.</p>
            </div>
            
            {/* View Trigger Toggle */}
             <div className="flex items-center justify-between">
                <label className="text-xs font-semibold uppercase tracking-wider text-slate-400">Start on View</label>
                <label className="flex items-center gap-1 cursor-pointer select-none">
                    <input 
                        type="checkbox" 
                        checked={startOnView} 
                        onChange={(e) => setStartOnView(e.target.checked)}
                        className="w-3 h-3 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                    />
                    <span className="text-[10px] text-slate-400 uppercase font-bold flex items-center gap-1">
                       Wait for Scroll <Eye className="w-3 h-3"/>
                    </span>
                </label>
            </div>

            <div className="grid grid-cols-2 gap-4 pt-2">
              <div>
                <label className="text-xs text-slate-500 mb-1 block">Text Color</label>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={textColor}
                    onChange={(e) => setTextColor(e.target.value)}
                    className="w-8 h-8 rounded cursor-pointer border-0 p-0"
                  />
                  <span className="text-xs font-mono">{textColor}</span>
                </div>
              </div>
              <div className="space-y-3">
                {/* Background Color & Transparent Checkbox */}
                <div>
                    <div className="flex justify-between items-center mb-1">
                        <label className="text-xs text-slate-500 block">Background</label>
                        <label className="flex items-center gap-1 cursor-pointer select-none">
                            <input 
                                type="checkbox" 
                                checked={isTransparent} 
                                onChange={(e) => setIsTransparent(e.target.checked)}
                                className="w-3 h-3 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                            />
                            <span className="text-[10px] text-slate-400 uppercase font-bold">Transparent</span>
                        </label>
                    </div>
                    <div className={`flex items-center gap-2 ${isTransparent ? 'opacity-50 pointer-events-none grayscale' : ''}`}>
                    <input
                        type="color"
                        value={bgColor}
                        onChange={(e) => setBgColor(e.target.value)}
                        className="w-8 h-8 rounded cursor-pointer border-0 p-0"
                        disabled={isTransparent}
                    />
                    <span className="text-xs font-mono">{isTransparent ? 'None' : bgColor}</span>
                    </div>
                </div>

                {/* Wrap Text Checkbox */}
                <div>
                     <div className="flex justify-between items-center">
                        <label className="text-xs text-slate-500 block">Layout</label>
                        <label className="flex items-center gap-1 cursor-pointer select-none">
                            <input 
                                type="checkbox" 
                                checked={allowWrap} 
                                onChange={(e) => setAllowWrap(e.target.checked)}
                                className="w-3 h-3 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                            />
                            <span className="text-[10px] text-slate-400 uppercase font-bold flex items-center gap-1">
                                Wrap Text <AlignLeft className="w-3 h-3"/>
                            </span>
                        </label>
                    </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Generate Button Section */}
        <div className="p-6 bg-slate-50 border-t border-slate-200 space-y-3">
          <button
            onClick={handleCopy}
            className="w-full flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white py-3 rounded-lg font-medium transition-all shadow-lg shadow-indigo-200"
          >
            {copied ? (
                <>Copied to Clipboard!</>
            ) : (
                <><Code className="w-4 h-4" /> Get Embed Code</>
            )}
          </button>
          
           <button
            onClick={handleDownload}
            className="w-full flex items-center justify-center gap-2 bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 py-2 rounded-lg font-medium transition-all"
          >
            <Download className="w-4 h-4" /> Download HTML
          </button>

          <p className="text-xs text-center text-slate-400">Paste code (or upload file) into Google Sites &gt; Embed</p>
        </div>
      </div>

      {/* Preview Area */}
      <div className="flex-1 relative overflow-hidden flex flex-col bg-slate-100">
        
        {/* Header/Toolbar for Preview */}
        <div className="bg-white border-b border-slate-200 p-4 flex justify-between items-center shadow-sm z-10">
            <div className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                <Maximize className="w-4 h-4 text-indigo-500"/> Preview Canvas
            </div>
            <div className="flex items-center gap-2">
                <button 
                  onClick={() => setStageMode(stageMode === 'dark' ? 'light' : 'dark')}
                  className="text-xs flex items-center gap-1 px-2 py-1 bg-slate-100 border border-slate-300 rounded hover:bg-slate-200 transition-colors text-slate-600"
                  title="Toggle Stage Background"
                >
                   {stageMode === 'dark' ? <Sun className="w-3 h-3"/> : <Moon className="w-3 h-3"/>}
                   {stageMode === 'dark' ? 'Light Mode' : 'Dark Mode'}
                </button>
            </div>
        </div>

        {/* Main Canvas Area */}
        <div 
            className={`flex-1 flex items-center justify-center p-8 transition-colors duration-500 ${
                stageMode === 'dark' 
                ? "bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] bg-slate-700" 
                : "bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] bg-slate-100"
            }`}
        >
            {/* The "Preview Box" - Simulating the embed container */}
            <div 
                className="shadow-2xl rounded-lg overflow-hidden flex relative transition-all duration-300 ring-1 ring-black/5"
                style={{ 
                    backgroundColor: isTransparent ? 'transparent' : bgColor,
                    width: '100%',
                    maxWidth: '800px',
                    height: '400px',
                    border: isTransparent ? '2px dashed rgba(128,128,128,0.3)' : 'none',
                    // Apply Flex alignment to the Preview Box as well
                    justifyContent: alignH === 'center' ? 'center' : (alignH === 'left' ? 'flex-start' : 'flex-end'),
                    alignItems: alignV,
                    padding: '20px'
                }}
            >
                 <div 
                    // Key prop forces a re-render when text/settings change, restarting the animation
                    key={`${animations.join('-')}-${text}-${duration}-${fontSize}-${fontFamily}-${allowWrap}-${linkUrl}-${isBold}-${isItalic}`}
                    style={{ width: '100%', textAlign: alignH }}
                 >
                    {getPreviewContent()}
                </div>
            </div>
        </div>

        {/* Code View (Visible on larger screens) */}
        <div className="bg-slate-900 text-slate-300 p-4 border-t border-slate-800 h-48 overflow-y-auto hidden lg:block font-mono text-xs z-20">
            <div className="flex justify-between items-center mb-2 sticky top-0 bg-slate-900 pb-2 border-b border-slate-800">
                <span className="text-indigo-400 font-bold">HTML Output</span>
                <button onClick={handleCopy} className="hover:text-white transition-colors">
                    {copied ? "Copied" : <Copy className="w-4 h-4" />}
                </button>
            </div>
            <pre className="whitespace-pre-wrap break-all opacity-70 selection:bg-indigo-500 selection:text-white">
                {generateCode()}
            </pre>
        </div>
      </div>
    </div>
  );
}
