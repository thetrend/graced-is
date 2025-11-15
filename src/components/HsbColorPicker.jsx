import { useState, useEffect, useRef } from 'react';

// Utilities
function hsbToRgb(h, s, b) {
  h = h % 360;
  const c = b * s,
    x = c * (1 - Math.abs((h / 60) % 2 - 1)),
    m = b - c;
  let r = 0, g = 0, bl = 0;
  if (h < 60) { r = c; g = x; }
  else if (h < 120) { r = x; g = c; }
  else if (h < 180) { g = c; bl = x; }
  else if (h < 240) { g = x; bl = c; }
  else if (h < 300) { r = x; bl = c; }
  else { r = c; bl = x; }
  return [(r + m) * 255, (g + m) * 255, (bl + m) * 255];
}

function rgbToHsb(r, g, b) {
  r /= 255; g /= 255; b /= 255;
  const max = Math.max(r, g, b),
    min = Math.min(r, g, b),
    d = max - min;
  let h = 0,
    s = max === 0 ? 0 : d / max,
    v = max;
  if (d !== 0) {
    if (max === r) h = 60 * ((g - b) / d) % 360;
    else if (max === g) h = 60 * ((b - r) / d + 2);
    else h = 60 * ((r - g) / d + 4);
  }
  if (h < 0) h += 360;
  s = Math.max(0, Math.min(1, s));
  return [h, s, v];
}

function rgbToHex(r, g, b) {
  return "#" + [r, g, b].map(x => Math.round(x).toString(16).padStart(2, "0")).join("").toUpperCase();
}

function hexToRgb(hex) {
  hex = hex.replace("#", "");
  if (hex.length === 3) hex = hex.split("").map(c => c + c).join("");
  return [
    parseInt(hex.substr(0, 2), 16),
    parseInt(hex.substr(2, 2), 16),
    parseInt(hex.substr(4, 2), 16)
  ];
}

function randomHSB() {
  const h = Math.floor(Math.random() * 360);
  const s = Math.random();
  const b = Math.random();
  return { h, s, b, hex: rgbToHex(...hsbToRgb(h, s, b)) };
}

function ColorRow({ label, color, setColor, updateGradient, saturationRef }) {
  const [hexInput, setHexInput] = useState(color.hex);

  useEffect(() => {
    setHexInput(color.hex); // Sync if color changes externally
  }, [color.hex]);

  const update = (comp, value) => {
    const newC = { ...color };
    if (comp === "h") newC.h = value;
    if (comp === "s") newC.s = value;
    if (comp === "b") newC.b = value;
    newC.hex = rgbToHex(...hsbToRgb(newC.h, newC.s, newC.b));
    setColor(newC);
    setHexInput(newC.hex);
    updateGradient?.();
  };

  const handleHexChange = (e) => {
    const val = e.target.value;
    setHexInput(val); // always allow typing
    if (/^#?[0-9A-Fa-f]{6}$/.test(val)) {
      const rgb = hexToRgb(val);
      const hsb = rgbToHsb(...rgb);
      const newC = {
        h: Math.round(hsb[0]),
        s: hsb[1],
        b: hsb[2],
        hex: rgbToHex(...rgb),
      };
      setColor(newC);
      updateGradient?.();
    }
  };

  return (
    <div className="color-row">
      <div className="color-box" style={{ background: color.hex }}>{label}</div>
      <div className="sliders">
        <div className="input-group">
          <label>HEX</label>
          <input value={hexInput} onChange={handleHexChange} placeholder="#FFFFFF" />
          <label>HSB</label>
          <input value={`${Math.round(color.h)},${Math.round(color.s * 100)},${Math.round(color.b * 100)}`} readOnly />
        </div>

        <label>Hue <span>{Math.round(color.h)}</span>°</label>
        <input type="range" min="0" max="360" value={color.h} onChange={e => update("h", +e.target.value)}
          style={{ background: "linear-gradient(to right, red, yellow, lime, cyan, blue, magenta, red)" }}
        />

        <label>Saturation <span>{Math.round(color.s * 100)}</span>%</label>
        <input type="range" min="0" max="100" value={color.s * 100} onChange={e => update("s", +e.target.value / 100)}
          ref={saturationRef}
        />

        <label>Brightness <span>{Math.round(color.b * 100)}</span>%</label>
        <input type="range" min="0" max="100" value={color.b * 100} onChange={e => update("b", +e.target.value / 100)}
          style={{ background: `linear-gradient(to right, hsl(${color.h},${color.s * 100}%,0%), hsl(${color.h},${color.s * 100}%,100%))` }}
        />
      </div>
    </div>
  );
}

