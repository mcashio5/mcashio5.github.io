// Simple "active" nav highlighting
document.addEventListener("DOMContentLoaded", () => {
  const navLinks = document.querySelectorAll(".main-nav a");
  navLinks.forEach(link => {
    if (link.href === window.location.href) {
      link.classList.add("active");
    }
  });

  initShopPage();
  initGalleryLightbox();
  initContactForm();
  initFAQAccordion();
});

// ----- Shop page functionality -----

const sampleInventory = [
  {
    id: 1,
    name: "Neutral Linen Sofa",
    room: "Living Room",
    category: "Sofa",
    price: 650,
    condition: "Gently used",
    dimensions: "84 in W",
    image: "images/living_room_sofa.jpg",
    description: "Three seat sofa used in model home living room."
  },
  {
    id: 2,
    name: "Round Dining Table",
    room: "Dining Room",
    category: "Table",
    price: 380,
    condition: "Like new",
    dimensions: "48 in diameter",
    image: "images/dining_table.jpg",
    description: "Wood dining table staged in open concept kitchen."
  },
  {
    id: 3,
    name: "Tufted Bedroom Bench",
    room: "Bedroom",
    category: "Bench",
    price: 150,
    condition: "Good",
    dimensions: "48 in W",
    image: "images/bedroom_bench.jpg",
    description: "End of bed bench in soft gray fabric."
  }
];

let wishlist = [];

function initShopPage() {
  const shopGrid = document.querySelector(".shop-grid");
  if (!shopGrid) return; // not on shop page

  const roomSelect = document.getElementById("filter-room");
  const catSelect = document.getElementById("filter-category");
  const minPriceInput = document.getElementById("filter-min-price");
  const maxPriceInput = document.getElementById("filter-max-price");
  const wishlistList = document.querySelector(".wishlist-items");
  const contactSelectedLink = document.querySelector(".contact-selected-link");

  function renderItems(items) {
    shopGrid.innerHTML = "";
    items.forEach(item => {
      const card = document.createElement("article");
      card.className = "card item-card";
      card.innerHTML = `
        <img src="${item.image}" alt="${item.name}">
        <h3>${item.name}</h3>
        <p class="item-meta">${item.room} • ${item.category}</p>
        <p>${item.description}</p>
        <p class="item-meta">Condition: ${item.condition} • ${item.dimensions}</p>
        <p class="price">$${item.price}</p>
        <button class="btn btn-outline btn-wishlist" data-id="${item.id}">
          Interested
        </button>
      `;
      shopGrid.appendChild(card);
    });
  }

  function applyFilters() {
    const room = roomSelect.value;
    const cat = catSelect.value;
    const minP = Number(minPriceInput.value) || 0;
    const maxP = Number(maxPriceInput.value) || 10000;

    // If a specific category is chosen, show that single item with your PNG image
    if (cat !== "all") {
      const prices = {
        Sofa: 500,
        Chair: 150,
        Table: 300,
        Bench: 200,
        Decor: 75
      };

      const names = {
        Sofa: "Sofa",
        Chair: "Chair",
        Table: "Table",
        Bench: "Bench",
        Decor: "Decor Lamp"
      };

      const descriptions = {
        Sofa: "Previewing a staging sofa.",
        Chair: "Previewing a staging chair.",
        Table: "Previewing a staging table.",
        Bench: "Previewing a staging bench.",
        Decor: "Previewing a decor lamp."
      };

      const images = {
        Sofa: "images/sofa.png",
        Chair: "images/chair.png",
        Table: "images/table.png",
        Bench: "images/bench.png",
        Decor: "images/decor.png"
      };

      const price = prices[cat];
      const image = images[cat];

      // Respect price range
      if (price < minP || price > maxP) {
        renderItems([]);
        return;
      }

      const item = {
        id: 999,
        name: names[cat],
        room: room === "all" ? "Staging" : room,
        category: cat,
        price: price,
        condition: "New",
        dimensions: "",
        description: descriptions[cat],
        image: image
      };

      renderItems([item]);
      return;
    }

    // If "All categories" selected, fall back to original inventory filter
    let filtered = [...sampleInventory];

    filtered = filtered.filter(item => {
      const byRoom = room === "all" || item.room === room;
      const byPrice = item.price >= minP && item.price <= maxP;
      return byRoom && byPrice;
    });

    renderItems(filtered);
  }

  function updateWishlist() {
    wishlistList.innerHTML = "";
    wishlist.forEach(id => {
      const item = sampleInventory.find(i => i.id === id);
      if (!item) return;
      const li = document.createElement("li");
      li.textContent = item.name;
      wishlistList.appendChild(li);
    });
    contactSelectedLink.style.display = wishlist.length ? "inline" : "none";
  }

  // initial render (shows original items when category = all)
  applyFilters();

  // filter listeners (category change will now immediately show image)
  [roomSelect, catSelect, minPriceInput, maxPriceInput].forEach(el => {
    el.addEventListener("change", applyFilters);
  });

  // delegate wishlist clicks (only works for items from sampleInventory, which is fine)
  shopGrid.addEventListener("click", e => {
    if (!e.target.classList.contains("btn-wishlist")) return;
    const id = Number(e.target.dataset.id);
    if (!wishlist.includes(id)) {
      wishlist.push(id);
      updateWishlist();
    }
  });

  // link to contact page with items in query string
  contactSelectedLink.addEventListener("click", e => {
    e.preventDefault();
    const names = wishlist
      .map(id => sampleInventory.find(i => i.id === id)?.name)
      .filter(Boolean)
      .join(", ");
    const url = new URL("contact.html", window.location.href);
    if (names) url.searchParams.set("items", names);
    window.location.href = url.toString();
  });
}

