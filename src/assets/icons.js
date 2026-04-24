const svgToDataUri = (svg) => `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;

const lineIcon = (content, strokeWidth = 2) =>
  svgToDataUri(
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="#ffffff" stroke-width="${strokeWidth}" stroke-linecap="round" stroke-linejoin="round">${content}</svg>`
  );

const solidIcon = (content) =>
  svgToDataUri(
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#ffffff">${content}</svg>`
  );

export const home = solidIcon(
  '<path d="M12 3.4 4.7 9.6A2.2 2.2 0 0 0 4 11.3v7.4C4 20 5 21 6.3 21h3.2c.8 0 1.5-.7 1.5-1.5v-4.1c0-.3.2-.5.5-.5h1c.3 0 .5.2.5.5v4.1c0 .8.7 1.5 1.5 1.5h3.2c1.3 0 2.3-1 2.3-2.3v-7.4c0-.7-.3-1.3-.8-1.7L12 3.4Z"/>'
);

export const reels = lineIcon(
  '<rect x="4.5" y="4.5" width="15" height="15" rx="4"/><path d="M8 4.5 11 8"/><path d="M12.8 4.5 15.8 8"/><path d="M4.5 8h15"/><path d="m10.2 10.7 4.8 2.8-4.8 2.8Z"/>'
);

export const messages = lineIcon(
  '<path d="M20 6.7A2.7 2.7 0 0 0 17.3 4H6.7A2.7 2.7 0 0 0 4 6.7v7.1a2.7 2.7 0 0 0 2.7 2.7h1.2l-.8 3.5 4.1-3.5h6.1a2.7 2.7 0 0 0 2.7-2.7Z"/><path d="m8.4 9.7 2.9 2 4.6-4.1-3.2 5.1-2.7-1.8-2.6 1.4Z"/>'
);

export const search = lineIcon(
  '<circle cx="11" cy="11" r="6.5"/><path d="m16 16 4 4"/>'
);

export const explore = lineIcon(
  '<circle cx="12" cy="12" r="8"/><path d="m9.3 14.7 2.2-5.7 5.2-1.8-1.8 5.2-5.6 2.3Z"/><circle cx="12" cy="12" r="1.2"/>'
);

export const notifications = lineIcon(
  '<path d="m12 20.2-.7-.6C6.4 15.3 4 13.1 4 9.8A4.3 4.3 0 0 1 8.3 5.5c1.4 0 2.8.7 3.7 1.8.9-1.1 2.3-1.8 3.7-1.8A4.3 4.3 0 0 1 20 9.8c0 3.3-2.4 5.5-7.3 9.8Z"/>'
);

export const create = lineIcon(
  '<path d="M12 4.5v15"/><path d="M4.5 12h15"/>',
  2.2
);

export const profile = svgToDataUri(
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
    <defs>
      <linearGradient id="avatarBg" x1="12" y1="3" x2="12" y2="21" gradientUnits="userSpaceOnUse">
        <stop stop-color="#f8f9fb"/>
        <stop offset="1" stop-color="#c3c8d1"/>
      </linearGradient>
      <linearGradient id="avatarBody" x1="12" y1="11" x2="12" y2="21" gradientUnits="userSpaceOnUse">
        <stop stop-color="#9ba3ae"/>
        <stop offset="1" stop-color="#6e7682"/>
      </linearGradient>
    </defs>
    <circle cx="12" cy="12" r="10" fill="url(#avatarBg)"/>
    <circle cx="12" cy="9" r="4.1" fill="url(#avatarBody)"/>
    <path d="M5.2 19.4c1.7-3.1 4.1-4.8 6.8-4.8s5.1 1.7 6.8 4.8" fill="url(#avatarBody)"/>
  </svg>`
);

export const logout = lineIcon(
  '<path d="M9 20H6.5A2.5 2.5 0 0 1 4 17.5v-11A2.5 2.5 0 0 1 6.5 4H9"/><path d="M14 8l4 4-4 4"/><path d="M18 12H9"/>',
  2.1
);
