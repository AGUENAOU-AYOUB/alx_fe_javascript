/*const quotesArray = JSON.parse(localStorage.getItem('quotesArray')) || [];

    const quoteOutput = document.getElementById('quoteDisplay');
    const showBtn = document.getElementById('newQuote');

function showRandomQuote() {
    const selectedQuote = quotesArray[Math.floor(Math.random() * quotesArray.length)];


    quoteOutput.innerHTML = "";

    const quoteParagraph = document.createElement("p");
    quoteParagraph.textContent = selectedQuote.text;
    quoteOutput.appendChild(quoteParagraph);
}


    showBtn.addEventListener('click', showRandomQuote)
    
function addQuote() {
    const newQuoteText = document.getElementById('newQuoteText').value.trim();
    const newQuoteCategory = document.getElementById('newQuoteCategory').value.trim();

    if (newQuoteText && newQuoteCategory) {
        const newQuote = {
            text: newQuoteText,
            category: newQuoteCategory
        };
        quotesArray.push(newQuote);

        quoteOutput.innerHTML = "";
        const newQuoteElement = document.createElement("p");
        newQuoteElement.textContent = newQuote.text;
        quoteOutput.appendChild(newQuoteElement);
        localStorage.setItem("quotesArray", JSON.stringify(quotesArray));
        alert("Quote added!");
    } else {
        alert("Please fill the fields");
    }

    
}



//show add quote form
const selfQuote = document.querySelector('.selfQuote');
const create = document.querySelector('.create');

function createAddQuoteForm() {
    if (getComputedStyle(selfQuote).display == 'none') {
        selfQuote.style.display = 'flex';
    } else {
        selfQuote.style.display = 'none';
    }
}
create.addEventListener('click', createAddQuoteForm);

const download = document.querySelector('.download');

function downloadQuote() {
   
    const data = JSON.stringify(quotesArray);
    const blob = new Blob([data], { type: "application/json" })
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "quotes.json";
    a.click();

    URL.revokeObjectURL(url);
}

download.addEventListener('click', downloadQuote);

function importFromJsonFile(event) {
    const fileReader = new FileReader();
    fileReader.onload = function (event) {
        const importedQuotes = JSON.parse(event.target.result);
        quotesArray.push(...importedQuotes);
        saveQuotes();
        alert('Quotes imported successfully!');
    };
    fileReader.readAsText(event.target.files[0]);
}
function saveQuotes() {
    localStorage.setItem("quotesArray", JSON.stringify(quotesArray));
}
//populate the filter
const categoryFilter = document.getElementById('categoryFilter');


function populateCategories() {
    let categorySet = new Set();

    quotesArray.forEach(quote => {
        categorySet.add(quote.category);      
    });

    categorySet.forEach(category => {
        const categoryOption = document.createElement('option');
        categoryOption.value = category;
        categoryOption.textContent = category;
        categoryFilter.appendChild(categoryOption);
    });
}
populateCategories();

function filterQuotes() {
    const selectedCategory = categoryFilter.value;  
    let displayQuote = '';
    if (selectedCategory === 'all') {
        displayQuote = quotesArray;
    } else {
        displayQuote = quotesArray.filter(cat => cat.category === selectedCategory);
    }
    if (quotesToShow.length === 0) {
        quoteOutput.textContent = "No quotes in this category.";
        return;
    }
    const random = displayQuote[Math.floor(Math.random() * displayQuote.length)];
    const p = document.createElement("p");
    p.textContent = random.text;
    quoteOutput.appendChild(p);
}*/


// Load quotes from localStorage or start with an empty list
let quotesArray = JSON.parse(localStorage.getItem('quotesArray')) || [];

// Get DOM elements
const quoteOutput = document.getElementById('quoteDisplay');
const showBtn = document.getElementById('newQuote');
const categoryFilter = document.getElementById('categoryFilter');
const selfQuote = document.querySelector('.selfQuote');
const create = document.querySelector('.create');
const download = document.querySelector('.download');

// Show a random quote from the filtered array (FIXED)
function showRandomQuote() {
    const selectedCategory = categoryFilter.value.toLowerCase();
    let displayQuotes = [];

    if (selectedCategory === 'all') {
        displayQuotes = quotesArray;
    } else {
        displayQuotes = quotesArray.filter(quote => quote.category.toLowerCase() === selectedCategory);
    }

    if (displayQuotes.length === 0) {
        quoteOutput.textContent = "No quotes available in this category.";
        return;
    }

    const randomIndex = Math.floor(Math.random() * displayQuotes.length);
    const selectedQuote = displayQuotes[randomIndex];

    quoteOutput.innerHTML = "";
    const quoteParagraph = document.createElement("p");
    quoteParagraph.textContent = selectedQuote.text;
    quoteOutput.appendChild(quoteParagraph);
}

