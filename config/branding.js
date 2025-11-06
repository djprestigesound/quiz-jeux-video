// Configuration du branding entreprise
module.exports = {
  // Nom de l'entreprise
  companyName: 'VERDON',

  // Partenaire événement
  partnerName: 'DJ Prestige Sound',

  // Slogan ou tagline
  tagline: 'Un événement VERDON & DJ Prestige Sound',

  // Chemins des logos
  logos: {
    main: '/images/branding/logo.png',
    white: '/images/branding/logo-white.png',
    small: '/images/branding/logo-small.png',
    partner: '/images/branding/dj_logo.jpg'
  },

  // Couleurs personnalisées (optionnel - surcharge les couleurs Tron)
  colors: {
    primary: '#00F0FF',    // Cyan néon (Tron par défaut)
    secondary: '#FF006E',  // Rose néon
    accent: '#FF6B00'      // Orange néon
  },

  // Affichage du logo
  display: {
    showOnHome: true,       // Afficher sur page d'accueil
    showOnQuiz: true,       // Afficher pendant le quiz
    showOnResults: true,    // Afficher sur les résultats
    showInFooter: true      // Afficher dans le footer
  }
};
