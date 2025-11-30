// scripts/htmlInclude.js
document.addEventListener("DOMContentLoaded", () => {
  // Find all elements with data-include attribute
  const includeEls = document.querySelectorAll("[data-include]");
  const includePromises = [];

  includeEls.forEach(el => {
    const file = el.getAttribute("data-include");
    if (file) {
      // Fetch the external HTML file
      const fetchPromise = fetch(file)
        .then(response => response.ok ? response.text() : "<!-- Include not found -->")
        .then(content => {
          el.outerHTML = content;  // Replace the placeholder element with the fetched content
        });
      includePromises.push(fetchPromise);
    }
  });

  // After all includes are loaded, update validation link URLs
  Promise.all(includePromises).then(() => {
    const currentURL = encodeURIComponent(window.location.href);
    const htmlValLink = document.getElementById("validation_link_html");
    const cssValLink = document.getElementById("validation_link_css");
    if (htmlValLink) {
      htmlValLink.href = `https://validator.w3.org/nu/?doc=${currentURL}`;
    }
    if (cssValLink) {
      cssValLink.href = `https://jigsaw.w3.org/css-validator/validator?uri=${currentURL}`;
    }
  });
});
