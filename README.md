# Quiz Jeux Vidéo - Application événementielle

Application de quiz interactive sur les jeux vidéo, conçue pour les événements. Les participants peuvent accéder au quiz via un QR code et jouer en temps réel.

## Fonctionnalités

- 🎮 Quiz interactif avec questions à choix multiples
- ⏱️ Timer configurable par question
- 🏆 Système de scoring et classement en temps réel
- 📱 Accès via QR code
- 👨‍💼 Interface d'administration complète
- 💾 Base de données locale (SQLite)
- 🎨 Interface moderne et responsive

## Installation

1. Cloner ou télécharger le projet
2. Installer les dépendances :

```bash
npm install
```

3. Initialiser la base de données :

```bash
npm run init-db
```

## Démarrage

```bash
npm start
```

L'application sera accessible sur `http://localhost:3000`

En mode développement avec auto-reload :

```bash
npm run dev
```

## Accès

- **Quiz** : http://localhost:3000
- **Administration** : http://localhost:3000/admin
  - Mot de passe par défaut : `admin123`

## Configuration

Modifiez le fichier `config/config.js` pour personnaliser :

- Port du serveur
- Nombre de questions par session
- Temps par question
- Points par bonne réponse
- Mot de passe admin

## Structure du projet

```
quiz-jeux-video/
├── config/           # Configuration et base de données
├── controllers/      # Logique métier (MVC)
├── models/          # Modèles de données
├── views/           # Templates EJS
├── routes/          # Routes Express
├── public/          # Fichiers statiques (CSS, JS, images)
├── scripts/         # Scripts utilitaires
└── database/        # Base de données SQLite
```

## Utilisation lors d'un événement

1. Démarrez le serveur sur un ordinateur local
2. Connectez-vous à l'administration
3. Générez et affichez le QR code
4. Les participants scannent le QR code avec leur smartphone
5. Ils entrent leur pseudo et jouent
6. Consultez les résultats et le classement en temps réel

## Ajout de questions

Connectez-vous à l'interface d'administration pour :
- Ajouter de nouvelles questions
- Modifier les questions existantes
- Organiser par catégories
- Définir la difficulté

## Technologies utilisées

- Node.js + Express
- SQLite3
- EJS (Templates)
- Vanilla JavaScript
- CSS3

## License

MIT
