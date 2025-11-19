# 🧪 GUIDE DE TEST COMPLET - Quiz Jeux Vidéo

## Tests à effectuer avant l'événement du 28 novembre 2025

---

## ✅ TEST 1: SCAN QR CODE & ACCÈS INITIAL

### Étapes:
1. Va sur https://quiz-jeux-video.vercel.app/qrcode
2. **Imprime** ou affiche le QR code sur ton téléphone
3. **Scanne le QR code** avec un autre téléphone/tablette
4. Tu dois arriver sur: https://quiz-jeux-video.vercel.app/play

### Résultat attendu:
- ✅ QR code génère correctement avec les logos VERDON & DJ Prestige Sound
- ✅ Le scan redirige vers /play
- ✅ La page /play affiche le formulaire avec:
  - Champ pseudo
  - 4 choix de quiz
  - Bouton "Commencer le Quiz"
  - Logos en haut de page

---

## ✅ TEST 2: INSCRIPTION & DÉMARRAGE QUIZ

### Étapes:
1. Sur /play, entre un pseudo (ex: "TestJoueur1")
2. Choisis un quiz (ex: Quiz 1 - Classiques)
3. Clique sur "Commencer le Quiz"

### Résultat attendu:
- ✅ Redirection vers /quiz/question
- ✅ Première question s'affiche
- ✅ Timer de 30 secondes démarre
- ✅ 4 options de réponse (A, B, C, D) visibles
- ✅ Compteur "Question X/20" affiché
- ✅ Score actuel visible

---

## ✅ TEST 3: RÉPONSE AUX QUESTIONS

### Étapes:
1. Clique sur une réponse
2. Attends le feedback (Bonne/Mauvaise réponse)
3. Clique sur "Question suivante"
4. Répète pour quelques questions

### Résultat attendu:
- ✅ Feedback immédiat après clic
- ✅ Bonne réponse = fond vert + points ajoutés
- ✅ Mauvaise réponse = fond rouge + bonne réponse affichée
- ✅ Score mis à jour en temps réel
- ✅ Progression question X/20 correcte
- ✅ Timer se réinitialise pour chaque question

---

## ✅ TEST 4: FIN DE QUIZ & RÉSULTATS

### Étapes:
1. Réponds aux 20 questions (ou attends timeout)
2. Arrive sur la page résultats

### Résultat attendu:
- ✅ Score total affiché
- ✅ Pourcentage de réussite (X/20 bonnes réponses)
- ✅ Message de performance selon score
- ✅ TOP 10 avec ta position
- ✅ CTA DJ Prestige Sound avec QR code
- ✅ Boutons "Rejouer" et "Voir classement complet"

---

## ✅ TEST 5: CLASSEMENT PUBLIC

### Étapes:
1. Clique sur "Voir le classement complet"
2. OU va sur https://quiz-jeux-video.vercel.app/quiz/leaderboard

### Résultat attendu:
- ✅ Logos VERDON & DJ Prestige Sound en haut
- ✅ Liste de tous les joueurs triés par score
- ✅ Médailles 🥇🥈🥉 pour les 3 premiers
- ✅ Ta session highlighted si présente
- ✅ Auto-refresh toutes les 5 secondes
- ✅ Point de refresh animé

---

## ✅ TEST 6: MODE ÉCRAN GÉANT (POUR L'ÉVÉNEMENT)

### Étapes:
1. Va sur https://quiz-jeux-video.vercel.app/quiz/leaderboard/display
2. Affiche en plein écran (F11 ou bouton plein écran)

### Résultat attendu:
- ✅ Design optimisé pour projection
- ✅ Logos VERDON & DJ Prestige Sound visibles
- ✅ TOP 10 uniquement
- ✅ Auto-refresh toutes les 3 secondes
- ✅ Grandes polices lisibles de loin
- ✅ Animations douces

---

## ✅ TEST 7: NAVIGATION GÉNÉRALE

### Étapes:
1. Teste tous les liens de navigation
2. Homepage → /play → Quiz → Résultats → Classement

### Résultat attendu:
- ✅ Page d'accueil (/): Programme de la journée visible
- ✅ Lien "Participer au Quiz" fonctionne
- ✅ Lien "Voir le classement" fonctionne
- ✅ Lien "Générer QR Code" fonctionne
- ✅ Tous les logos présents partout
- ✅ Responsive sur mobile/tablette/desktop

---

## ✅ TEST 8: MULTI-JOUEURS SIMULTANÉS

### Étapes:
1. Ouvre 3-4 onglets/appareils différents
2. Lance des quiz en même temps avec différents pseudos
3. Vérifie le classement

### Résultat attendu:
- ✅ Tous les joueurs peuvent jouer simultanément
- ✅ Pas de conflit de session
- ✅ Scores corrects pour chaque joueur
- ✅ Classement se met à jour pour tous
- ✅ Pas de bug/erreur

---

## ✅ TEST 9: LES 3 QUIZ DIFFÉRENTS

### Étapes:
1. Teste chaque quiz séparément:
   - Quiz 1: Classiques
   - Quiz 2: Jeux Modernes
   - Quiz 3: Culture Gaming

### Résultat attendu:
- ✅ Chaque quiz a des questions différentes
- ✅ 20 questions par quiz
- ✅ Difficulté progressive (facile → difficile)
- ✅ Pas de doublon de questions
- ✅ Questions pertinentes au thème

---

## ✅ TEST 10: PERFORMANCE & VITESSE

### Étapes:
1. Teste la rapidité de chargement des pages
2. Teste avec connexion 4G (smartphone hors WiFi)

### Résultat attendu:
- ✅ Pages se chargent en < 2 secondes
- ✅ Fonctionne bien sur 4G/5G
- ✅ Pas de lag entre les questions
- ✅ Auto-refresh fluide
- ✅ Pas d'erreur 500 ou timeout

---

## 🎯 CHECKLIST FINALE AVANT L'ÉVÉNEMENT

### Configuration:
- [ ] Base de données vidée (pas de données de test)
- [ ] Tous les logos VERDON & DJ Prestige Sound présents
- [ ] QR codes imprimés et placés sur les tables
- [ ] Mode écran géant testé sur le projecteur
- [ ] Connexion internet de la salle testée

### URLs importantes:
- **Homepage**: https://quiz-jeux-video.vercel.app
- **Jouer** (QR code): https://quiz-jeux-video.vercel.app/play
- **Classement**: https://quiz-jeux-video.vercel.app/quiz/leaderboard
- **Écran géant**: https://quiz-jeux-video.vercel.app/quiz/leaderboard/display
- **QR Code**: https://quiz-jeux-video.vercel.app/qrcode
- **Admin**: https://quiz-jeux-video.vercel.app/admin

### Le jour J (28 novembre):
- [ ] 12h00: Afficher mode écran géant
- [ ] 12h00: Distribuer/afficher QR codes
- [ ] 12h30: Annoncer Quiz 1 - Classiques
- [ ] 13h45: Annoncer Quiz 2 - Modernes
- [ ] 15h00: Annoncer Quiz 3 - Culture
- [ ] 16h15: Classement final

---

## 📱 CONTACT SUPPORT

En cas de problème pendant l'événement:
- Vérifier connexion internet
- Rafraîchir la page (F5)
- Vider le cache navigateur
- Redémarrer le navigateur

---

**Document préparé pour l'événement VERDON - Saint Éloi 2025**
**DJ Prestige Sound | Quiz Jeux Vidéo**
