const SERVER_URL = "https://jsonplaceholder.typicode.com/posts";

let quotesArray = JSON.parse(localStorage.getItem("quotesArray")) || [];

const quoteOutput = document.getElementById("quoteDisplay");
const showBtn = document.getElementById("newQuote");
const categoryFilter = document.getElementById("categoryFilter");
const selfQuote = document.querySelector(".selfQuote");
const create = document.querySelector(".create");
const download = document.querySelector(".download");

// Show a random quote
function showRandomQuote() {
    const selectedCategory = categoryFilter.value.toLowerCase();
    const displayQuotes = selectedCategory === "all"
        ? quotesArray
        : quotesArray.filter(q => q.category.toLowerCase() === selectedCategory);

    quoteOutput.innerHTML = "";

    if (displayQuotes.length === 0) {
        quoteOutput.textContent = "No quotes in this category.";
        return;
    }

    const randomQuote = displayQuotes[Math.floor(Math.random() * displayQuotes.length)];
    const p = document.createElement("p");
    p.textContent = randomQuote.text;
    quoteOutput.appendChild(p);
}

// Add a new quote
function addQuote() {
    const text = document.getElementById("newQuoteText").value.trim();
    const category = document.getElementById("newQuoteCategory").value.trim().toLowerCase();

    if (text && category) {
        const newQuote = { text, category };
        quotesArray.push(newQuote);
        saveQuotes();
        populateCategories();
        filterQuotes();
        postQuoteToServer(newQuote);
        alert("Quote added!");
    } else {
        alert("Please fill in both fields.");
    }
}

// Show/hide form
function createAddQuoteForm() {
    selfQuote.style.display = selfQuote.style.display === "flex" ? "none" : "flex";
}

// Download quotes
function downloadQuote() {
    const data = JSON.stringify(quotesArray);
    const blob = new Blob([data], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "quotes.json";
    a.click();
    URL.revokeObjectURL(url);
}

// Import quotes
function importFromJsonFile(event) {
    const reader = new FileReader();
    reader.onload = function (e) {
        const imported = JSON.parse(e.target.result);
        imported.forEach(q => {
            q.category = q.category.toLowerCase();
            quotesArray.push(q);
        });
        saveQuotes();
        populateCategories();
        filterQuotes();
        alert("Quotes imported successfully!");
    };
    reader.readAsText(event.target.files[0]);
}

// Save to localStorage
function saveQuotes() {
    localStorage.setItem("quotesArray", JSON.stringify(quotesArray));
}

// Populate dropdown
function populateCategories() {
    const previousValue = categoryFilter.value;
    const categories = [...new Set(quotesArray.map(q => q.category.toLowerCase()))];
    categoryFilter.innerHTML = '<option value="all">All Categories</option>';
    categories.forEach(cat => {
        const option = document.createElement("option");
        option.value = cat;
        option.textContent = cat;
        categoryFilter.appendChild(option);
    });
    if (previousValue) {
        categoryFilter.value = previousValue.toLowerCase();
    }
}

// Filter quotes on dropdown change
function filterQuotes() {
    const selectedCategory = categoryFilter.value.toLowerCase();
    localStorage.setItem("selectedCategory", selectedCategory);
    quoteOutput.innerHTML = "";
    const quotesToShow = selectedCategory === "all"
        ? quotesArray
        : quotesArray.filter(q => q.category.toLowerCase() === selectedCategory);

    if (quotesToShow.length === 0) {
        quoteOutput.textContent = "No quotes in this category.";
        return;
    }

    const random = quotesToShow[Math.floor(Math.random() * quotesToShow.length)];
    const p = document.createElement("p");
    p.textContent = random.text;
    quoteOutput.appendChild(p);
}

// Restore previous filter
function restoreLastFilter() {
    const last = localStorage.getItem("selectedCategory") || "all";
    categoryFilter.value = last.toLowerCase();
    filterQuotes();
}

// Notification
function showNotification(message) {
    const note = document.getElementById("notification");
    note.textContent = message;
    note.style.display = "block";
    setTimeout(() => {
        note.style.display = "none";
    }, 3000);
}

// Fetch from mock API
async function fetchQuotesFromServer() {
    try {
        const res = await fetch(SERVER_URL);
        const data = await res.json();
        return data.slice(0, 10).map(post => ({
            text: post.title,
            category: "server"
        }));
    } catch (err) {
        console.error("Error fetching from server:", err);
        return [];
    }
}

// Post to mock API
async function postQuoteToServer(quote) {
    try {
        const res = await fetch(SERVER_URL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(quote)
        });
        const result = await res.json();
        console.log("Posted to server:", result);
    } catch (err) {
        console.error("Post failed:", err);
    }
}

async function syncQuotes() {
    const serverQuotes = await fetchQuotesFromServer();
    const localData = JSON.stringify(quotesArray);
    const serverData = JSON.stringify(serverQuotes);

    if (localData !== serverData) {
        localStorage.setItem("quotesArray", serverData);
        quotesArray = serverQuotes;
        populateCategories();
        restoreLastFilter();
        showNotification("Quotes synced with server!");
    }
}


// Periodic sync
setInterval(syncQuotes, 30000);

// Event listeners
showBtn.addEventListener("click", showRandomQuote);
create.addEventListener("click", createAddQuoteForm);
download.addEventListener("click", downloadQuote);
categoryFilter.addEventListener("change", filterQuotes);

// Initial load
if (quotesArray.length > 0) {
    populateCategories();
    restoreLastFilter();
}
