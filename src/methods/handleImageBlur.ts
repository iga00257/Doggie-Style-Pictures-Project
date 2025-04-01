const handleImageBlur = () => {
  const shimmer = () => `
  <svg width="1920" height="1920" viewBox="0 0 1920 1920" xmlns="http://www.w3.org/2000/svg">
    <rect width="1920" height="1920" fill="#666666" />
  </svg>`;

  const toBase64 = (str: string) =>
    typeof window === "undefined"
      ? Buffer.from(str).toString("base64")
      : window.btoa(str);

  return `data:image/svg+xml;base64,${toBase64(shimmer())}`;
};

export default handleImageBlur;
