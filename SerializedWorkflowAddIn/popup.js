// Handle the "Serialize" button: Collect URLs from open tabs and concatenate them.
document.getElementById('serialize').addEventListener('click', async () => {
  // Get all open tabs
  const tabs = await browser.tabs.query({});
  
  // Collect the URLs of all the tabs
  const urls = tabs.map(tab => tab.url);

  // If no URLs are found, alert the user
  if (urls.length === 0) {
    alert('No open tabs to serialize.');
    return;
  }

  // Join the URLs with a unique delimiter (e.g., "||")
  const concatenatedUrls = urls.join('||');
  
  // Display the concatenated URLs in the textarea
  const urlStringField = document.getElementById('urlString');
  urlStringField.value = concatenatedUrls;

});

// Handle the "Deserialize" button: Open tabs based on a pasted URL string.
document.getElementById('deserialize').addEventListener('click', async () => {
  // Get the user-pasted concatenated URL string
  const inputField = document.getElementById('deserializeInput');
  const concatenatedUrls = inputField.value;

  // If the input is empty, alert the user
  if (!concatenatedUrls) {
    alert('Please paste a URL string to deserialize.');
    return;
  }
  var failedURLs = [];
  try {
    // Split the concatenated string by the delimiter (e.g., "||")
    const urls = concatenatedUrls.split('||');

    // If no URLs are found, alert the user
    if (urls.length === 0) {
      alert('No URLs found in the string.');
      return;
    }

    // Open each URL in a new tab, with individual error handling
    
    for (const url of urls) {
      try {
        // Try to create a new tab for each URL
        await browser.tabs.create({ url });
      } catch (error) {
        // If opening the URL fails, log the error and continue with the next URL
        console.error(`Error opening URL: ${url}`, error);
        failedURLs.push(url)
      }      
    }
  } catch (error) {
    console.error('Error deserializing URLs:', error);
    alert('An unknown error occurred while deserializing URLs.');
  }
  if (failedURLs.length > 0)
    {
      alert(`Failed to open URL(s): ${failedURLs.join("\n")}`);
    }
});
