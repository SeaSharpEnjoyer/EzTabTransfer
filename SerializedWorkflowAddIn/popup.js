document.getElementById('serialize').addEventListener('click', async () => {
  const tabs = await browser.tabs.query({});
  const urls = tabs.map(tab => tab.url);
  if (urls.length === 0) {
    alert('No open tabs to serialize.');
    return;
  }
  const concatenatedUrls = urls.join('||');
  const urlStringField = document.getElementById('urlString');
  urlStringField.value = concatenatedUrls;
});

document.getElementById('deserialize').addEventListener('click', async () => {
  const inputField = document.getElementById('urlString');
  const concatenatedUrls = inputField.value;
  if (!concatenatedUrls) {
    alert('Please paste a URL string to deserialize.');
    return;
  }
  var failedURLs = [];
  try {
    const urls = concatenatedUrls.split('||');
    if (urls.length === 0) {
      alert('No URLs found in the string.');
      return;
    }    
    for (const url of urls) {
      try {
        await browser.tabs.create({ url });
      } catch (error) {
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
