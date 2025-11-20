
// Helper to safely read textarea / input value
function fieldValue(id) {
  const el = document.getElementById(id);
  return el ? el.value.trim() : "";
}

document.addEventListener("DOMContentLoaded", () => {
  const btn = document.getElementById("generateHtmlBtn");
  if (!btn) {
    return;
  }

  btn.addEventListener("click", () => {
    // 1. Collect the form data
    const first = fieldValue("firstName");
    const middle = fieldValue("middleName");
    const last = fieldValue("lastName");
    const nickname = fieldValue("nickname");

    const fullNameParts = [first, middle, last].filter(Boolean);
    const fullName = fullNameParts.join(" ");
    const displayName = nickname
      ? `${fullName} (${nickname})`
      : fullName;

    const mascotAdj = fieldValue("mascotAdj");
    const mascotAnimal = fieldValue("mascotAnimal");
    const divider = fieldValue("divider") || "★";

    const imageUrl = fieldValue("imageUrl");
    const imageCaption = fieldValue("imageCaption");

    const personalStatement = fieldValue("personalStatement");
    const personalBackground = fieldValue("personalBackground");
    const academicBackground = fieldValue("academicBackground");
    const professionalBackground = fieldValue("professionalBackground");
    const primaryPlatform = fieldValue("primaryComputerPlatform");
    const coursesOverview = fieldValue("coursesOverview");
    const funnyThing = fieldValue("funnyThing");
    const somethingToShare = fieldValue("somethingToShare");

    // Links
    const linkTextEls = document.querySelectorAll(".linkText");
    const linkUrlEls = document.querySelectorAll(".linkUrl");
    const links = [];
    linkTextEls.forEach((txtEl, index) => {
      const text = txtEl.value.trim();
      const url = (linkUrlEls[index] && linkUrlEls[index].value.trim()) || "";
      if (text && url) {
        links.push({ text, url });
      }
    });

    // Courses (if any rows exist)
    const courseRows = document.querySelectorAll("#courses .course-row");
    const courses = [];
    courseRows.forEach((row) => {
      const inputs = row.querySelectorAll("input");
      if (inputs.length >= 4) {
        const dept = inputs[0].value.trim();
        const num = inputs[1].value.trim();
        const name = inputs[2].value.trim();
        const reason = inputs[3].value.trim();
        if (dept || num || name || reason) {
          courses.push({ dept, num, name, reason });
        }
      }
    });

    // 2. Build the HTML snippet (this is what will be SHOWN as code)
    let htmlSnippet = "";
    htmlSnippet += `<h2>Introduction HTML</h2>\n`;
    htmlSnippet += `<h3>${displayName} ${divider} ${mascotAdj} ${mascotAnimal}</h3>\n`;
    htmlSnippet += `<figure>\n`;
    htmlSnippet += `  <img src="${imageUrl}" alt="${imageCaption}" />\n`;
    htmlSnippet += `  <figcaption>${imageCaption}</figcaption>\n`;
    htmlSnippet += `</figure>\n`;
    htmlSnippet += `<p>${personalStatement}</p>\n`;
    htmlSnippet += `<ul>\n`;
    htmlSnippet += `  <li><strong>Personal Background:</strong> ${personalBackground}</li>\n`;
    htmlSnippet += `  <li><strong>Academic Background:</strong> ${academicBackground}</li>\n`;
    htmlSnippet += `  <li><strong>Professional Background:</strong> ${professionalBackground}</li>\n`;
    htmlSnippet += `  <li><strong>Primary Computer Platform:</strong> ${primaryPlatform}</li>\n`;
    htmlSnippet += `  <li><strong>Courses:</strong> ${coursesOverview}</li>\n`;
    if (funnyThing) {
      htmlSnippet += `  <li><strong>Funny Thing:</strong> ${funnyThing}</li>\n`;
    }
    if (somethingToShare) {
      htmlSnippet += `  <li><strong>Something I'd Like to Share:</strong> ${somethingToShare}</li>\n`;
    }
    htmlSnippet += `</ul>\n`;

    if (courses.length > 0) {
      htmlSnippet += `<h3>Current Courses</h3>\n<ul>\n`;
      courses.forEach((c) => {
        htmlSnippet += `  <li>${c.dept} ${c.num} – ${c.name} (${c.reason})</li>\n`;
      });
      htmlSnippet += `</ul>\n`;
    }

    if (links.length > 0) {
      htmlSnippet += `<h3>Links</h3>\n<ul>\n`;
      links.forEach((link) => {
        htmlSnippet += `  <li><a href="${link.url}">${link.text}</a></li>\n`;
      });
      htmlSnippet += `</ul>\n`;
    }

    // 3. Change H2 text on the actual page
    const h2 = document.querySelector("main h2");
    if (h2) {
      h2.textContent = "Introduction HTML";
    }

    // 4. Remove the form and result/restart areas from view
    const form = document.getElementById("intro-form");
    if (form) {
      form.remove();
    }
    const result = document.getElementById("result");
    if (result) {
      result.classList.add("hidden");
    }
    const restart = document.getElementById("restart");
    if (restart) {
      restart.remove();
    }

    // 5. Create the <section><pre><code> block to display the HTML as code
    const main = document.querySelector("main.container") || document.querySelector("main");
    const section = document.createElement("section");
    section.id = "generated-html";
    section.setAttribute("aria-live", "polite");

    const pre = document.createElement("pre");
    const code = document.createElement("code");
    code.className = "language-html";

    // IMPORTANT: use textContent so the HTML is shown literally
    code.textContent = htmlSnippet;

    pre.appendChild(code);
    section.appendChild(pre);
    main.appendChild(section);

    // 6. Tell Highlight.js to style this block
    if (window.hljs) {
      window.hljs.highlightElement(code);
    }
  });
});
