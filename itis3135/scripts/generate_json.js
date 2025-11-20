function getFieldValue(id) {
  const el = document.getElementById(id);
  return el ? el.value.trim() : "";
}

document.addEventListener("DOMContentLoaded", () => {
  const btn = document.getElementById("generateJsonBtn");
  if (!btn) {
    return;
  }

  btn.addEventListener("click", () => {
    // ===== 1. Collect base fields (must match JSON keys exactly) =====
    const firstName = getFieldValue("firstName");
    const preferredName = getFieldValue("nickname");
    const middleName = getFieldValue("middleName");
    const lastName = getFieldValue("lastName");

    const divider = getFieldValue("divider") || "~";
    const mascotAdjective = getFieldValue("mascotAdj");
    const mascotAnimal = getFieldValue("mascotAnimal");

    const image = getFieldValue("imageUrl"); // use the URL field
    const imageCaption = getFieldValue("imageCaption");

    const personalStatement = getFieldValue("personalStatement");
    const personalBackground = getFieldValue("personalBackground");
    const professionalBackground = getFieldValue("professionalBackground");
    const academicBackground = getFieldValue("academicBackground");

    // There is no explicit "subject background" field in the form;
    // we'll map it to "Something I'd Like to Share" (optional).
    const subjectBackground = getFieldValue("somethingToShare");

    const primaryComputer = getFieldValue("primaryComputerPlatform");

    // ===== 2. Collect courses from the dynamic course rows =====
    const courseRows = document.querySelectorAll("#courses .course-row");
    const courses = [];

    courseRows.forEach((row) => {
      const inputs = row.querySelectorAll("input");
      if (inputs.length >= 4) {
        const department = inputs[0].value.trim();
        const number = inputs[1].value.trim();
        const name = inputs[2].value.trim();
        const reason = inputs[3].value.trim();

        if (department || number || name || reason) {
          courses.push({ department, number, name, reason });
        }
      }
    });

    // ===== 3. Collect links (5 required rows) =====
    const linkTextEls = document.querySelectorAll(".linkText");
    const linkUrlEls = document.querySelectorAll(".linkUrl");
    const links = [];

    linkTextEls.forEach((txtEl, index) => {
      const name = txtEl.value.trim();
      const href =
        (linkUrlEls[index] && linkUrlEls[index].value.trim()) || "";
      if (name && href) {
        links.push({ name, href });
      }
    });

    // ===== 4. Build JSON object with EXACT key names from assignment =====
    const jsonData = {
      firstName: firstName,
      preferredName: preferredName,
      middleInitial: middleName, // if you only want the initial, use middleName.charAt(0)
      lastName: lastName,
      divider: divider,
      mascotAdjective: mascotAdjective,
      mascotAnimal: mascotAnimal,
      image: image,
      imageCaption: imageCaption,
      personalStatement: personalStatement,
      personalBackground: personalBackground,
      professionalBackground: professionalBackground,
      academicBackground: academicBackground,
      subjectBackground: subjectBackground,
      primaryComputer: primaryComputer,
      courses: courses,
      links: links
    };

    // Pretty-print JSON with 2-space indent
    const jsonString = JSON.stringify(jsonData, null, 2);

    // ===== 5. Update the page heading and remove the form =====
    const h2 = document.querySelector("main h2");
    if (h2) {
      // If your rubric literally says "Introduction HTML", change this string to match.
      h2.textContent = "Introduction JSON";
    }

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

    // ===== 6. Create <section><pre><code> to display JSON as code =====
    const main = document.querySelector("main.container") || document.querySelector("main");
    const section = document.createElement("section");
    section.id = "generated-json";
    section.setAttribute("aria-live", "polite");

    const pre = document.createElement("pre");
    const code = document.createElement("code");
    code.className = "language-json";

    // IMPORTANT: use textContent so the JSON is shown literally, not executed
    code.textContent = jsonString;

    pre.appendChild(code);
    section.appendChild(pre);
    main.appendChild(section);

    // ===== 7. Ask Highlight.js to style this block =====
    if (window.hljs) {
      window.hljs.highlightElement(code);
    }
  });
});
