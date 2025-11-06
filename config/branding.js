// Configuration du branding entreprise
module.exports = {
  // Nom de l'entreprise
  companyName: 'VERDON',

  // Slogan ou tagline
  tagline: 'Powered by VERDON',

  // Chemins des logos
  logos: {
    main: '/images/branding/logo.png',
    white: '/images/branding/logo-white.png',
    small: '/images/branding/logo-small.png'
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
