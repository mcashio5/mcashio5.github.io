(() => {
  // ---------- DEFAULTS (EDIT THESE TO MATCH YOUR INTRO PAGE) ----------
  const DEFAULTS = {
    firstName: "First",
    middleName: "",
    nickname: "",
    lastName: "Last",
    ackStatement: "I understand this introduction will be displayed as my course intro.",
    ackDate: new Date().toISOString().slice(0, 10),
    mascotAdj: "Majestic",
    mascotAnimal: "Phoenix",
    divider: " | ",
    imageUrl: "https://via.placeholder.com/300x200?text=Your+Photo",
    imageCaption: "My picture caption.",
    personalStatement:
      "I am a student who enjoys learning, building, and collaborating.",
    personalBackground: "I grew up in ... and enjoy ...",
    academicBackground: "I am studying ... and have completed ...",
    professionalBackground: "I have worked in ...",
    primaryComputerPlatform: "MacOS and Windows.",
    coursesOverview: "This term I expect to learn ...",
    funnyThing: "",
    somethingToShare: "",
    // At least one starter course
    courses: [
      { dept: "ITIS", number: "3135", name: "Web App Design & Dev", reason: "Core course" },
    ],
    links: [
      { text: "LinkedIn", url: "https://www.linkedin.com/" },
      { text: "GitHub", url: "https://github.com/" },
      { text: "Resume", url: "https://example.com/resume.pdf" },
      { text: "Portfolio", url: "https://example.com/" },
      { text: "Favorite Site", url: "https://news.ycombinator.com" },
    ],
  };

  // ---------- HELPERS ----------
  const $ = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));
  const form = $("#intro-form");
  const result = $("#result");
  const restart = $("#restart");
  const clearBtn = $("#clearBtn");
  const addCourseBtn = $("#addCourseBtn");
  const coursesWrap = $("#courses");

  function setValue(id, value) {
  const el = document.getElementById(id);
  if (el) {
    el.value = value ?? "";
  }
}


  function getValue(id) {
    const el = document.getElementById(id);
    return el ? el.value.trim() : "";
  }

  function createCourseRow(course = { dept: "", number: "", name: "", reason: "" }) {
    const row = document.createElement("div");
    row.className = "course-row grid four";
    row.innerHTML = `
      <label>Dept *
        <input type="text" class="c-dept" required placeholder="ITIS" value="${course.dept || ""}">
      </label>
      <label>No. *
        <input type="text" class="c-number" required placeholder="3135" value="${course.number || ""}">
      </label>
      <label>Name *
        <input type="text" class="c-name" required placeholder="Course name" value="${course.name || ""}">
      </label>
      <label>Reason *
        <input type="text" class="c-reason" required placeholder="Why taking?" value="${course.reason || ""}">
      </label>
      <div class="course-actions">
        <button type="button" class="danger remove-course">✕</button>
      </div>
    `;
    row.querySelector(".remove-course").addEventListener("click", () => {
      row.remove();
    });
    coursesWrap.appendChild(row);
  }

  function clearCourses() {
    coursesWrap.innerHTML = "";
  }

  function prefillDefaults() {
    setValue("firstName", DEFAULTS.firstName);
    setValue("middleName", DEFAULTS.middleName);
    setValue("nickname", DEFAULTS.nickname);
    setValue("lastName", DEFAULTS.lastName);

    setValue("ackStatement", DEFAULTS.ackStatement);
    setValue("ackDate", DEFAULTS.ackDate);

    setValue("mascotAdj", DEFAULTS.mascotAdj);
    setValue("mascotAnimal", DEFAULTS.mascotAnimal);
    setValue("divider", DEFAULTS.divider);

    setValue("imageUrl", DEFAULTS.imageUrl);
    setValue("imageCaption", DEFAULTS.imageCaption);

    setValue("personalStatement", DEFAULTS.personalStatement);
    setValue("personalBackground", DEFAULTS.personalBackground);
    setValue("academicBackground", DEFAULTS.academicBackground);
    setValue("professionalBackground", DEFAULTS.professionalBackground);
    setValue("primaryComputerPlatform", DEFAULTS.primaryComputerPlatform);
    setValue("coursesOverview", DEFAULTS.coursesOverview);
    setValue("funnyThing", DEFAULTS.funnyThing);
    setValue("somethingToShare", DEFAULTS.somethingToShare);

    clearCourses();
    DEFAULTS.courses.forEach(createCourseRow);

    // Links
    const linkTexts = $$(".linkText");
    const linkUrls = $$(".linkUrl");
    DEFAULTS.links.forEach((l, i) => {
      if (linkTexts[i]) linkTexts[i].value = l.text;
      if (linkUrls[i]) linkUrls[i].value = l.url;
    });
  }

  function collectCourses() {
    return $$(".course-row").map((row) => ({
      dept: $(".c-dept", row).value.trim(),
      number: $(".c-number", row).value.trim(),
      name: $(".c-name", row).value.trim(),
      reason: $(".c-reason", row).value.trim(),
    }));
  }

  function collectLinks() {
    const texts = $$(".linkText");
    const urls = $$(".linkUrl");
    const links = [];
    for (let i = 0; i < texts.length; i += 1) {
      links.push({ text: texts[i].value.trim(), url: urls[i].value.trim() });
    }
    return links;
  }

  function validateRequired() {
    // Use HTML5 constraints + extra checks
    const invalid = $$("input[required], textarea[required]").filter((el) => !el.value.trim());
    invalid.forEach((el) => el.classList.add("invalid"));
    setTimeout(() => invalid.forEach((el) => el.classList.remove("invalid")), 1200);
    return invalid.length === 0;
  }

  function makeBoldLabel(text) {
    const strong = document.createElement("strong");
    strong.textContent = text;
    return strong;
  }

  function buildResultDOM(payload) {
    const {
      firstName, middleName, nickname, lastName,
      ackStatement, ackDate,
      mascotAdj, mascotAnimal, divider,
      imageSrc, imageCaption,
      personalStatement,
      personalBackground, academicBackground,
      professionalBackground, primaryComputerPlatform,
      coursesOverview, funnyThing, somethingToShare,
      courses, links
    } = payload;

    // Container
    result.innerHTML = "";
    const heading = document.createElement("h2");
    heading.textContent = "Introduction"; // matches original intro page’s H2
    result.appendChild(heading);

    // Optional H1 line (many intro pages use "First Last — Mascot")
    const h3 = document.createElement("h3");
    const displayName = [firstName, middleName, lastName].filter(Boolean).join(" ");
    const nick = nickname ? ` (${nickname})` : "";
    h3.textContent = `${displayName}${nick} ${divider} ${mascotAdj} ${mascotAnimal}`;
    result.appendChild(h3);

    // Figure
    const figure = document.createElement("figure");
    const img = document.createElement("img");
    img.alt = "Profile image";
    img.loading = "lazy";
    img.src = imageSrc;
    const figcap = document.createElement("figcaption");
    figcap.textContent = imageCaption;
    figure.appendChild(img);
    figure.appendChild(figcap);
    result.appendChild(figure);

    // Acknowledgment
    const pAck = document.createElement("p");
    pAck.appendChild(makeBoldLabel("Acknowledgement: "));
    pAck.append(document.createTextNode(`${ackStatement} (${ackDate})`));
    result.appendChild(pAck);

    // Personal Statement
    const pStmt = document.createElement("p");
    pStmt.appendChild(makeBoldLabel("Personal Statement: "));
    pStmt.append(document.createTextNode(personalStatement));
    result.appendChild(pStmt);

    // Bulleted list (mirrors intro page)
    const ul = document.createElement("ul");

    const liPersonal = document.createElement("li");
    liPersonal.appendChild(makeBoldLabel("Personal Background: "));
    liPersonal.append(document.createTextNode(personalBackground));
    ul.appendChild(liPersonal);

    const liAcademic = document.createElement("li");
    liAcademic.appendChild(makeBoldLabel("Academic Background: "));
    liAcademic.append(document.createTextNode(academicBackground));
    ul.appendChild(liAcademic);

    const liProfessional = document.createElement("li");
    liProfessional.appendChild(makeBoldLabel("Professional Background: "));
    liProfessional.append(document.createTextNode(professionalBackground));
    ul.appendChild(liProfessional);

    const liPlatform = document.createElement("li");
    liPlatform.appendChild(makeBoldLabel("Primary Computer Platform: "));
    liPlatform.append(document.createTextNode(primaryComputerPlatform));
    ul.appendChild(liPlatform);

    // Courses with sub-bullets
    const liCourses = document.createElement("li");
    liCourses.appendChild(makeBoldLabel("Courses I'm Taking & Why: "));
    const sub = document.createElement("ul");
    courses.forEach((c) => {
      const subLi = document.createElement("li");
      const idText = `${c.dept.toUpperCase()} ${c.number} - ${c.name}: `;
      const strong = document.createElement("strong");
      strong.textContent = idText;
      subLi.appendChild(strong);
      subLi.append(document.createTextNode(c.reason));
      sub.appendChild(subLi);
    });
    liCourses.appendChild(sub);
    ul.appendChild(liCourses);

    if (funnyThing) {
      const liFunny = document.createElement("li");
      liFunny.appendChild(makeBoldLabel("Funny/Interesting Thing: "));
      liFunny.append(document.createTextNode(funnyThing));
      ul.appendChild(liFunny);
    }

    if (somethingToShare) {
      const liShare = document.createElement("li");
      liShare.appendChild(makeBoldLabel("I'd Like to Share: "));
      liShare.append(document.createTextNode(somethingToShare));
      ul.appendChild(liShare);
    }

    result.appendChild(ul);

    // Links list
    const linksTitle = document.createElement("h3");
    linksTitle.textContent = "Links";
    result.appendChild(linksTitle);
    const linksUl = document.createElement("ul");
    links.forEach((l) => {
      const li = document.createElement("li");
      const a = document.createElement("a");
      a.href = l.url;
      a.target = "_blank";
      a.rel = "noopener";
      a.textContent = l.text;
      li.appendChild(a);
      linksUl.appendChild(li);
    });
    result.appendChild(linksUl);
  }

  function toPayload() {
    // If user uploaded file, use that; else fall back to URL
    const file = document.getElementById("imageFile").files[0];
    const imageSrc = file ? URL.createObjectURL(file) : getValue("imageUrl");

    return {
      firstName: getValue("firstName"),
      middleName: getValue("middleName"),
      nickname: getValue("nickname"),
      lastName: getValue("lastName"),

      ackStatement: getValue("ackStatement"),
      ackDate: getValue("ackDate"),

      mascotAdj: getValue("mascotAdj"),
      mascotAnimal: getValue("mascotAnimal"),
      divider: getValue("divider"),

      imageSrc,
      imageCaption: getValue("imageCaption"),

      personalStatement: getValue("personalStatement"),
      personalBackground: getValue("personalBackground"),
      academicBackground: getValue("academicBackground"),
      professionalBackground: getValue("professionalBackground"),
      primaryComputerPlatform: getValue("primaryComputerPlatform"),
      coursesOverview: getValue("coursesOverview"),
      funnyThing: getValue("funnyThing"),
      somethingToShare: getValue("somethingToShare"),

      courses: collectCourses(),
      links: collectLinks(),
    };
  }

  function showResult() {
    form.classList.add("hidden");
    result.classList.remove("hidden");
    restart.classList.remove("hidden");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function showForm() {
    result.classList.add("hidden");
    restart.classList.add("hidden");
    form.classList.remove("hidden");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  // ---------- Event Wiring ----------
  // Prevent default navigation submit
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    if (!validateRequired()) return;

    const payload = toPayload();
    buildResultDOM(payload);

    // NOTE: The result page mirrors your intro layout.
    // The only intentional difference: this form page's <h2> says "Introduction Form".
    showResult();
  });

  // Reset: back to your defaults
  $("#resetBtn").addEventListener("click", () => {
    // Allow built-in reset to clear file inputs, then re-fill defaults
    setTimeout(prefillDefaults, 0);
  });

  // Clear: empties all inputs (placeholders will show)
  clearBtn.addEventListener("click", () => {
    $$("form input, form textarea").forEach((i) => {
      if (i.type !== "file") i.value = "";
      if (i.type === "date") i.value = "";
    });
    clearCourses();
  });

  // Add Course
  addCourseBtn.addEventListener("click", () => createCourseRow());

  // Restart from result view
  $("#restartBtn").addEventListener("click", () => {
    form.reset();
    prefillDefaults();
    showForm();
  });

  // Prefill everything on load
  document.addEventListener("DOMContentLoaded", () => {
    prefillDefaults();
  });
})();
