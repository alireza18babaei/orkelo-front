const RTL_CHARACTER_RANGES =
  "\u0591-\u07FF\uFB1D-\uFDFD\uFE70-\uFEFC";
const LTR_CHARACTER_RANGES = "A-Za-z";
const STRONG_CHARACTER_RE = new RegExp(
  `[${RTL_CHARACTER_RANGES}${LTR_CHARACTER_RANGES}]`,
);
const RTL_CHARACTER_RE = new RegExp(`[${RTL_CHARACTER_RANGES}]`);

const getTextAlignForDirection = (direction) => {
  if (direction === "rtl") return "right";
  if (direction === "ltr") return "left";
  return "start";
};

export const getTextDirection = (value, fallback = "auto") => {
  const text = String(value ?? "").trim();
  const strongCharacter = text.match(STRONG_CHARACTER_RE)?.[0];

  if (!strongCharacter) return fallback;

  return RTL_CHARACTER_RE.test(strongCharacter) ? "rtl" : "ltr";
};

export const getTextDirectionProps = (value, style = {}, fallback = "auto") => {
  const direction = getTextDirection(value, fallback);

  return {
    dir: direction,
    style: {
      textAlign: getTextAlignForDirection(direction),
      ...style,
    },
  };
};
