console.log("DERMAI services JS loaded");

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

/* Show text input when Combination is selected */
if (skinTypeSelect && combinationGroup) {
  skinTypeSelect.addEventListener("change", () => {
    if (skinTypeSelect.value === "Combination") {
      combinationGroup.classList.remove("hidden");
    } else {
      combinationGroup.classList.add("hidden");
      if (combinationDetailInput) combinationDetailInput.value = "";
    }
  });
}

/* Concern pills + handle "Other..." */
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

/* Image upload preview */
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

/* Demo product recommendations */
const herbalProducts = [
  {
    name: "Calming Green Tea Gel Cleanser",
    desc: "Gentle cleanser with green tea & aloe.",
    img: "https://images.unsplash.com/photo-1612817288484-6f916006741a?auto=format&fit=crop&w=300&q=80"
  },
  {
    name: "Centella Barrier Serum",
    desc: "Soothes redness & repairs the barrier.",
    img: "https://images.unsplash.com/photo-1612815154858-60aa4c59eaa3?auto=format&fit=crop&w=300&q=80"
  },
  {
    name: "Squalane + Ceramide Moisturiser",
    desc: "Lightweight but barrier-repairing cream.",
    img: "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&w=300&q=80"
  }
];

const clinicalProducts = [
  {
    name: "2% Salicylic Acid Cleanser",
    desc: "Unclogs pores & reduces breakouts.",
    img: "https://images.unsplash.com/photo-1585386959984-a4155223f3f8?auto=format&fit=crop&w=300&q=80"
  },
  {
    name: "5% Niacinamide Serum",
    desc: "Balances oil & reduces redness.",
    img: "https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?auto=format&fit=crop&w=300&q=80"
  },
  {
    name: "SPF 50 Fluid",
    desc: "Daily UV protection for pigmentation.",
    img: "https://images.unsplash.com/photo-1612810432633-96f64dc8ccb6?auto=format&fit=crop&w=300&q=80"
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

/* Handle analysis submit */
if (analysisForm) {
  analysisForm.addEventListener("submit", (e) => {
    e.preventDefault();

    const skinType = skinTypeSelect.value;
    const waterPH = document.getElementById("waterPH").value;
    const productOutcome = document.getElementById("productOutcome").value.trim();
    const comboDetail =
      skinType === "Combination" && combinationDetailInput
        ? combinationDetailInput.value.trim()
        : "";

    /* Collect concerns */
    const activeConcerns = Array.from(concernPills)
      .filter(
        (pill) => pill.classList.contains("active") && pill.dataset.type !== "other"
      )
      .map((pill) => pill.dataset.value);

    if (
      otherConcernInput &&
      !otherConcernGroup.classList.contains("hidden") &&
      otherConcernInput.value.trim()
    ) {
      activeConcerns.push(otherConcernInput.value.trim());
    }

    /* Build analysis text */
    let overview = "";
    let focusAreas = [];
    let routineTips = [];

    if (skinType) {
      overview += `Your skin type appears to be <strong>${skinType}</strong>. `;
      if (comboDetail) {
        overview += `You described your combination pattern as: <strong>${comboDetail}</strong>. `;
      }
    } else {
      overview += "Select a skin type for accurate analysis. ";
    }

    if (activeConcerns.length) {
      overview += `Main concerns: <strong>${activeConcerns.join(", ")}</strong>. `;
    }

    if (waterPH.toLowerCase().includes("hard")) {
      routineTips.push("Use a low-pH gentle cleanser; hard water can irritate skin.");
    }

    if (productOutcome) {
      routineTips.push(
        `Your current routine is: "${productOutcome}". DERMAI suggests adjusting actives carefully rather than changing everything at once.`
      );
    }

    let html = `<strong>Overview</strong><br>${overview}<br><br>`;

    if (focusAreas.length) {
      html += `<strong>Key focus areas</strong><br>• ${focusAreas.join(
        "<br>• "
      )}<br><br>`;
    }

    if (routineTips.length) {
      html += `<strong>Suggestions</strong><br>• ${routineTips.join("<br>• ")}<br>`;
    }

    analysisSummary.innerHTML = html;
    analysisResult.classList.remove("hidden");

    /* Recommendations */
    const concernText = activeConcerns.length
      ? activeConcerns.join(", ")
      : "general balance";

    recoIntro.innerHTML = `
      Based on your skin type <strong>${skinType || "Unknown"}</strong>
      and concerns <strong>${concernText}</strong>,
      here are DERMAI's recommended routines:
    `;

    renderProductLists();
    recoBlock.classList.remove("hidden");
  });
}

/* =======================
   3. Custom Product Builder
======================= */

const builderForm = document.getElementById("builderForm");
const builderResult = document.getElementById("builderResult");
const builderSummary = document.getElementById("builderSummary");

if (builderForm && builderResult && builderSummary) {
  builderForm.addEventListener("submit", (e) => {
    e.preventDefault();

    const baseType = document.getElementById("baseType").value;
    const texture = document.getElementById("texture").value;

    // Preset include / exclude checkboxes
    const includeChecks = builderForm.querySelectorAll(
      '.chip-group[data-group="include"] input[type="checkbox"]:checked'
    );
    const excludeChecks = builderForm.querySelectorAll(
      '.chip-group[data-group="exclude"] input[type="checkbox"]:checked'
    );

    const include = Array.from(includeChecks).map((c) => c.value);
    const exclude = Array.from(excludeChecks).map((c) => c.value);

    // User custom ingredients
    const customIncludeRaw =
      document.getElementById("customInclude")?.value || "";
    const customInclude = customIncludeRaw
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);

    // User custom allergies / avoid list
    const customAllergyRaw =
      document.getElementById("customAllergy")?.value || "";
    const customAllergies = customAllergyRaw
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);

    // Merge lists
    const allInclude = [...include, ...customInclude];
    const allExclude = [...exclude, ...customAllergies];

    // Build summary HTML
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
    builderResult.classList.remove("hidden");
  });
}

