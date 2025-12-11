console.log("DERMAI services JS loaded");

// simple guard: if not logged in, send to login first
if (localStorage.getItem("dermaiLoggedIn") !== "true") {
  window.location.href = "login.html?from=services";
}


/* =======================
   1. Tab switching
======================= */

const tabButtons = document.querySelectorAll(".service-tab");
const panels = document.querySelectorAll(".service-panel");

tabButtons.forEach((btn) => {
  btn.addEventListener("click", () => {
    const targetId = btn.dataset.target;

    tabButtons.forEach((b) => b.classList.remove("active"));
    btn.classList.add("active");

    panels.forEach((panel) => {
      if (panel.id === targetId) {
        panel.classList.add("active");
      } else {
        panel.classList.remove("active");
      }
    });
  });
});


/* =======================
   2. DERMAI Analysis
======================= */

const analysisForm = document.getElementById("analysisForm");
const analysisResult = document.getElementById("analysisResult");
const analysisSummary = document.getElementById("analysisSummary");
const recoBlock = document.getElementById("recoBlock");
const recoIntro = document.getElementById("recoIntro");

const skinTypeSelect = document.getElementById("skinType");
const combinationGroup = document.getElementById("combinationGroup");
const combinationDetailInput = document.getElementById("combinationDetail");

const concernPills = document.querySelectorAll(".concern-pill");
const otherConcernGroup = document.getElementById("otherConcernGroup");
const otherConcernInput = document.getElementById("otherConcern");

const productImagesInput = document.getElementById("productImages");
const productImagePreview = document.getElementById("productImagePreview");

/* show/hide combination extra when Combination is selected */
if (skinTypeSelect && combinationGroup) {
  skinTypeSelect.addEventListener("change", () => {
    if (skinTypeSelect.value === "Combination") {
      combinationGroup.classList.remove("hidden");
    } else {
      combinationGroup.classList.add("hidden");
      if (combinationDetailInput) {
        combinationDetailInput.value = "";
      }
    }
  });
}

/* concern pills toggle + Other handling */
concernPills.forEach((pill) => {
  pill.addEventListener("click", () => {
    const isOther = pill.dataset.type === "other";

    pill.classList.toggle("active");

    if (isOther) {
      if (pill.classList.contains("active")) {
        otherConcernGroup.classList.remove("hidden");
        otherConcernInput.focus();
      } else {
        otherConcernGroup.classList.add("hidden");
        otherConcernInput.value = "";
      }
    }
  });
});

/* image upload preview */
if (productImagesInput && productImagePreview) {
  productImagesInput.addEventListener("change", () => {
    productImagePreview.innerHTML = "";
    const files = Array.from(productImagesInput.files || []);
    files.forEach((file) => {
      const url = URL.createObjectURL(file);
      const img = document.createElement("img");
      img.src = url;
      img.alt = file.name;
      img.className = "image-thumb";
      productImagePreview.appendChild(img);
    });
  });
}

/* product  image */

const herbalProducts = [
  {
    name: "Calming Green Tea Gel Cleanser",
    desc: "Gentle cleanser with green tea & aloe.",
    img: "Calming Green Tea Gel Cleanser.jpg"
  },
  {
    name: "Centella Barrier Serum",
    desc: "Soothes redness & repairs the barrier.",
    // reuse a known working skincare image
    img: "DERMAI Centella Barrier Serum.jpg"
  },
  {
    name: "Squalane + Ceramide Moisturiser",
    desc: "Lightweight but barrier-repairing cream.",
    img: "Squalane + Ceramide Moisturiser.jpg"
  }
];

const clinicalProducts = [
  {
    name: "2% Salicylic Acid Cleanser",
    desc: "Unclogs pores & reduces breakouts.",
    img: "Salicylic Acid Cleanser.jpg"
  },
  {
    name: "5% Niacinamide Serum",
    desc: "Balances oil & reduces redness.",
    img: "Niacinamide Serum.jpg"
  },
  {
    name: "SPF 50 Fluid",
    desc: "Daily UV protection for pigmentation.",
    img: "SPF 50 Fluid.jpg"
  }
];

const herbalReco = document.getElementById("herbalReco");
const clinicalReco = document.getElementById("clinicalReco");

