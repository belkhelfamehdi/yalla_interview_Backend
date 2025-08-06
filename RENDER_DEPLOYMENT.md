# Render Deployment Guide

## 🚀 Variables d'environnement à configurer sur Render

Assurez-vous que ces variables sont définies dans le dashboard Render :

```bash
NODE_ENV=production
FRONTEND_URL=https://yalla-interview.mehdibelkhelfa.com
MONGODB_URI=mongodb+srv://mehdibelkhelfa:Mehdimidou123@yallainterview.384cck4.mongodb.net/?retryWrites=true&w=majority&appName=YallaInterview
JWT_SECRET=0ddbcb99969bec863ff377af1557d3f0e0be4895190b2764b9795d9eb6d8bcca3e87a54373c76c31942d7eb2ab1716be4634dec99bb779c51adc93ca1bbcff13
GEMINI_API_KEY=AIzaSyAF7QRfzhdkT-Q6MFkxtmZiaPfNr9XxNd0
PORT=8000
```

## 🔧 Configuration CORS

Le backend accepte maintenant ces domaines :
- `https://yalla-interview.mehdibelkhelfa.com`
- `https://www.yalla-interview.mehdibelkhelfa.com`

## 🔍 Tests de diagnostic

1. **Test de santé** : `GET /api/health`
2. **Test CORS** : `GET /api/cors-test`

## 📝 Notes importantes

- Les variables d'environnement ne doivent PAS avoir de guillemets sur Render
- Vérifier que NODE_ENV=production pour activer la configuration CORS production
- Le domaine frontend doit correspondre exactement à celui configuré

## 🚀 Commande de déploiement

```bash
npm start
```
