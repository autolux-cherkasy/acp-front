function Loader({ size = 180, text = "Loading..." }) {
  return (
    <div
      style={{
        position: "relative",
        width: size,
        height: size,
        display: "grid",
        placeItems: "center",
      }}
    >
      <svg width={size} height={size} viewBox="0 0 38 38" fill="none">
        <defs>
          <linearGradient id="tealGrad" x1="8%" y1="0%" x2="65.7%" y2="23.9%">
            <stop offset="0%" stopColor="#C9E4E7" stopOpacity="0" />
            <stop offset="100%" stopColor="#226078" />
          </linearGradient>
        </defs>
        <path
          d="M36 19c0-9.4-7.6-17-17-17-4.7 0-8.9 1.9-12 5"
          stroke="url(#tealGrad)"
          strokeWidth="4"
          strokeLinecap="round"
        >
          <animateTransform
            attributeName="transform"
            type="rotate"
            from="0 19 19"
            to="360 19 19"
            dur="1s"
            repeatCount="indefinite"
          />
        </path>
      </svg>
      <span style={{ position: "absolute", fontWeight: 700, color: "#226078" }}>{text}</span>
    </div>
  );
}

export default Loader;