function renderProductLists() {
  if (herbalReco) {
    herbalReco.innerHTML = herbalProducts
      .map(
        (p) => `
        <li class="reco-item">
          <img src="${p.img}" alt="${p.name}" class="reco-img">
          <div>
            <div class="reco-item-title">${p.name}</div>
            <div class="reco-item-desc">${p.desc}</div>
          </div>
        </li>`
      )
      .join("");
  }

  if (clinicalReco) {
    clinicalReco.innerHTML = clinicalProducts
      .map(
        (p) => `
        <li class="reco-item">
          <img src="${p.img}" alt="${p.name}" class="reco-img">
          <div>
            <div class="reco-item-title">${p.name}</div>
            <div class="reco-item-desc">${p.desc}</div>
          </div>
        </li>`
      )
      .join("");
  }
}

/* analysis submit */
if (analysisForm && analysisSummary && analysisResult && recoBlock && recoIntro) {
  analysisForm.addEventListener("submit", (e) => {
    e.preventDefault();

    const skinType = skinTypeSelect.value;
    const waterPH = document.getElementById("waterPH").value;
    const currentProducts = document.getElementById("currentProducts").value.trim();
    const productOutcome = document.getElementById("productOutcome").value.trim();

    const comboDetail =
      skinType === "Combination" && combinationDetailInput
        ? combinationDetailInput.value.trim()
        : "";

    const activeConcerns = Array.from(concernPills)
      .filter(
        (pill) => pill.classList.contains("active") && pill.dataset.type !== "other"
      )
      .map((pill) => pill.dataset.value);

    let otherConcernText = "";
    if (
      otherConcernInput &&
      !otherConcernGroup.classList.contains("hidden") &&
      otherConcernInput.value.trim()
    ) {
      otherConcernText = otherConcernInput.value.trim();
      activeConcerns.push(otherConcernText);
    }

    const hasConcerns = activeConcerns.length > 0;
    const hasImages =
      productImagesInput &&
      productImagesInput.files &&
      productImagesInput.files.length > 0;

    // Always show the result block when button is pressed
    analysisResult.classList.remove("hidden");
    // Hide reco block by default; we only show it when we have enough data
    recoBlock.classList.add("hidden");

    // ==========================
    // VALIDATION: "box empty" case
    // ==========================
    const allEmpty =
      !skinType &&
      !comboDetail &&
      !hasConcerns &&
      !otherConcernText &&
      !waterPH &&
      !currentProducts &&
      !productOutcome &&
      !hasImages;

    if (allEmpty) {
      analysisSummary.innerHTML =
        "You haven’t filled any data. Please select your skin type, add at least one skin concern, or describe your routine so DERMAI can analyse your skin.";
      return; // stop here, do not run normal analysis
    }

    // Optional: require at least skin type + some concern
    if (!skinType && !hasConcerns) {
      analysisSummary.innerHTML =
        "Missing key details. Please choose a skin type and at least one concern so DERMAI can create a meaningful analysis.";
      return;
    }

    // If we reach here, run normal analysis
    let overview = "";
    let routineTips = [];

    if (skinType) {
      overview += `Your skin type appears to be <strong>${skinType}</strong>. `;
      if (comboDetail) {
        overview += `You described your combination pattern as <strong>${comboDetail}</strong>. `;
      }
    }

    if (hasConcerns) {
      overview += `Main concerns: <strong>${activeConcerns.join(", ")}</strong>. `;
    }

    if (waterPH.toLowerCase().includes("hard")) {
      routineTips.push(
        "Because your water is on the harder / high-pH side, use a low-pH gentle cleanser and moisturise immediately after washing."
      );
    }

    if (currentProducts) {
      routineTips.push(
        `You are currently using: "${currentProducts}". DERMAI will consider how your existing products interact before suggesting changes.`
      );
    }

    if (productOutcome) {
      routineTips.push(
        `You described your current results as: "${productOutcome}". DERMAI would adjust actives gradually rather than changing everything at once.`
      );
    }

    let html = `<strong>Overview</strong><br>${overview || "DERMAI needs more detail to fully understand your skin, but here is a starting point based on what you shared."}<br><br>`;
    if (routineTips.length) {
      html += `<strong>Suggestions</strong><br>• ${routineTips.join("<br>• ")}<br>`;
    }

    analysisSummary.innerHTML = html;

    // Only show recoBlock when we have at least skin type or concerns
    if (skinType || hasConcerns) {
      const concernText = hasConcerns ? activeConcerns.join(", ") : "general skin balance";

      recoIntro.innerHTML = `Because you have <strong>${skinType || "your current skin type"}</strong> with concerns around <strong>${concernText}</strong>, DERMAI suggests starting with one of the routines below.`;

      renderProductLists();
      recoBlock.classList.remove("hidden");
    }
  });
}


