
// Globala variabler
let deck = [];
let currentCard = null; 
let score = 0;
let lives = 3;

// skapar en kortlek med 52 kort
function buildDeck() {
  let suits = ["♥", "♦", "♣", "♠"];
  let deck = [];
  for (const suit of suits) {
    for (let rank = 2; rank <=14; rank++) {
        deck.push({ rank, suit });
    }
  }
  return deck;
}
function rankLabel(rank) {
  if (rank === 11) return "J";
  if (rank === 12) return "Q";
  if (rank === 13) return "K";
  if (rank === 14) return "A";
  return String(rank);
}

function renderCardHTML(card) {
  const label = rankLabel(card.rank);
  const suit = card.suit;
  return `
    <span class="rank tl">${label}${suit}</span>
    <span class="pip">${suit}</span>
    <span class="rank br">${label}${suit}</span>
  `;
}


// Blandar kortleken
function shuffleDeck(deck) {
    for (let i = deck.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [deck[i], deck[j]] = [deck[j], deck[i]];
    }
}

// Drar ett kort från toppen av leken
function drawCard() {
  if (deck.length === 0) return null;
  return deck.pop();
}

// Jämför två korts rank
function compareRanks(a, b) {
  if (a.rank < b.rank) return "higher";
  if (a.rank > b.rank) return "lower";
  return "equal";
}

// Spel-loopen börjar

// Starta spelet
function startGame() {
  deck = buildDeck();
  shuffleDeck(deck);
  score = 0;
  lives = 3;
  currentCard = drawCard();
  updateUI();
}

// Hanterar gissning från knapptryck
function handleGuess(choice) {
  if (deck.length === 0) {
    endGame("Korten är slut!")
    return;
  }
//drar nästa kort
  const nextCard = drawCard();
  const result = compareRanks(currentCard, nextCard);

//kollar gisningen
  if (choice === result) {
    score++;
    updateUI("Rätt!");
  }
  else {
    lives--;
    updateUI("Fel!");
  }

//Flyttar fram nästa kort i kön
  currentCard = nextCard;

  if (lives <= 0) {
    endGame("Slut på försök!");
    }
  else if (deck.length === 0) {
    endGame("Kortleken är slut!");
  }
}

// UI 

// Uppdatera allt på skärmen (stats, poäng, försök kvar etc)
function updateUI(message = "") {
    
  // uppdaterar din score
  document.getElementById("score").textContent = score;
  // håller koll på dina lives kvar
  document.getElementById("lives").textContent = lives;
  // håller koll på remaining kort
  document.getElementById("remaining").textContent = deck.length;

  // current card / nuvarande kort
  const cardDiv = document.getElementById("card");
cardDiv.classList.remove("red", "black");

// Bestämmer om kortet ska vara rött eller svart
if (currentCard) {
  const isRed = currentCard.suit === "♥" || currentCard.suit === "♦";
  cardDiv.classList.add(isRed ? "red" : "black");

  cardDiv.innerHTML = renderCardHTML(currentCard);
} 
else {
  cardDiv.textContent = "";
}
  document.getElementById("message").textContent = message;
}

// Avsluta spelet
function endGame(reason) {
  updateUI(reason + " - Slutpoäng: " + score);
  // disable choice knapparna
  document.querySelectorAll(".controls button").forEach(btn => btn.disabled = true);
  // visar restart-knappen
  document.getElementById("btn-restart").hidden = false;
}

// Knappar för gissningar (registrerar knapptryck till handleGuess)
document.querySelectorAll(".controls button").forEach(btn => {
  btn.addEventListener("click", () => {
    handleGuess(btn.dataset.choice);
  });
});

// Restart-knapp
document.getElementById("btn-restart").addEventListener("click", () => {
  // återställ knapparna
  document.getElementById("btn-restart").hidden = true;
  document.querySelectorAll(".controls button").forEach(btn => btn.disabled = false);
  startGame();
});

//  Init spelet
startGame();
