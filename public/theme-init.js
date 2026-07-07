// Anti-FOUC : applique le thème avant le premier rendu (préférence légère en localStorage, §12.1).
// Fichier externe pour rester compatible avec la CSP stricte (script-src 'self').
(function () {
  try {
    var t = localStorage.getItem('lunative:theme');
    var dark = t === 'dark' || ((!t || t === 'system') && matchMedia('(prefers-color-scheme: dark)').matches);
    if (dark) document.documentElement.classList.add('dark');
  } catch (e) {
    /* stockage indisponible : thème clair par défaut */
  }
})();