/* =======================
   3. Custom Product Builder (pill style)
======================= */

const builderForm = document.getElementById("builderForm");
const builderResult = document.getElementById("builderResult");
const builderSummary = document.getElementById("builderSummary");
const builderPills = document.querySelectorAll(".builder-pill");

builderPills.forEach((pill) => {
  pill.addEventListener("click", () => {
    pill.classList.toggle("active");
  });
});

if (builderForm && builderResult && builderSummary) {
  builderForm.addEventListener("submit", (e) => {
    e.preventDefault();

    const baseType = document.getElementById("baseType").value;
    const texture = document.getElementById("texture").value;

    const includeFromPills = Array.from(
      document.querySelectorAll('.builder-pill[data-group="include"].active')
    ).map((p) => p.dataset.value);

    const excludeFromPills = Array.from(
      document.querySelectorAll('.builder-pill[data-group="exclude"].active')
    ).map((p) => p.dataset.value);

    const customIncludeRaw =
      document.getElementById("customInclude")?.value || "";
    const customInclude = customIncludeRaw
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);

    const customAllergyRaw =
      document.getElementById("customAllergy")?.value || "";
    const customAllergies = customAllergyRaw
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);

    const allInclude = [...includeFromPills, ...customInclude];
    const allExclude = [...excludeFromPills, ...customAllergies];

    builderResult.classList.remove("hidden");

    // ==========================
    // VALIDATION: "box empty" case
    // (no ingredients selected or typed at all)
    // ==========================
    const noIngredientData =
      includeFromPills.length === 0 &&
      excludeFromPills.length === 0 &&
      !customIncludeRaw.trim() &&
      !customAllergyRaw.trim();

    if (noIngredientData) {
      builderSummary.innerHTML =
        "You haven’t filled any data. Please select at least one ingredient to include or exclude, or add your own actives/allergies so DERMAI can build a custom formula.";
      return;
    }

    // Normal builder summary
    let html = `Base product: <strong>${baseType}</strong><br>`;
    html += `Preferred texture: <strong>${texture}</strong><br><br>`;

    if (allInclude.length) {
      html += `INGREDIENTS TO EMPHASISE:<br>• ${allInclude.join(
        "<br>• "
      )}<br><br>`;
    } else {
      html += `INGREDIENTS TO EMPHASISE:<br>• You haven't selected specific actives yet. DERMAI will keep the formula gentle and barrier-safe by default.<br><br>`;
    }

    if (allExclude.length) {
      html += `INGREDIENTS TO AVOID (allergies / sensitivities):<br>• ${allExclude.join(
        "<br>• "
      )}`;
    } else {
      html += `INGREDIENTS TO AVOID:<br>• None specified. We'll still avoid obvious irritants for sensitive skin.`;
    }

    builderSummary.innerHTML = html;
  });
}


/* =======================
   4. Floating Chat (Pharmacist / Dermatologist)
======================= */

const chatToggle = document.getElementById("chatToggle");
const chatWidget = document.getElementById("chatWidget");
const chatClose = document.getElementById("chatClose");
const chatForm = document.getElementById("chatForm");
const chatInput = document.getElementById("chatInput");
const chatMessages = document.getElementById("chatMessages");
const chatRoleTabs = document.querySelectorAll(".chat-role-tab");
const appointmentToggle = document.getElementById("appointmentToggle");
const appointmentPanel = document.getElementById("appointmentPanel");
const appointmentForm = document.getElementById("appointmentForm");

let currentRole = "pharmacist";

/* open / close widget */
if (chatToggle && chatWidget) {
  chatToggle.addEventListener("click", () => {
    chatWidget.classList.toggle("hidden");
  });
}

if (chatClose && chatWidget) {
  chatClose.addEventListener("click", () => {
    chatWidget.classList.add("hidden");
  });
}

