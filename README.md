# SKA Thrive by Design — Diagnostic

Access-code-protected diagnostic form with Gmail email backend for Sarah Khan Associates.

**Live URL:** _(add after deployment)_
**GitHub:** https://github.com/MAliSheikh/Diagnostic-Task

---

## Stack & Why

For this MVP, I used **vanilla HTML/CSS/JS** on the frontend and **Python (Flask)** on the backend, with Python's built-in `smtplib` for Gmail SMTP — no external email library needed.

I chose Python because it is clean, readable, and well-suited even for small tasks like this. For larger automation projects, Python scales naturally with its rich ecosystem of libraries. The frontend is plain HTML/CSS/JS to keep it lightweight and dependency-free.

---

## Setup

### 1. Install dependencies
```bash
pip install -r requirements.txt
```

### 2. Configure credentials
Add your credentials to the `.env` file in the project root:
```
EMAIL=your.gmail@gmail.com
PASSWORD=xxxx xxxx xxxx xxxx
```
Get your 16-character App Password at: https://myaccount.google.com/apppasswords
*(2-Step Verification must be enabled first.)*

---

## Run Locally

```bash
python api/submit.py
```
Opens at **http://localhost:3000**

---

## Deploy to Vercel

```bash
npx vercel --prod
```
Then add `EMAIL` and `PASSWORD` in **Vercel dashboard → Settings → Environment Variables** and redeploy.
