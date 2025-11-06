# 🏔️ Everest Capitals – Free Deployment Guide (Marathi + English Mix)

## 🔧 Step 1: GitHub वर Upload करा / Upload to GitHub
1. ZIP extract करा.
2. टर्मिनल उघडा आणि पुढील command चालवा:
```bash
git init
git add .
git commit -m "Everest Capitals Initial Deploy"
git branch -M main
git remote add origin https://github.com/<तुमचं-username>/everest-capitals.git
git push -u origin main
```

## ☁️ Step 2: MongoDB Atlas Setup (Free Database)
1. जा 👉 https://www.mongodb.com/cloud/atlas
2. Create New Cluster (Free tier).
3. Connect → "Connect your application" → Copy connection string:
```
mongodb+srv://<username>:<password>@cluster0.mongodb.net/everest
```
4. Note: allow Network Access for your IP or 0.0.0.0/0 for testing.

## ⚙️ Step 3: Backend Deploy (Render)
1. Go to https://render.com and sign in.
2. New → Web Service → connect your GitHub repo.
3. Root Directory: `backend/`
4. Build command:
```
npm install
```
5. Start command:
```
npm start
```
6. Environment Variables (add in Render dashboard):
```
PORT=10000
MONGO_URI=<Your MongoDB Atlas URI>
JWT_SECRET=everest_secret
```
7. Click Deploy. Render will give you a backend URL (e.g. https://everest-backend.onrender.com)

## 💻 Step 4: Frontend Deploy (Render Static Site)
1. Render → New → Static Site → connect same GitHub repo.
2. Root Directory: `frontend/`
3. Build Command:
```
npm run build
```
4. Publish Directory:
```
build
```
5. Environment Variable:
```
REACT_APP_API_URL=https://<your-backend-url>/api
```
6. Deploy. Frontend URL will be provided by Render.

## ✅ Step 5: Make an Admin user
- Create a user via Register.
- In MongoDB Atlas → Collections → users → find that user and set `role` to `"admin"`.
- Or run in mongo shell:
```js
db.users.updateOne({ email: "admin@example.com" }, { $set: { role: "admin" } })
```

## 🔐 Tips / Marathi Notes
- `.env.example` फाईल मधील MONGO_URI मध्ये तुमचा Atlas URI ठेवा.
- Render वर deploy करताना `uploads/` local असतो — production साठी S3/Cloudinary वापरायला विचार करा.
- Deployment मध्ये काही error झाल्यास README मधील error कॉपी करून मला पाठवा — मी help करेन.

## Need help?
If you want, share the Render error logs or the repo link and I will help fix any build / deploy issues.

Good luck — तुमच्या Everest Capitals ला live करण्यासाठी शुभेच्छा! 🚀
