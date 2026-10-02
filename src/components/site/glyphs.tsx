// Line drawings shown inside each round "display" (screens and games).
const N = "#7cf7e4";
const P = "#f7b8c8";

// Tiny line drawings shown inside each round "display".
export const GLYPH: Record<string, React.ReactNode> = {
  clock: (
    <>
      <circle cx="50" cy="50" r="30" stroke={N} fill="none" strokeWidth="3" />
      <path d="M50 50 L50 30 M50 50 L64 58" stroke={P} strokeWidth="4" strokeLinecap="round" />
    </>
  ),
  weather: (
    <>
      <circle cx="42" cy="44" r="12" fill="#ffd166" />
      <path d="M36 66 h32 a10 10 0 0 0 -4 -19 a14 14 0 0 0 -26 4 a8 8 0 0 0 -2 15z" fill="#fff" />
    </>
  ),
  pomodoro: (
    <>
      <circle cx="50" cy="50" r="30" stroke="#333" fill="none" strokeWidth="6" />
      <path d="M50 20 A30 30 0 1 1 22 60" stroke={P} fill="none" strokeWidth="6" strokeLinecap="round" />
      <text x="50" y="56" fill="#fff" fontSize="16" textAnchor="middle" fontWeight="700">25</text>
    </>
  ),
  stopwatch: (
    <>
      <circle cx="50" cy="54" r="26" stroke={N} fill="none" strokeWidth="3" />
      <path d="M44 22 h12 M50 54 L60 42" stroke={N} strokeWidth="4" strokeLinecap="round" />
    </>
  ),
  stats: <path d="M26 68 V52 M40 68 V38 M54 68 V46 M68 68 V30" stroke={N} strokeWidth="7" strokeLinecap="round" />,
  sysinfo: (
    <>
      <rect x="30" y="30" width="40" height="40" rx="6" stroke={N} fill="none" strokeWidth="3" />
      <path d="M38 22v8M50 22v8M62 22v8M38 70v8M50 70v8M62 70v8" stroke={N} strokeWidth="3" />
    </>
  ),
  claim: (
    <path
      d="M28 28h14v14H28zM58 28h14v14H58zM28 58h14v14H28zM58 58h6v6h-6zM66 66h6v6h-6zM50 50h4v4h-4z"
      fill="#fff"
    />
  ),
  wifi: <path d="M26 44 a34 34 0 0 1 48 0 M34 52 a22 22 0 0 1 32 0 M42 60 a10 10 0 0 1 16 0" stroke={N} fill="none" strokeWidth="5" strokeLinecap="round" />,
  notify: (
    <>
      <rect x="22" y="36" width="56" height="28" rx="8" fill="#ffffff22" stroke="#ffffff55" />
      <circle cx="33" cy="50" r="5" fill={P} />
      <path d="M43 46h26M43 54h16" stroke="#fff" strokeWidth="3" strokeLinecap="round" />
    </>
  ),
  games: <path d="M30 42h40a8 8 0 0 1 8 8v4a10 10 0 0 1-17 7l-3-3H42l-3 3a10 10 0 0 1-17-7v-4a8 8 0 0 1 8-8z M36 50v8M32 54h8" stroke={N} fill="none" strokeWidth="3" />,
  dialogue: (
    <>
      <rect x="22" y="30" width="56" height="34" rx="10" fill="#fff" />
      <path d="M36 64 l-4 10 l14 -10z" fill="#fff" />
      <text x="50" y="53" fill="#111" fontSize="15" textAnchor="middle" fontWeight="700">হাই!</text>
    </>
  ),
  dino: <path d="M20 68h60 M34 66v-14h6v-6h10v6h-6v14 M64 66v-12h4v12" stroke={N} fill="none" strokeWidth="3" />,
  flappy: (
    <>
      <path d="M64 20v24M64 58v24" stroke="#6ee06e" strokeWidth="10" />
      <circle cx="38" cy="50" r="8" fill="#ffd166" />
    </>
  ),
  shooter: <path d="M50 70l-8 8h16z M50 62V34 M30 28l6 6 6-6M58 28l6 6 6-6" stroke={N} fill={N} strokeWidth="3" />,
  stack: <path d="M34 70h32v-8H34zM36 60h28v-8H36zM40 50h24v-8H40z" fill={P} />,
  pong: (
    <>
      <circle cx="50" cy="50" r="30" stroke="#333" fill="none" strokeWidth="3" />
      <path d="M72 30 A30 30 0 0 1 80 50" stroke={N} fill="none" strokeWidth="6" strokeLinecap="round" />
      <circle cx="46" cy="54" r="4" fill="#fff" />
    </>
  ),
  reflex: <path d="M54 22L34 54h14l-4 24 22-34H52z" fill="#ffd166" />,
  brick: <path d="M24 28h16v8H24zM42 28h16v8H42zM60 28h16v8H60zM33 38h16v8H33zM51 38h16v8H51zM40 72h20 M54 60a3 3 0 1 0 0.1 0" stroke={P} fill={P} strokeWidth="2" />,
};