// Add a new quote
function addQuote() {
    const newQuoteText = document.getElementById('newQuoteText').value.trim();
    const newQuoteCategory = document.getElementById('newQuoteCategory').value.trim().toLowerCase();

    if (newQuoteText !== "" && newQuoteCategory !== "") {
        const newQuote = {
            text: newQuoteText,
            category: newQuoteCategory
        };

        quotesArray.push(newQuote);
        localStorage.setItem("quotesArray", JSON.stringify(quotesArray));

        document.getElementById('newQuoteText').value = "";
        document.getElementById('newQuoteCategory').value = "";

        populateCategories();
        filterQuotes();

        alert("Quote added!");
    } else {
        alert("Please fill in both fields.");
    }
}

// Show or hide the form
function createAddQuoteForm() {
    if (selfQuote.style.display === "none" || selfQuote.style.display === "") {
        selfQuote.style.display = "flex";
    } else {
        selfQuote.style.display = "none";
    }
}

// Download quotes to a JSON file
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

// Import quotes from a JSON file
function importFromJsonFile(event) {
    const fileReader = new FileReader();

    fileReader.onload = function (e) {
        const importedQuotes = JSON.parse(e.target.result);

        for (let i = 0; i < importedQuotes.length; i++) {
            importedQuotes[i].category = importedQuotes[i].category.toLowerCase();
            quotesArray.push(importedQuotes[i]);
        }

        saveQuotes();
        populateCategories();
        filterQuotes();

        alert("Quotes imported successfully!");
    };

    fileReader.readAsText(event.target.files[0]);
}

// Save quotes to localStorage
function saveQuotes() {
    localStorage.setItem("quotesArray", JSON.stringify(quotesArray));
}

// Populate the dropdown menu with unique categories
function populateCategories() {
    const previousValue = categoryFilter.value;

    // Extract unique categories using map
    const categories = [...new Set(quotesArray.map(quote => quote.category.toLowerCase()))];

    // Clear and reset dropdown
    categoryFilter.innerHTML = '<option value="all">All Categories</option>';

    categories.forEach(category => {
        const option = document.createElement("option");
        option.value = category;
        option.textContent = category;
        categoryFilter.appendChild(option);
    });

    // Restore previous selection
    if (previousValue) {
        categoryFilter.value = previousValue.toLowerCase();
    }
}

// Filter quotes by category
function filterQuotes() {
    const selectedCategory = categoryFilter.value.toLowerCase();
    localStorage.setItem('selectedCategory', selectedCategory);

    // Filter quotes based on selected category
    let displayQuotes = [];
    if (selectedCategory === 'all') {
        displayQuotes = quotesArray;
    } else {
        displayQuotes = quotesArray.filter(quote => quote.category.toLowerCase() === selectedCategory);
    }

    quoteOutput.innerHTML = "";

    if (displayQuotes.length === 0) {
        quoteOutput.textContent = "No quotes in this category.";
        return;
    }

    const randomIndex = Math.floor(Math.random() * displayQuotes.length);
    const randomQuote = displayQuotes[randomIndex];

    const p = document.createElement("p");
    p.textContent = randomQuote.text;
    quoteOutput.appendChild(p);
}

// Restore last selected category on load
function restoreLastFilter() {
    const lastCategory = localStorage.getItem('selectedCategory') || 'all';
    categoryFilter.value = lastCategory.toLowerCase();
    filterQuotes();
}

// Event listeners
showBtn.addEventListener('click', showRandomQuote);
create.addEventListener('click', createAddQuoteForm);
download.addEventListener('click', downloadQuote);
categoryFilter.addEventListener('change', filterQuotes);

// Initialize on page load
populateCategories();
restoreLastFilter();

function syncWithServer() {
    fetch("https://jsonplaceholder.typicode.com/posts") // Simulated server
        .then(response => response.json())
        .then(serverData => {
            // Simulate server data format
            const serverQuotes = serverData.slice(0, 5).map(post => ({
                text: post.title,
                category: "server"
            }));

            const localData = JSON.stringify(quotesArray);
            const serverDataJSON = JSON.stringify(serverQuotes);

            if (localData !== serverDataJSON) {
                // Overwrite local quotes with server quotes (server wins)
                quotesArray = serverQuotes;
                saveQuotes();
                populateCategories();
                restoreLastFilter();

                alert("⚠️ Quotes synced from server. Local data was updated.");
            }
        })
        .catch(error => {
            console.error("Sync error:", error);
        });
}

// Run every 30 seconds
setInterval(syncWithServer, 30000);
