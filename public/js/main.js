// Fichier JavaScript principal pour le quiz

// Vérification du nom du joueur
document.addEventListener('DOMContentLoaded', function() {
  const playerNameInput = document.getElementById('playerName');

  if (playerNameInput) {
    // Focus automatique
    playerNameInput.focus();

    // Validation du nom
    const form = playerNameInput.closest('form');
    if (form) {
      form.addEventListener('submit', function(e) {
        const name = playerNameInput.value.trim();
        if (name.length < 2) {
          e.preventDefault();
          alert('Votre pseudo doit contenir au moins 2 caractères');
          return false;
        }
      });
    }
  }
});

// Animations pour les résultats
if (document.querySelector('.percentage-circle')) {
  setTimeout(() => {
    const circle = document.querySelector('.circle-progress');
    if (circle) {
      const currentOffset = parseFloat(circle.style.strokeDashoffset);
      circle.style.strokeDashoffset = currentOffset;
    }
  }, 100);
}
