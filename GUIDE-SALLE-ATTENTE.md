# Guide : Système de Salle d'Attente

## Fonctionnalité implémentée

Le système de salle d'attente permet à l'administrateur de contrôler le moment où tous les participants commencent le quiz en même temps.

## Architecture

### 3 modes de fonctionnement de la page /play

1. **Mode Événement en Attente** (status: 'waiting')
   - Les participants voient une salle d'attente
   - Ils s'inscrivent avec leur pseudo
   - Un compteur affiche le nombre de participants
   - La page se rafraîchit automatiquement toutes les 2 secondes pour vérifier si le quiz est lancé

2. **Mode Événement Lancé** (status: 'started')
   - Les participants peuvent entrer leur pseudo et commencer le quiz
   - Le quiz est pré-sélectionné (celui de l'événement)
   - Pas besoin de choisir le quiz

3. **Mode Libre** (pas d'événement actif)
   - Comportement classique
   - Les participants choisissent leur quiz et commencent directement

## Comment tester le flux complet

### Étape 1 : Se connecter à l'admin

1. Ouvrir : http://localhost:3001/admin
2. Entrer le mot de passe admin (voir config/config.js)
3. Accéder au dashboard

### Étape 2 : Créer un événement

1. Cliquer sur "🎯 Événements" dans le menu
2. Remplir le formulaire :
   - **Nom** : "Quiz Test - 19 Nov"
   - **Quiz** : Choisir un quiz (par exemple Quiz 1)
3. Cliquer sur "Créer l'événement"
4. L'événement apparaît avec le statut "En attente"

### Étape 3 : Simuler des participants

1. Ouvrir plusieurs onglets sur : http://localhost:3001/play
2. Dans chaque onglet :
   - Vous voyez la **salle d'attente** avec l'animation ⏳
   - Le message "En attente du démarrage..."
   - Un formulaire pour entrer votre pseudo
3. Entrer un pseudo différent dans chaque onglet (ex: "Joueur1", "Joueur2")
4. Cliquer sur "Rejoindre la salle d'attente"
5. Après l'inscription, le message "Vous êtes inscrit ! Le quiz démarrera automatiquement."

### Étape 4 : Voir les participants côté admin

1. Retourner sur : http://localhost:3001/admin/events
2. La page se rafraîchit automatiquement toutes les 5 secondes
3. Vous voyez :
   - Le nombre de participants
   - La liste de tous les participants avec l'heure d'inscription
   - Le bouton "🚀 Lancer le Quiz" (activé seulement s'il y a au moins 1 participant)

### Étape 5 : Lancer le quiz

1. Cliquer sur "🚀 Lancer le Quiz"
2. Confirmer dans la popup
3. L'événement passe au statut "En cours"

### Étape 6 : Les participants commencent automatiquement

1. **Automatiquement**, dans tous les onglets participants :
   - La page se recharge
   - Le formulaire de démarrage du quiz apparaît
   - Le quiz est pré-sélectionné
   - Le participant entre son pseudo et clique sur "Commencer le Quiz"

## Base de données

### Nouvelles tables créées

**quiz_events**
```sql
- id (PK)
- name (nom de l'événement)
- quiz_id (quiz associé)
- status ('waiting', 'started', 'finished')
- created_at
- started_at
- finished_at
```

**event_participants**
```sql
- id (PK)
- event_id (FK vers quiz_events)
- player_name
- joined_at
- UNIQUE(event_id, player_name) -- Pas de doublon
```

**quiz_sessions** (modifié)
```sql
Nouvelles colonnes :
- quiz_id (quel quiz a été joué)
- event_id (lié à un événement ou NULL si mode libre)
```

## Endpoints API

### Pour les participants
- `GET /events/status` - Vérifier le statut de l'événement actif (polling)
- `POST /events/join` - S'inscrire à l'événement

### Pour l'admin
- `GET /admin/events` - Page de gestion
- `POST /admin/events/create` - Créer un événement
- `POST /admin/events/:id/start` - Lancer un événement
- `POST /admin/events/:id/finish` - Terminer un événement

## Comportements automatiques

1. **Polling côté participant** : Toutes les 2 secondes, vérifie si le quiz est lancé
2. **Auto-refresh côté admin** : Toutes les 5 secondes en mode attente
3. **LocalStorage** : Le pseudo du participant est sauvegardé pour faciliter les tests

## Notes importantes

- Un seul événement peut être actif à la fois (status: 'waiting' ou 'started')
- Les participants ne peuvent s'inscrire qu'à un événement en attente
- Le bouton "Lancer" est désactivé s'il n'y a aucun participant
- Les participants déjà inscrits voient directement le message de confirmation

## Déploiement sur Vercel

Le système fonctionne en serverless sur Vercel grâce à :
- Cookie-based sessions (pas de Redis nécessaire)
- PostgreSQL pour la production (auto-détecté via DATABASE_URL)
- SQLite en local

---

✅ **Le système est prêt à être testé !**
