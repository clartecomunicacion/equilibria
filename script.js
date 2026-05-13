/* Interacciones livianas para una presentación exportable: imprimir, revelar contenido y marcar navegación. */
const printButton = document.querySelector('[data-print]');
if (printButton) {
  printButton.addEventListener('click', () => window.print());
}

const revealItems = document.querySelectorAll('.reveal');
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add('is-visible');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });

revealItems.forEach((item) => revealObserver.observe(item));

const navLinks = [...document.querySelectorAll('.nav-pills a')];
const sections = navLinks
  .map((link) => document.querySelector(link.getAttribute('href')))
  .filter(Boolean);

const navObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (!entry.isIntersecting) return;
    navLinks.forEach((link) => {
      link.classList.toggle('is-active', link.getAttribute('href') === `#${entry.target.id}`);
    });
  });
}, { rootMargin: '-45% 0px -45% 0px' });

sections.forEach((section) => navObserver.observe(section));

// Si las imágenes todavía no fueron cargadas en /assets, se muestra una placa elegante en lugar de un ícono roto.
document.querySelectorAll('.asset-frame img').forEach((image) => {
  image.addEventListener('error', () => {
    const label = image.alt || 'Imagen pendiente';
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="1400" height="820" viewBox="0 0 1400 820"><rect width="1400" height="820" fill="#232323"/><circle cx="1180" cy="140" r="220" fill="#6D47E8" opacity=".22"/><circle cx="180" cy="690" r="240" fill="#159B95" opacity=".2"/><rect x="92" y="96" width="1216" height="628" rx="44" fill="#2B2B2B" stroke="#444444" stroke-width="2"/><text x="700" y="378" text-anchor="middle" fill="#F8F8F8" font-family="Inter, Arial, sans-serif" font-size="54" font-weight="800">${label}</text><text x="700" y="448" text-anchor="middle" fill="#CFCFCF" font-family="Inter, Arial, sans-serif" font-size="28">Cargar imagen en la carpeta /assets</text></svg>`;
    image.src = `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`;
  }, { once: true });
});
