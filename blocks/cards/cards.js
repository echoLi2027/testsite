
import { createOptimizedPicture } from '../../scripts/aem.js';

export default function decorate(block) {
  // change to ul, li 
  const ul = document.createElement('ul');
  console.log("block --->", block);
  [...block.children].forEach((row) => {
    const li = document.createElement('li');
    while (row.firstElementChild) li.append(row.firstElementChild);
    [...li.children].forEach((div) => {
      if (div.children.length === 1 && div.querySelector('picture')) div.className = 'cards-card-image';
      else div.className = 'cards-card-body';
    });
    ul.append(li);
  });
  ul.querySelectorAll('picture > img').forEach((img) => img.closest('picture').replaceWith(createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }])));
  block.textContent = '';
  block.append(ul);
}

/* 
import { createOptimizedPicture } from '../../scripts/aem.js';

export default function decorate(block) {
    // change to ul, li 
    const ul = document.createElement('ul');
    [...block.children].forEach((row) => {
        const li = document.createElement('li');
        while (row.firstElementChild) li.append(row.firstElementChild);
        [...li.children].forEach((div) => {
            if (div.children.length === 1 && div.querySelector('picture')) div.className = 'cards-card-image';
            else div.className = 'cards-card-body';
        });
        ul.append(li);
    });
    ul.querySelectorAll('picture > img').forEach((img) => img.closest('picture').replaceWith(createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }])));
    block.textContent = '';
    block.append(ul);

    // Fetch dynamic card data
    async function fetchCards() {
        try {
            const response = await fetch("https://jsonplaceholder.typicode.com/posts?_limit=6");
            const data = await response.json();
            renderCards(data);
        } catch (error) {
            console.error("fail to load card information", error);
        }
    }

    // Render cards dynamically
    function renderCards(cards) {
        ul.innerHTML = "";
        cards.forEach(card => {
            const li = document.createElement("li");
            li.classList.add("card");
            li.innerHTML = `
                <div class="card-inner">
                    <div class="card-front">
                        <h3>${card.title}</h3>
                        <p>${card.body.substring(0, 50)}...</p>
                    </div>
                    <div class="card-back">
                        <p>detail: ${card.body}</p>
                    </div>
                </div>
            `;
            ul.appendChild(li);
        });
    }

    // Load data and render
    fetchCards();
}

// Reverse cards on hover
document.addEventListener("mouseover", (e) => {
    if (e.target.closest(".card")) {
        e.target.closest(".card").classList.add("flipped");
    }
});

document.addEventListener("mouseout", (e) => {
    if (e.target.closest(".card")) {
        e.target.closest(".card").classList.remove("flipped");
    }
}); */