/* switch roles (pharmacist / dermatologist) */
chatRoleTabs.forEach((tab) => {
  tab.addEventListener("click", () => {
    const role = tab.dataset.role;
    if (role === currentRole) return;

    currentRole = role;
    chatRoleTabs.forEach((t) => t.classList.remove("active"));
    tab.classList.add("active");

    // show appointment toggle only in dermatologist mode
    if (appointmentToggle) {
      if (currentRole === "dermatologist") {
        appointmentToggle.classList.remove("hidden");
      } else {
        appointmentToggle.classList.add("hidden");
        if (appointmentPanel) {
          appointmentPanel.classList.add("hidden");
        }
      }
    }

    // add a small "mode switched" bot message
    const botMsg = document.createElement("div");
    botMsg.className = "chat-message bot";
    if (currentRole === "pharmacist") {
      botMsg.innerHTML =
        "<p>You’re now chatting with Derma-AI Pharmacist 👩‍⚕️ for product and routine advice.</p>";
    } else {
      botMsg.innerHTML =
        "<p>You’re now in Dermatologist mode 🩺. You can chat in real-time or book an appointment below.</p>";
    }
    chatMessages.appendChild(botMsg);
    chatMessages.scrollTop = chatMessages.scrollHeight;
  });
});

/* main chat submit */
if (chatForm && chatInput && chatMessages) {
  chatForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const text = chatInput.value.trim();
    if (!text) return;

    // user bubble
    const userMsg = document.createElement("div");
    userMsg.className = "chat-message user";
    userMsg.innerHTML = `<p>${text}</p>`;
    chatMessages.appendChild(userMsg);

    chatInput.value = "";

    // bot bubble
    const botMsg = document.createElement("div");
    botMsg.className = "chat-message bot";

    if (currentRole === "pharmacist") {
      botMsg.innerHTML =
        "<p>As your Derma-AI Pharmacist, I would look at your skin type, main concern and actives in your routine before suggesting any new products. This is a demo reply.</p>";
    } else {
      botMsg.innerHTML =
        "<p>In Dermatologist mode, your messages are treated as a pre-consult note. In a real app, a dermatologist would review this and respond or join a live session.</p>";
    }

    chatMessages.appendChild(botMsg);
    chatMessages.scrollTop = chatMessages.scrollHeight;
  });
}

/* appointment toggle */
if (appointmentToggle && appointmentPanel) {
  appointmentToggle.addEventListener("click", () => {
    appointmentPanel.classList.toggle("hidden");
  });
}

/* appointment submit */
if (appointmentForm && chatMessages) {
  appointmentForm.addEventListener("submit", (e) => {
    e.preventDefault();

    const mode = document.getElementById("apptMode").value;
    const date = document.getElementById("apptDate").value;
    const time = document.getElementById("apptTime").value;
    const notes = document.getElementById("apptNotes").value.trim();

    const summary = `Dermatologist appointment requested: ${mode}${
      date ? " on " + date : ""
    }${time ? " at " + time : ""}${
      notes ? ". Note: " + notes : ""
    }. (Demo only – no real booking yet.)`;

    const botMsg = document.createElement("div");
    botMsg.className = "chat-message bot";
    botMsg.innerHTML = `<p>${summary}</p>`;
    chatMessages.appendChild(botMsg);
    chatMessages.scrollTop = chatMessages.scrollHeight;

    appointmentPanel.classList.add("hidden");
    appointmentForm.reset();
  });
}


/* =======================
   5. Ingredient Checker
======================= */

const ingredientForm = document.getElementById("ingredientForm");
const ingredientResult = document.getElementById("ingredientResult");
const ingredientSummary = document.getElementById("ingredientSummary");

if (ingredientForm && ingredientResult && ingredientSummary) {
  ingredientForm.addEventListener("submit", (e) => {
    e.preventDefault();

    const textEl = document.getElementById("ingredientList");
    const text = textEl ? textEl.value.toLowerCase().trim() : "";

    ingredientResult.classList.remove("hidden");

    // ==========================
    // VALIDATION: "box empty" case
    // ==========================
    if (!text) {
      ingredientSummary.innerHTML =
        "You haven’t filled any data. Please paste at least one ingredient (or a full INCI list) for DERMAI to check.";
      return;
    }

    const warnings = [];

    if (text.includes("fragrance"))
      warnings.push("Fragrance may irritate sensitive skin.");
    if (text.includes("alcohol"))
      warnings.push("Some alcohols can be drying or irritating.");
    if (text.includes("essential oil"))
      warnings.push("Essential oils may trigger irritation or allergies.");
    if (text.includes("sls") || text.includes("sodium lauryl sulfate"))
      warnings.push("SLS can strip the skin barrier and cause dryness.");

    ingredientSummary.innerHTML =
      warnings.length > 0
        ? warnings.map((w) => `• ${w}`).join("<br>")
        : "No obvious red-flag ingredients detected in this quick check. Always patch-test if you’re unsure.";
  });
}
