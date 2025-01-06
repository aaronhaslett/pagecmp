import { visualDomDiff } from "visual-dom-diff"

function freezeUserInput(freeze: boolean) {
    let freezeMessage = document.getElementById('freeze-message');
    if (!freezeMessage) {
        freezeMessage = document.createElement('div');
        freezeMessage.id = 'freeze-message';
        freezeMessage.textContent = 'Please wait for 3 seconds...';
        document.body.appendChild(freezeMessage);
    }

    if (freeze) {
        document.body.classList.add('freeze');
        freezeMessage.style.display = 'block';
    } else {
        document.body.classList.remove('freeze');
        freezeMessage.style.display = 'none';
    }
}

async function comparePages() {
    const metaTag = document.querySelector("meta[name='variation-url']");
    if (!metaTag) {
        console.error("No variation URL provided.");
        return;
    }
    const variationUrl = metaTag.getAttribute("content");
    if (!variationUrl) {
        console.error("No content attr in the variation-url meta tag");
        return;
    }

    // Freeze user input and display the message
    freezeUserInput(true);

    const response = await fetch(variationUrl, { credentials: 'include' });
    const variationHtml = await response.text();

    // Create an offscreen iframe
    const iframe = document.createElement('iframe');
    iframe.className = 'offscreen-iframe';
    document.body.appendChild(iframe);

    // Write the variation HTML into the iframe
    if (!iframe.contentDocument) {
        console.error("iframe.contentDocument is null.");
        return;
    }
    const contentDocument = iframe.contentDocument as Document;
    contentDocument.open();
    contentDocument.write(variationHtml);
    contentDocument.close();

    // Wait for the iframe's content to be fully loaded and for its scripts to run
    await new Promise<void>((resolve) => {
        iframe.onload = () => setTimeout(resolve, 7000); // Wait for 3 seconds after load
    });

    // Unfreeze user input and hide the message
    freezeUserInput(false);

    // Start comparison after the iframe has loaded
    const siteContainer1 = document.querySelector(".site-container");
    const siteContainer2 = contentDocument.querySelector(".site-container");

    if (!siteContainer1 || !siteContainer2) {
        console.error("One of the pages is missing the site-container div.");
        return;
    }

    const diff = visualDomDiff(siteContainer2, siteContainer1, {skipModified: true});
    iframe.remove()
    siteContainer1.parentNode.replaceChild(diff, siteContainer1);
}

window.addEventListener("load", comparePages, false);
