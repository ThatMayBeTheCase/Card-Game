// ===============================
// Högre / Lägre / Lika
// app.js
// ===============================

// ===== Globala variabler =====
let deck = [];        // själva kortleken
let currentCard = null; 
let score = 0;
let lives = 3;

// ======== Hjälpfunktioner ========

// Bygg en kortlek med 52 kort (2–14, 11=J, 12=Q, 13=K, 14=A)
function buildDeck() {
  let suits = ["♥", "♦", "♣", "♠"];
  let deck = [];
  for (const suit of suits) {
    for (let rank = 2; rank <=14; rank++) {
        deck.push({ rank, suit }); // 11=J, 12=Q, 13=K, 14=A
    }
  }
  return deck;
}
function rankLabel(rank) {
  if (rank === 11) return "J";
  if (rank === 12) return "Q";
  if (rank === 13) return "K";
  if (rank === 14) return "A";
  return String(rank); // 2–10 visas som sina siffror
}

// Blanda kortleken (Fisher–Yates shuffle)
function shuffleDeck(deck) {
    for (let i = deck.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [deck[i], deck[j]] = [deck[j], deck[i]];
    }
  return deck;
}

// Dra ett kort från toppen av leken
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

// ======== Spel-loop ========

// Starta spelet
function startGame() {
  deck = buildDeck();
  deck = shuffleDeck(deck);
  score = 0;
  lives = 3;
  currentCard = drawCard();
  updateUI();
}

// Hantera gissning från knapp (lower/equal/higher)
function handleGuess(choice) {
  if (deck.length === 0) {
    endGame("Korten är slut!")
    return;
  }
//dra nästa kort
  const nextCard = drawCard();
  const result = compareRanks(currentCard, nextCard);

//kolla gisningen
  if (choice === result) {
    score++;
    updateUI("Rätt Gissat!");
  }
  else {
    lives--;
    updateUI("Fel Gissat!");
  }

//Flytta fram nästa kort i kön
  currentCard = nextCard;

  if (lives <= 0) {
    endGame("Slut på försök!");
    }
  else if (deck.length === 0) {
    endGame("Kortleken är slut!");
  }
}

// ======== UI ========

// Uppdatera allt på skärmen
function updateUI(message = "") {
    
  // score
  document.getElementById("score").textContent = score;
  // lives
  document.getElementById("lives").textContent = lives;
  // remaining
  document.getElementById("remaining").textContent = deck.length;
  // current card
  const cardDiv = document.getElementById("card");
  if (currentCard) {
    cardDiv.textContent = `${rankLabel(currentCard.rank)}${currentCard.suit}`;
    const isRed = currentCard.suit === "♥" || currentCard.suit === "♦";
    cardDiv.classList.add(isRed ? "red" : "black");

    // TODO: byt färg beroende på suit (♥ ♦ röd, ♣ ♠ svart)
  } else {
    cardDiv.textContent = "";
  }
  // message
  document.getElementById("message").textContent = message;
}

// Avsluta spelet
function endGame(reason) {
  updateUI(reason + " – Slutpoäng: " + score);
  // göm knapparna
  document.querySelectorAll(".controls button").forEach(btn => btn.disabled = true);
  // visa restart-knappen
  document.getElementById("btn-restart").hidden = false;

  startGame();
}

// ======== Event Listeners ========

// Knappar för gissningar
document.querySelectorAll(".controls button").forEach(btn => {
  btn.addEventListener("click", () => {
    handleGuess(btn.dataset.choice);
  });
});

// Restart-knapp
document.getElementById("btn-restart").addEventListener("click", () => {
  // återställ
  document.getElementById("btn-restart").hidden = true;
  document.querySelectorAll(".controls button").forEach(btn => btn.disabled = false);
  startGame();
});

// ======== Init ========
startGame();
