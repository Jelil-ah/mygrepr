# Grepr

Grepr scrapes finance subreddits (r/vosfinances, r/Bogleheads, r/ETFs and more), runs them through Groq AI to categorize and summarize, then shows everything on a dashboard.

Built this to stop scrolling Reddit for finance advice and just have it all in one place.

## How it works

1. Scheduler fetches posts daily from 12+ subreddits via PullPush.io
2. Groq AI (LLaMA 3.3 70B) categorizes each post (ETF, Immobilier, Crypto, etc.)
3. Everything gets stored in NocoDB
4. Next.js frontend displays it all — filters, ETF tracker, consensus board

## Stack

**Frontend** — Next.js, React 19, Tailwind, Framer Motion
**Backend** — Python, Groq API
**Data** — PullPush.io, NocoDB
**Deploy** — Docker, Dokploy on Hetzner

## Run it yourself

```bash
git clone https://github.com/Jelil-ah/mygrepr.git
cd mygrepr

# backend
cp .env.example .env   # fill in your keys
pip install -r requirements.txt
python scheduler.py dry  # test run

# frontend
cd frontend
npm install
# set NOCODB_URL, NOCODB_TOKEN, NOCODB_TABLE_ID in .env.local
npm run dev
```

## Scheduler

```bash
python scheduler.py          # daily loop (runs at 6:00)
python scheduler.py dry      # one-time fetch, no push
python scheduler.py status   # see progress
python scheduler.py reset    # start fresh
```
