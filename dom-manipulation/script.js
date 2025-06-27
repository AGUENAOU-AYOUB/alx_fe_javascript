const quotesArray = JSON.parse(localStorage.getItem('quotesArray')) || [];

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