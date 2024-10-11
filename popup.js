document.getElementById("analyzeBtn").addEventListener("click", () => {
  const statusMessage = document.getElementById("statusMessage");
  const tosContent = document.getElementById("tosContent");

  // Clear previous content
  tosContent.style.display = "none";
  tosContent.innerText = "";
  statusMessage.innerText = "Analyzing the page...";

  // Send a message to the content script to analyze the page
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    chrome.tabs.sendMessage(tabs[0].id, { action: "analyze" }, (response) => {
      if (response && response.success) {
        statusMessage.innerText = "Terms of Service retrieved!";
        statusMessage.classList.add("success");

        // Display the retrieved Terms of Service in the popup
        tosContent.innerText = response.termsOfService || "No Terms of Service found.";
        tosContent.style.display = "block";  // Make the content visible
      } else {
        statusMessage.innerText = "Failed to retrieve Terms of Service.";
        statusMessage.classList.add("error");
      }
    });
  });
});