function App() {
  const [color1, setColor1] = useState(randomHSB());
  const [color2, setColor2] = useState(randomHSB());
  const [mid, setMid] = useState({ h: 0, s: 1, b: 0.5, hex: "#00FF00" });

  const gradientBarRef = useRef();
  const midIndicatorRef = useRef();
  const midSaturationRef = useRef();
  const draggingRef = useRef(false);

  const updateMidpoint = () => {
    const hsb1 = [color1.h, color1.s, color1.b];
    const hsb2 = [color2.h, color2.s, color2.b];
    const dh = ((hsb2[0] - hsb1[0] + 360 + 180) % 360) - 180;
    const midHue = (hsb1[0] + dh / 2 + 360) % 360;
    const midS = (hsb1[1] + hsb2[1]) / 2;
    const midB = (hsb1[2] + hsb2[2]) / 2;
    setMid({ h: midHue, s: midS, b: midB, hex: rgbToHex(...hsbToRgb(midHue, midS, midB)) });
  };

  const updateGradient = () => {
    if (!gradientBarRef.current || !midIndicatorRef.current || !midSaturationRef.current) return;

    gradientBarRef.current.style.background = `linear-gradient(to right, ${color1.hex}, ${mid.hex}, ${color2.hex})`;
    midIndicatorRef.current.style.left = `50%`;
    midSaturationRef.current.style.background = `linear-gradient(to right,
      hsl(${mid.h},0%,${mid.b * 100}%),
      hsl(${mid.h},100%,${mid.b * 100}%)
    )`;
  };

  useEffect(() => { updateMidpoint(); updateGradient(); }, [color1, color2]);
  useEffect(() => { updateGradient(); }, [mid]);

  const startDrag = () => { draggingRef.current = true; };
  const stopDrag = () => { draggingRef.current = false; };
  const drag = (e) => {
    if (!draggingRef.current) return;
    const rect = gradientBarRef.current.getBoundingClientRect();
    let t = (e.clientX - rect.left) / rect.width;
    t = Math.max(0, Math.min(1, t));
    const dh = ((color2.h - color1.h + 360 + 180) % 360) - 180;
    const h = (color1.h + dh * t + 360) % 360;
    const s = color1.s + (color2.s - color1.s) * t;
    const b = color1.b + (color2.b - color1.b) * t;
    setMid({ h, s, b, hex: rgbToHex(...hsbToRgb(h, s, b)) });
    midIndicatorRef.current.style.left = `${t * 100}%`;
  };

  useEffect(() => {
    document.addEventListener("mouseup", stopDrag);
    document.addEventListener("mousemove", drag);
    return () => {
      document.removeEventListener("mouseup", stopDrag);
      document.removeEventListener("mousemove", drag);
    };
  }, [color1, color2]);

  return (
    <div className="container">
      <div className="gradient-container">
        <div className="gradient-bar" ref={gradientBarRef}></div>
        <div className="mid-indicator" ref={midIndicatorRef} onMouseDown={startDrag}></div>
      </div>
      <div className="colors">
        <ColorRow label="C1" color={color1} setColor={(c) => { setColor1(c); updateMidpoint(); updateGradient(); }} updateGradient={updateGradient} />
        <ColorRow label="MID" color={mid} setColor={(c) => { setMid(c); updateGradient(); }} saturationRef={midSaturationRef} updateGradient={updateGradient} />
        <ColorRow label="C2" color={color2} setColor={(c) => { setColor2(c); updateMidpoint(); updateGradient(); }} updateGradient={updateGradient} />
      </div>
    </div>
  );
}

export default App;
