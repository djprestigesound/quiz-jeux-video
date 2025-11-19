# Migration sur Vercel - Salle d'Attente

## Étape 1 : Migrer la base de données PostgreSQL

Votre base de données Vercel Postgres doit être mise à jour avec les nouvelles tables.

### Option A : Via le SQL Editor de Vercel

1. Aller sur https://vercel.com/dashboard
2. Sélectionner votre projet `quiz-jeux-video`
3. Aller dans "Storage" → Votre base Postgres
4. Cliquer sur "Query" ou "SQL Editor"
5. Copier-coller le contenu de **`scripts/migrate-events-postgres.sql`**
6. Exécuter le script

### Option B : Via psql (ligne de commande)

```bash
# Récupérer la connection string depuis Vercel
# Puis exécuter :
psql "votre-connection-string" -f scripts/migrate-events-postgres.sql
```

## Étape 2 : Déployer le code sur Vercel

Les modifications ont déjà été committées dans git. Il suffit de pousser :

```bash
git push origin main
```

Vercel déploiera automatiquement les changements.

## Étape 3 : Vérifier le déploiement

1. Attendre que le build Vercel soit terminé (environ 1-2 minutes)
2. Aller sur https://quiz-jeux-video.vercel.app
3. Tester l'interface admin : https://quiz-jeux-video.vercel.app/admin/events

## Fichiers modifiés/créés

### Backend
- `models/QuizEvent.js` (nouveau)
- `models/QuizSession.js` (modifié)
- `controllers/eventController.js` (nouveau)
- `controllers/adminController.js` (modifié)
- `controllers/quizController.js` (modifié)
- `routes/events.js` (nouveau)
- `routes/admin.js` (modifié)
- `routes/index.js` (modifié)
- `server.js` (modifié)

### Frontend
- `views/play.ejs` (modifié)
- `views/admin/events.ejs` (nouveau)
- `views/admin/partials/nav.ejs` (modifié)

### Scripts & Documentation
- `scripts/addQuizEvents.js` (SQLite migration - local)
- `scripts/migrate-events-postgres.sql` (PostgreSQL migration - production)
- `scripts/init-postgres.sql` (mis à jour)
- `GUIDE-SALLE-ATTENTE.md` (nouveau)
- `MIGRATION-VERCEL.md` (ce fichier)

## Vérifications post-déploiement

### 1. Base de données
Vérifier que les tables existent :
```sql
SELECT table_name FROM information_schema.tables
WHERE table_schema = 'public'
AND table_name IN ('quiz_events', 'event_participants');
```

### 2. Interface admin
- Accéder à `/admin/events`
- Créer un événement
- Vérifier qu'il apparaît bien

### 3. Interface participant
- Accéder à `/play`
- Si un événement est en attente, la salle d'attente doit s'afficher
- S'inscrire et vérifier que le participant apparaît dans l'admin

## En cas de problème

### Erreur : "column quiz_id does not exist"
La migration n'a pas été exécutée. Relancer le script `migrate-events-postgres.sql`.

### Erreur : "table quiz_events does not exist"
Idem, la migration n'a pas été exécutée.

### L'événement ne s'affiche pas sur /play
Vérifier dans l'admin que l'événement a bien le statut "waiting".

### Le polling ne fonctionne pas
Vérifier la console du navigateur pour les erreurs réseau.
Vérifier que `/events/status` retourne une réponse 200.
