window.addEventListener('DOMContentLoaded', (event) => {  
    fetch('http://localhost:3000/quotes?_embed=likes')
    .then(response => response.json())
    .then(quotes => quotes.forEach(renderQuotes))
});

const quoteList = document.querySelector('#quote-list')
const newQuoteForm = document.querySelector('#new-quote-form')

newQuoteForm.addEventListener('submit', event => {
    const formData = {
        quote: event.target.quote.value,
        author: event.target.author.value
    }
    event.preventDefault()
    submitForm(formData)
})

document.addEventListener('click' , event => {
    if (event.target.className === 'btn-danger') {
        quoteCard = event.target.closest("li")
        deleteQuote(quoteCard)
    } else if (event.target.className === 'btn-success') {
        quoteCard = event.target.closest("li")
        likeQuote(quoteCard)
    }
})

function renderQuotes(quote) {

    fetch(`http://localhost:3000/likes?quoteId=${quote.id}`)
        .then(response => response.json())
        .then(quoteLikes => {
            const newLi = document.createElement('li')
            newLi.className = 'quote-card'
            newLi.dataset.id = quote.id
    
            const newBlockquote = document.createElement('blockquote')
            newBlockquote.className = 'blockquote'
    
            const newParagraph = document.createElement('p')
            newParagraph.className = 'mb-0'
            newParagraph.textContent = quote.quote
    
            const newFooter = document.createElement('footer')
            newFooter.className = 'blockquote-footer'
            newFooter.textContent = quote.author
    
            const newLikeButton = document.createElement('button')
            newLikeButton.className = 'btn-success'
            const newLikeSpan = document.createElement('span')
            newLikeSpan.innerText = quoteLikes.length
            newLikeButton.append('Likes: ', newLikeSpan)
    
            const newDeleteButton = document.createElement('button')
            newDeleteButton.className = 'btn-danger'
            newDeleteButton.innerText = 'Delete'
    
            const lineBreak = document.createElement('br')
    
            newBlockquote.append(newParagraph, newFooter, lineBreak, newLikeButton, newDeleteButton)
    
            newLi.append(newBlockquote)
            quoteList.append(newLi)
            console.log(newLi)
        })

            
    }

function submitForm(formData) {

fetch('http://localhost:3000/quotes', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify(formData),
})
.then(response => response.json())
.then(renderQuotes)
.catch((error) => {
  console.error('Error:', error);
});
}

function likeQuote(quoteCard) {

    const currentLikes = parseInt(quoteCard.querySelector('span').innerText)
    const quoteObj = {
        quoteId: parseInt(quoteCard.dataset.id, 10),
        createdAt: Math.floor(Date.now() / 1000)
    }

    fetch('http://localhost:3000/likes', {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
    },
    body: JSON.stringify(quoteObj),
    })
    .then(response => response.json())
    .then(likedQuoteObj => {
        quoteCard.querySelector('span').innerText = currentLikes + 1
    })
    .catch((error) => {
    console.error('Error:', error);
    });

}

function deleteQuote(quoteCard) {

    const quoteId = parseInt(quoteCard.dataset.id, 10)

    fetch(`http://localhost:3000/quotes/${quoteId}`, {
        method: 'DELETE'
        })
        .then(response => response.json())
        .then(quoteCard.remove())
        .catch((error) => {
        console.error('Error:', error);
    });
}