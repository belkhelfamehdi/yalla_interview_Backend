# 🔧 Test Étape par Étape - Erreur 400

## 🎯 Objectif
Identifier pourquoi l'endpoint `/api/auth/login` retourne une erreur 400.

## 📋 Tests à effectuer dans l'ordre

### 1. Test de base - Serveur répond-il ?
```bash
GET https://yalla-interview-backend.onrender.com/api/health
```
**Attendu :** Status 200 avec message de santé

### 2. Test CORS - Configuration OK ?
```bash
GET https://yalla-interview-backend.onrender.com/api/cors-test
```
**Attendu :** Voir `nodeEnv: "production"` et frontend URL correcte

### 3. Test POST simple - Parsing JSON OK ?
```bash
POST https://yalla-interview-backend.onrender.com/api/test-simple
Content-Type: application/json

{
  "test": "data"
}
```
**Attendu :** Status 200 avec le body reçu

### 4. Créer un utilisateur de test
```bash
POST https://yalla-interview-backend.onrender.com/api/create-test-user
```
**Attendu :** Status 201 avec les identifiants de test

### 5. Test login sans validation
```bash
POST https://yalla-interview-backend.onrender.com/api/auth/login-debug
Content-Type: application/json

{
  "email": "test@yalla.com",
  "password": "password123"
}
```
**Attendu :** Status 200 avec token

### 6. Test login avec validation
```bash
POST https://yalla-interview-backend.onrender.com/api/auth/login
Content-Type: application/json

{
  "email": "test@yalla.com",
  "password": "password123"
}
```
**Attendu :** Status 200 avec token

## 🔍 Diagnostics par erreur

### Si étape 1 échoue
- Problème de déploiement Render
- Variables d'environnement manquantes

### Si étape 2 échoue
- Configuration CORS incorrecte
- Variables NODE_ENV ou FRONTEND_URL incorrectes

### Si étape 3 échoue
- Problème avec le parsing JSON
- Middleware de sécurité bloque

### Si étape 4 échoue
- Problème de connexion MongoDB
- Variables MONGODB_URI incorrectes

### Si étape 5 réussit mais 6 échoue
- Problème avec la validation Joi
- Middleware de validation défaillant

### Si étape 6 échoue avec vos vraies données
- Utilisateur n'existe pas
- Mot de passe incorrect
- Email mal formaté

## 🚀 Tests depuis votre frontend

Une fois que tous les tests passent, testez depuis votre application :

```javascript
// Test depuis la console du navigateur
fetch('https://yalla-interview-backend.onrender.com/api/auth/login-debug', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    email: 'test@yalla.com',
    password: 'password123'
  })
})
.then(r => r.json())
.then(console.log)
```

## 📊 Messages d'erreur courants

- **400 + "Validation error"** → Format des données incorrect
- **400 + "Email and password required"** → Données manquantes
- **400 + "Invalid credentials"** → Email ou mot de passe faux
- **500** → Erreur serveur (MongoDB, JWT, etc.)
- **429** → Rate limiting (trop de requêtes)

Suivez ces étapes dans l'ordre pour identifier exactement où est le problème !
