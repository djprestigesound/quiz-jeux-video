# 🚀 Déploiement sur Vercel (100% GRATUIT)

Ce guide te permet de déployer ton quiz jeux vidéo en ligne **gratuitement** avec Vercel et Neon PostgreSQL.

## 📋 Prérequis

- Un compte GitHub (gratuit)
- Un compte Vercel (gratuit)
- Un compte Neon (gratuit)

---

## Étape 1 : Créer un dépôt GitHub

1. Va sur https://github.com/new
2. Nom du repo : `quiz-jeux-video`
3. Choisis "Public" ou "Private"
4. **NE PAS** créer de README (on en a déjà un)
5. Clique sur "Create repository"

### Pousser ton code sur GitHub

Dans ton terminal (dans le dossier du projet) :

```bash
cd ~/quiz-jeux-video

# Initialiser git si pas déjà fait
git init

# Ajouter tous les fichiers
git add .

# Premier commit
git commit -m "Initial commit - Quiz jeux vidéo Tron style"

# Ajouter le remote GitHub (remplace TON_USERNAME par ton nom d'utilisateur GitHub)
git remote add origin https://github.com/TON_USERNAME/quiz-jeux-video.git

# Pousser le code
git branch -M main
git push -u origin main
```

---

## Étape 2 : Créer la base de données PostgreSQL sur Neon

1. **Va sur** https://neon.tech
2. **Clique sur** "Sign Up" (ou Sign in with GitHub)
3. **Crée un compte gratuit**
4. **Clique sur** "Create a project"
   - Project name : `quiz-jeux-video`
   - PostgreSQL version : Garde la dernière (16)
   - Region : Choisis la plus proche de toi (ex: Frankfurt)
5. **Clique sur** "Create project"

### Copier l'URL de connexion

1. Une fois le projet créé, tu verras une **connection string**
2. **Copie** l'URL complète qui ressemble à :
   ```
   postgresql://user:password@ep-xyz-123.eu-central-1.aws.neon.tech/neondb?sslmode=require
   ```
3. **Garde-la de côté**, tu en auras besoin !

### Initialiser la base de données

1. Dans Neon, **clique sur** "SQL Editor" dans le menu de gauche
2. **Copie-colle** tout le contenu du fichier `scripts/init-postgres.sql`
3. **Clique sur** "Run" pour exécuter le script
4. Tu devrais voir : "Successfully executed" ✅
5. Les 20 questions de démonstration sont maintenant dans la base !

---

## Étape 3 : Déployer sur Vercel

1. **Va sur** https://vercel.com
2. **Clique sur** "Sign Up" (ou Sign in with GitHub)
3. **Autorise Vercel** à accéder à ton GitHub
4. **Clique sur** "Import Project"
5. **Colle l'URL** de ton repo GitHub : `https://github.com/TON_USERNAME/quiz-jeux-video`
6. **Clique sur** "Import"

### Configuration des variables d'environnement

**IMPORTANT** : Avant de déployer, il faut ajouter l'URL de la base de données !

1. Dans Vercel, **clique sur** "Environment Variables"
2. **Ajoute une nouvelle variable** :
   - Name : `POSTGRES_URL`
   - Value : **Colle l'URL de connexion** que tu as copiée depuis Neon
   - Environments : Coche "Production", "Preview", et "Development"
3. **Clique sur** "Add"

### Déployer !

1. **Clique sur** "Deploy"
2. ⏳ Attends 1-2 minutes pendant le build...
3. 🎉 **C'est en ligne !**

Vercel va te donner une URL du type :
```
https://quiz-jeux-video-abc123.vercel.app
```

---

## Étape 4 : Tester ton site en ligne

1. **Ouvre l'URL** donnée par Vercel
2. Tu devrais voir l'interface Tron du quiz ! 🎮
3. **Teste le quiz** en entrant un pseudo
4. **Scanne le QR code** depuis `/qrcode` avec ton smartphone en 4G

### Accès admin

1. Va sur : `https://TON-URL.vercel.app/admin`
2. Mot de passe : `admin123`
3. Tu peux :
   - Voir les statistiques
   - Ajouter/modifier des questions
   - Voir les sessions de jeu
   - Générer des QR codes

---

## 🎯 Personnaliser ton domaine (optionnel)

Tu peux avoir une URL personnalisée genre `quiz.ton-domaine.com` :

1. Dans Vercel, **va dans** Settings > Domains
2. **Ajoute ton domaine** personnalisé
3. Vercel te donnera des instructions DNS à suivre

Ou utilise un domaine gratuit Vercel :
- Par défaut : `quiz-jeux-video-abc123.vercel.app`
- Tu peux le renommer dans Settings

---

## 🔧 Mises à jour futures

Quand tu veux mettre à jour le site :

```bash
cd ~/quiz-jeux-video

# Faire tes modifications...

# Commit et push
git add .
git commit -m "Description des modifications"
git push

# Vercel redéploie AUTOMATIQUEMENT ! 🚀
```

---

## ⚡ Résumé des URL importantes

- **Site live** : `https://TON-URL.vercel.app`
- **Admin** : `https://TON-URL.vercel.app/admin`
- **QR Code** : `https://TON-URL.vercel.app/qrcode`
- **Classement** : `https://TON-URL.vercel.app/quiz/leaderboard`
- **Neon Dashboard** : https://console.neon.tech
- **Vercel Dashboard** : https://vercel.com/dashboard

---

## 🆘 En cas de problème

### Le site ne s'affiche pas
- Vérifie que `POSTGRES_URL` est bien configuré dans Vercel
- Vérifie les logs dans Vercel Dashboard > Deployments > ton deploy > Logs

### Erreur de base de données
- Vérifie que le script SQL a bien été exécuté dans Neon
- Vérifie que l'URL de connexion est correcte

### Les QR codes ne fonctionnent pas
- Vérifie que tu es bien en 4G/5G (pas en WiFi local)
- L'URL dans le QR code doit être celle de Vercel, pas localhost

---

## 💰 Coûts

**Tout est 100% GRATUIT !**

- Vercel : Plan gratuit avec 100 GB bande passante/mois
- Neon : 0.5 GB de stockage gratuit + 10 GB de transfert/mois
- GitHub : Illimité pour les repos publics/privés

C'est largement suffisant pour ton événement ! 🎉

---

## 🎮 Bon jeu !

Ton quiz est maintenant accessible partout dans le monde avec une simple connexion internet !

Des questions ? Consulte :
- Documentation Vercel : https://vercel.com/docs
- Documentation Neon : https://neon.tech/docs
