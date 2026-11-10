import { BannergressBanner } from "./types/bannergress";
import { GM_xmlhttpRequest } from "$";
import { convertToUMM, convertToUMMReversed } from "./convert";

function addDownloadButtons() {
  if (document.getElementById("umm-download-button")) {
    return; // Buttons already exist
  }

  const buttonContainer = document.querySelector(".banner-info-card");
  if (buttonContainer) {
    const downloadButton = document.createElement("button");
    downloadButton.id = "umm-download-button";
    downloadButton.textContent = "Download UMM JSON";
    downloadButton.className = "banner-info-button"; // Use bannergress's button style
    downloadButton.style.marginTop = "1em";

    downloadButton.addEventListener("click", () => {
      const bannerId = window.location.pathname.split("/").pop();
      if (!bannerId) {
        alert("Could not extract banner ID from URL.");
        return;
      }

      GM_xmlhttpRequest({
        method: "GET",
        url: `https://api.bannergress.com/bnrs/${bannerId}`,
        responseType: "json",
        onload: (response) => {
          if (response.status === 200) {
            const bannerData = response.response as BannergressBanner;
            const ummJson = convertToUMM(bannerData);
            const ummString = JSON.stringify(ummJson, null, 2);
            const blob = new Blob([ummString], { type: "application/json" });
            const url = URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url;
            a.download = `${bannerData.title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.json`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
          } else {
            alert(`Error fetching banner data: ${response.statusText}`);
          }
        },
        onerror: (error) => {
          alert(`An error occurred: ${error.error}`);
        },
      });
    });

    buttonContainer.appendChild(downloadButton);

    const downloadButtonReversed = document.createElement("button");
    downloadButtonReversed.id = "umm-download-button-reversed";
    downloadButtonReversed.textContent = "Download UMM JSON (Reversed)";
    downloadButtonReversed.className = "banner-info-button"; // Use bannergress's button style
    downloadButtonReversed.style.marginTop = "1em";

    downloadButtonReversed.addEventListener("click", () => {
      const bannerId = window.location.pathname.split("/").pop();
      if (!bannerId) {
        alert("Could not extract banner ID from URL.");
        return;
      }

      GM_xmlhttpRequest({
        method: "GET",
        url: `https://api.bannergress.com/bnrs/${bannerId}`,
        responseType: "json",
        onload: (response) => {
          if (response.status === 200) {
            const bannerData = response.response as BannergressBanner;
            const ummJson = convertToUMMReversed(bannerData);
            const ummString = JSON.stringify(ummJson, null, 2);
            const blob = new Blob([ummString], { type: "application/json" });
            const url = URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url;
            a.download = `${bannerData.title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}_reversed.json`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
          } else {
            alert(`Error fetching banner data: ${response.statusText}`);
          }
        },
        onerror: (error) => {
          alert(`An error occurred: ${error.error}`);
        },
      });
    });

    buttonContainer.appendChild(downloadButtonReversed);
  }
}

// Observe DOM changes to detect navigation in the SPA
const observer = new MutationObserver(() => {
  if (window.location.pathname.startsWith("/banner/")) {
    const bannerCard = document.querySelector('.banner-info-card');
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