// ----- Shop inventory data (used for wishlist + contact link) -----
var sampleInventory = [
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

var wishlist = [];

// =========================
// SHOP PAGE FUNCTIONALITY
// =========================
function initShopPage() {
  var shopGrid = document.querySelector(".shop-grid");
  if (!shopGrid) {
    return; // not on shop page
  }

  var roomSelect = document.getElementById("filter-room");
  var catSelect = document.getElementById("filter-category");
  var minPriceInput = document.getElementById("filter-min-price");
  var maxPriceInput = document.getElementById("filter-max-price");
  var wishlistList = document.querySelector(".wishlist-items");
  var contactSelectedLink = document.querySelector(".contact-selected-link");

  function renderItems(items) {
    shopGrid.innerHTML = "";
    items.forEach(function (item) {
      var card = document.createElement("article");
      card.className = "card item-card";
      card.innerHTML =
        '<img src="' + item.image + '" alt="' + item.name + '">' +
        "<h3>" + item.name + "</h3>" +
        '<p class="item-meta">' + item.room + " • " + item.category + "</p>" +
        "<p>" + item.description + "</p>" +
        '<p class="item-meta">Condition: ' + item.condition + " • " + item.dimensions + "</p>" +
        '<p class="price">$' + item.price + "</p>" +
        '<button class="btn btn-outline btn-wishlist" data-id="' + item.id + '">' +
        "Interested" +
        "</button>";
      shopGrid.appendChild(card);
    });
  }

  // only show something when a category is chosen
  function applyFilters() {
    var room = roomSelect.value;
    var cat = catSelect.value;
    var minP = Number(minPriceInput.value) || 0;
    var maxP = Number(maxPriceInput.value) || 10000;

    // if "All categories" selected, show nothing
    if (cat === "all") {
      renderItems([]);
      return;
    }

    // hard-coded preview items by category
    var prices = {
      Sofa: 500,
      Chair: 150,
      Table: 300,
      Bench: 200,
      Decor: 75
    };

    var names = {
      Sofa: "Sofa",
      Chair: "Chair",
      Table: "Table",
      Bench: "Bench",
      Decor: "Decor Lamp"
    };

    var descriptions = {
      Sofa: "Previewing a staging sofa.",
      Chair: "Previewing a staging chair.",
      Table: "Previewing a staging table.",
      Bench: "Previewing a staging bench.",
      Decor: "Previewing a decor lamp."
    };

    var images = {
      Sofa: "images/sofa.png",
      Chair: "images/chair.png",
      Table: "images/table.png",
      Bench: "images/bench.png",
      Decor: "images/decor.png"
    };

    var price = prices[cat];
    var image = images[cat];

    // respect price range
    if (price < minP || price > maxP) {
      renderItems([]);
      return;
    }

    var item = {
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
  }

  function updateWishlist() {
    wishlistList.innerHTML = "";
    wishlist.forEach(function (id) {
      var item = sampleInventory.find(function (i) {
        return i.id === id;
      });
      if (!item) {
        return;
      }
      var li = document.createElement("li");
      li.textContent = item.name;
      wishlistList.appendChild(li);
    });
    contactSelectedLink.style.display = wishlist.length ? "inline" : "none";
  }

  // initial render: start EMPTY
  renderItems([]);

  // filter listeners (category change now controls display)
  [roomSelect, catSelect, minPriceInput, maxPriceInput].forEach(function (el) {
    el.addEventListener("change", applyFilters);
  });

  // delegate wishlist clicks (still only really works with sampleInventory items)
  shopGrid.addEventListener("click", function (e) {
    var target = e.target;
    if (!target.classList.contains("btn-wishlist")) {
      return;
    }
    var id = Number(target.getAttribute("data-id"));
    if (wishlist.indexOf(id) === -1) {
      wishlist.push(id);
      updateWishlist();
    }
  });

  contactSelectedLink.addEventListener("click", function (e) {
    e.preventDefault();

    var names = wishlist
      .map(function (id) {
        var item = sampleInventory.find(function (i) {
          return i.id === id;
        });
        return item ? item.name : null;
      })
      .filter(function (name) {
        return name;
      })
      .join(", ");

    var url = new URL("contact.html", window.location.href);
    if (names) {
      url.searchParams.set("items", names);
    }
    window.location.href = url.toString();
  });
}

// =========================
// GALLERY LIGHTBOX
// =========================
function initGalleryLightbox() {
  var overlay = document.querySelector(".lightbox-overlay");
  if (!overlay) {
    return;
  }

  var img = overlay.querySelector("img");
  var caption = overlay.querySelector("p");
  var closeBtn = overlay.querySelector(".lightbox-close");

  document.addEventListener("click", function (e) {
    var thumb = e.target.closest("[data-lightbox-src]");
    if (thumb) {
      img.src = thumb.getAttribute("data-lightbox-src");
      caption.textContent = thumb.getAttribute("data-lightbox-caption") || "";
      overlay.style.display = "flex";
    }
  });

  function close() {
    overlay.style.display = "none";
    img.src = "";
  }

  closeBtn.addEventListener("click", close);

  overlay.addEventListener("click", function (e) {
    if (e.target === overlay) {
      close();
    }
  });

  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape") {
      close();
    }
  });
}

