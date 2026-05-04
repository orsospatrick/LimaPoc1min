/** Relative paths only — safe for GitHub Pages subpaths if needed. */

function navigate(href) {
  window.location.href = href;
}

function getQueryParam(name) {
  return new URLSearchParams(window.location.search).get(name);
}

window.LimaRouter = { navigate, getQueryParam };
