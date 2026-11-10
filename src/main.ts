import { getBanner } from "./api";
import { convertToUMM, convertToUMMReversed } from "./convert";
import type { UMMissionSet } from "./types/umm";

function getBannerId(): string | null {
  const segments = window.location.pathname.split("/").filter(Boolean);
  const bannerId = segments.at(-1);

  return bannerId ? decodeURIComponent(bannerId) : null;
}

function getErrorMessage(error: unknown): string {
  return error instanceof Error ? error.message : String(error);
}

function downloadJson(ummJson: UMMissionSet, fileName: string) {
  const ummString = JSON.stringify(ummJson, null, 2);
  const blob = new Blob([ummString], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = fileName;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

async function downloadBanner(reversed: boolean) {
  const bannerId = getBannerId();
  if (!bannerId) {
    alert("Could not extract banner ID from URL.");
    return;
  }

  try {
    const banner = await getBanner(bannerId);
    const ummJson = reversed ? convertToUMMReversed(banner) : convertToUMM(banner);
    const baseName = banner.title.replace(/[^a-z0-9]/gi, "_").toLowerCase();
    const fileName = `${baseName}${reversed ? "_reversed" : ""}.json`;

    downloadJson(ummJson, fileName);
  } catch (error) {
    alert(`Error fetching banner data: ${getErrorMessage(error)}`);
  }
}

function createDownloadButton(
  text: string,
  reversed: boolean,
): HTMLButtonElement {
  const button = document.createElement("button");
  button.id = reversed ? "umm-download-button-reversed" : "umm-download-button";
  button.textContent = text;
  button.className = "banner-info-button"; // Use bannergress's button style
  button.style.marginTop = "1em";
  button.addEventListener("click", () => {
    void downloadBanner(reversed);
  });

  return button;
}

function addDownloadButtons() {
  if (document.getElementById("umm-download-button")) {
    return; // Buttons already exist
  }

  const buttonContainer = document.querySelector(".banner-info-card");
  if (!buttonContainer) {
    return;
  }

  buttonContainer.append(
    createDownloadButton("Download UMM JSON", false),
    createDownloadButton("Download UMM JSON (Reversed)", true),
  );
}

// Observe DOM changes to detect navigation in the SPA
const observer = new MutationObserver(() => {
  if (window.location.pathname.startsWith("/banner/")) {
    const bannerCard = document.querySelector(".banner-info-card");
    if (bannerCard) {
      addDownloadButtons();
    }
  }
});

// Start observing the body for child list and subtree changes
observer.observe(document.body, {
  childList: true,
  subtree: true,
});