// ----- Gallery lightbox -----

function initGalleryLightbox() {
  const overlay = document.querySelector(".lightbox-overlay");
  if (!overlay) return;

  const img = overlay.querySelector("img");
  const caption = overlay.querySelector("p");
  const closeBtn = overlay.querySelector(".lightbox-close");

  document.addEventListener("click", e => {
    const thumb = e.target.closest("[data-lightbox-src]");
    if (thumb) {
      img.src = thumb.dataset.lightboxSrc;
      caption.textContent = thumb.dataset.lightboxCaption || "";
      overlay.style.display = "flex";
    }
  });

  function close() {
    overlay.style.display = "none";
    img.src = "";
  }

  closeBtn.addEventListener("click", close);
  overlay.addEventListener("click", e => {
    if (e.target === overlay) close();
  });

  document.addEventListener("keydown", e => {
    if (e.key === "Escape") close();
  });
}

// ----- Contact form validation -----

function initContactForm() {
  const form = document.querySelector("#contact-form");
  if (!form) return;

  const nameInput = form.querySelector("#name");
  const emailInput = form.querySelector("#email");
  const messageInput = form.querySelector("#message");
  const phoneInput = form.querySelector("#phone");
  const itemInput = form.querySelector("#item");
  const statusBox = document.querySelector("#form-status");

  // prefill item-of-interest from query string
  const params = new URLSearchParams(window.location.search);
  const items = params.get("items");
  if (items && itemInput) {
    itemInput.value = items;
  }

  form.addEventListener("submit", e => {
    e.preventDefault();
    statusBox.textContent = "";
    statusBox.className = "";

    let ok = true;

    const emailPattern = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;

    if (!nameInput.value.trim()) {
      setError(nameInput, "Name is required.");
      ok = false;
    } else clearError(nameInput);

    if (!emailPattern.test(emailInput.value.trim())) {
      setError(emailInput, "Enter a valid email.");
      ok = false;
    } else clearError(emailInput);

    if (!messageInput.value.trim()) {
      setError(messageInput, "Message is required.");
      ok = false;
    } else clearError(messageInput);

    if (phoneInput.value && !/^[0-9\-\+\s]{7,15}$/.test(phoneInput.value)) {
      setError(phoneInput, "Phone should be digits and basic symbols only.");
      ok = false;
    } else clearError(phoneInput);

    if (!ok) {
      statusBox.textContent = "Please fix the highlighted fields.";
      statusBox.className = "error";
      return;
    }

    statusBox.textContent = "Thank you, we will contact you soon about your selected items.";
    statusBox.className = "success";
    form.reset();
  });
}

function setError(input, msg) {
  let span = input.nextElementSibling;
  if (!span || !span.classList.contains("error")) {
    span = document.createElement("span");
    span.className = "error";
    input.insertAdjacentElement("afterend", span);
  }
  span.textContent = msg;
}

function clearError(input) {
  const span = input.nextElementSibling;
  if (span && span.classList.contains("error")) {
    span.textContent = "";
  }
}

// ----- FAQ accordion -----

function initFAQAccordion() {
  const questions = document.querySelectorAll(".faq-question");
  if (!questions.length) return;

  questions.forEach(btn => {
    btn.addEventListener("click", () => {
      const answer = btn.parentElement.querySelector(".faq-answer");
      const isOpen = answer.style.display === "block";
      answer.style.display = isOpen ? "none" : "block";
    });
  });
}
