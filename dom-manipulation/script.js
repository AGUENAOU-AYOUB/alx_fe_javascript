const quotesArray = [
    {
        text: "The best way to get started is to quit talking and begin doing.",
        category: 'inspiration'
    },
    {
        text: "Success is not final, failure is not fatal: It is the courage to continue that counts",
        category: 'inspiration'
    },
    {
        text: "Your time is limited, so don't waste it living someone else's life.",
        category: 'inspiration'
    },
    {
        text: "Knowing yourself is the beginning of all wisdom." ,
        category: 'wisdom'
    },
    {
        text: "Do not dwell in the past, do not dream of the future, concentrate the mind on the present moment.",
        category: 'wisdom'
    },
    {
        text: "He who has a why to live can bear almost any how.",
        category: 'wisdom'
    },
    {
        text: "I am so clever that sometimes I don't understand a single word of what I am saying.",
        category: 'funny'
    },
    {
        text: "I always wanted to be somebody, but now I realize I should have been more specific.",
        category: 'funny'
    },
    {
        text: "If you think nobody cares if you're alive, try missing a couple of payments.",
        category: 'funny'
    },
]

    const quoteOutput = document.getElementById('quoteDisplay');
    const showBtn = document.getElementById('newQuote');

    function showRandomQuote() {
        const randomIndex = Math.floor(Math.random() * quotesArray.length);
        quoteOutput.innerHTML = quotesArray[randomIndex].text;
        localStorage.setItem('ayoub', randomIndex);
        return quoteOutput;

    }

    showBtn.addEventListener('click', showRandomQuote)
    
function addQuote() {
    const newQuoteText = document.getElementById('newQuoteText').value.trim();
    const newQuoteCategory = document.getElementById('newQuoteCategory').value.trim();

    if (newQuoteText && newQuoteCategory) {
        quotesArray.push({
            text: newQuoteText,
            category: newQuoteCategory
        });
        alert('quote added');
    } else {
        alert('please fill the fields');
    }
}