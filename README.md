# Quiz Jeux Vidéo - Application événementielle

Application de quiz interactive sur les jeux vidéo, conçue pour les événements. Les participants peuvent accéder au quiz via un QR code et jouer en temps réel.

## 🌐 Site en ligne (Production)

**URL principale** : https://quiz-jeux-video.vercel.app

### Liens importants

- **🎮 Quiz** : https://quiz-jeux-video.vercel.app
- **📱 QR Code** : https://quiz-jeux-video.vercel.app/qrcode
- **👨‍💼 Administration** : https://quiz-jeux-video.vercel.app/admin
- **🏆 Classement** : https://quiz-jeux-video.vercel.app/quiz/leaderboard

**Mot de passe admin** : `admin123`

## Fonctionnalités

- 🎮 Quiz interactif avec questions à choix multiples
- ⏱️ Timer configurable par question
- 🏆 Système de scoring et classement en temps réel
- 📱 Accès via QR code
- 👨‍💼 Interface d'administration complète
- 💾 Base de données PostgreSQL (production) / SQLite (local)
- 🎨 Design Tron avec effets néon et cyber futuriste
- ☁️ Déployé sur Vercel (100% gratuit)

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

### Version en ligne (recommandée)

1. Ouvrez https://quiz-jeux-video.vercel.app/qrcode
2. Affichez le QR code sur un écran ou imprimez-le
3. Les participants scannent le QR code avec leur smartphone (4G/5G)
4. Ils entrent leur pseudo et jouent immédiatement
5. Consultez les résultats en temps réel sur https://quiz-jeux-video.vercel.app/admin

**Avantage** : Fonctionne partout dans le monde, pas besoin de WiFi local

### Version locale

1. Démarrez le serveur sur un ordinateur local (`npm start`)
2. Tous les participants doivent être sur le même réseau WiFi
3. Affichez le QR code depuis http://localhost:3001/qrcode
4. Consultez l'administration depuis http://localhost:3001/admin

## Ajout de questions

Connectez-vous à l'interface d'administration pour :
- Ajouter de nouvelles questions
- Modifier les questions existantes
- Organiser par catégories
- Définir la difficulté

## Technologies utilisées

**Backend**
- Node.js + Express (MVC)
- PostgreSQL (Neon - production)
- SQLite3 (développement local)
- EJS (Templates)
- Express Session

**Frontend**
- Vanilla JavaScript
- CSS3 (Design Tron avec effets néon)
- Google Fonts (Orbitron, Rajdhani)

**Déploiement**
- Vercel (Hébergement serverless)
- Neon (Base de données PostgreSQL managée)
- GitHub (Contrôle de version)

## License

MIT