// =========================
// HOME SLIDESHOW
// =========================
function initHomeSlideshow() {
  var img = document.querySelector(".slideshow-image");
  if (!img) {
    return; // not on home page
  }

  // Images you will drop into the images folder
  var slides = [
    "images/stage1.png",
    "images/stage2.png",
    "images/stage3.png",
    "images/stage4.png"
  ];

  var index = 0;
  img.src = slides[0];

  setInterval(function () {
    index = (index + 1) % slides.length;
    img.src = slides[index];
  }, 4000); // 4 seconds per slide
}

// =========================
// CONTACT FORM HELPERS
// =========================
function setError(input, msg) {
  var span = input.nextElementSibling;
  if (!span || !span.classList.contains("error")) {
    span = document.createElement("span");
    span.className = "error";
    input.insertAdjacentElement("afterend", span);
  }
  span.textContent = msg;
}

function clearError(input) {
  var span = input.nextElementSibling;
  if (span && span.classList.contains("error")) {
    span.textContent = "";
  }
}

// =========================
// CONTACT FORM VALIDATION
// =========================
function initContactForm() {
  var form = document.querySelector("#contact-form");
  if (!form) {
    return;
  }

  var nameInput = form.querySelector("#name");
  var emailInput = form.querySelector("#email");
  var messageInput = form.querySelector("#message");
  var phoneInput = form.querySelector("#phone");
  var itemInput = form.querySelector("#item");
  var statusBox = document.querySelector("#form-status");

  // prefill item-of-interest from query string
  var params = new URLSearchParams(window.location.search);
  var items = params.get("items");
  if (items && itemInput) {
    itemInput.value = items;
  }

  form.addEventListener("submit", function (e) {
    e.preventDefault();

    statusBox.textContent = "";
    statusBox.className = "";

    var ok = true;
    var emailPattern = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;

    if (!nameInput.value.trim()) {
      setError(nameInput, "Name is required.");
      ok = false;
    } else {
      clearError(nameInput);
    }

    if (!emailPattern.test(emailInput.value.trim())) {
      setError(emailInput, "Enter a valid email.");
      ok = false;
    } else {
      clearError(emailInput);
    }

    if (!messageInput.value.trim()) {
      setError(messageInput, "Message is required.");
      ok = false;
    } else {
      clearError(messageInput);
    }

    if (phoneInput.value && !/^[0-9\-\+\s]{7,15}$/.test(phoneInput.value)) {
      setError(phoneInput, "Phone should be digits and basic symbols only.");
      ok = false;
    } else {
      clearError(phoneInput);
    }

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

// =========================
// FAQ ACCORDION
// =========================
function initFAQAccordion() {
  var questions = document.querySelectorAll(".faq-question");
  if (!questions.length) {
    return;
  }

  questions.forEach(function (btn) {
    btn.addEventListener("click", function () {
      var parent = btn.parentElement;
      var answer = parent.querySelector(".faq-answer");
      var isOpen = answer.style.display === "block";
      answer.style.display = isOpen ? "none" : "block";
    });
  });
}

// =========================
// NAV HIGHLIGHT + INIT
// =========================
document.addEventListener("DOMContentLoaded", function () {
  // Simple "active" nav highlighting
  var navLinks = document.querySelectorAll(".main-nav a");
  navLinks.forEach(function (link) {
    if (link.href === window.location.href) {
      link.classList.add("active");
    }
  });

  initHomeSlideshow();
  initShopPage();
  initGalleryLightbox();
  initContactForm();
  initFAQAccordion();
});