/* =======================
   4. Chatbot
======================= */

const chatForm = document.getElementById("chatForm");
const chatInput = document.getElementById("chatInput");
const chatMessages = document.getElementById("chatMessages");

if (chatForm && chatInput && chatMessages) {
  chatForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const text = chatInput.value.trim();
    if (!text) return;

    const userMsg = document.createElement("div");
    userMsg.className = "chat-message user";
    userMsg.innerHTML = `<p>${text}</p>`;
    chatMessages.appendChild(userMsg);

    chatInput.value = "";

    const botMsg = document.createElement("div");
    botMsg.className = "chat-message bot";
    botMsg.innerHTML =
      "<p>Thanks! In the real version, Derma-AI would analyse your concern and adjust your routine in detail.</p>";
    chatMessages.appendChild(botMsg);

    chatMessages.scrollTop = chatMessages.scrollHeight;
  });
}

/* =======================
   5. Dermatologist appointment
======================= */

const dermForm = document.getElementById("dermForm");
const dermMessage = document.getElementById("dermMessage");

if (dermForm && dermMessage) {
  dermForm.addEventListener("submit", (e) => {
    e.preventDefault();
    dermMessage.textContent =
      "Your appointment request has been recorded (demo). In a real app, this would be sent to our dermatologist system.";
    dermMessage.classList.add("success");
  });
}

/* =======================
   6. Routine tracker
======================= */

const trackerButtons = document.querySelectorAll(".tracker-toggle");
const trackerStatus = document.getElementById("trackerStatus");

if (trackerButtons && trackerStatus) {
  const completed = new Set();

  trackerButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      const step = btn.dataset.step;

      if (completed.has(step)) {
        completed.delete(step);
        btn.textContent = "Mark done";
      } else {
        completed.add(step);
        btn.textContent = "Done ✓";
      }

      trackerStatus.textContent = `Completed ${completed.size} / ${trackerButtons.length} steps today.`;
      trackerStatus.classList.add("success");
    });
  });
}

/* =======================
   7. Ingredient Checker
======================= */

const ingredientForm = document.getElementById("ingredientForm");
const ingredientResult = document.getElementById("ingredientResult");
const ingredientSummary = document.getElementById("ingredientSummary");

if (ingredientForm && ingredientResult && ingredientSummary) {
  ingredientForm.addEventListener("submit", (e) => {
    e.preventDefault();

    const text = document
      .getElementById("ingredientList")
      .value.toLowerCase()
      .trim();

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

    ingredientResult.classList.remove("hidden");
  });
}
