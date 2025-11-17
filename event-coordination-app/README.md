# Event Coordination App (Starter)

This is a minimal Vite + React + TypeScript + Tailwind starter app that uses **Supabase** for backend (auth + database).

## Quick setup

1. Unzip and open the folder in VS Code:
   ```bash
   cd event-coordination-app
   npm install
   ```

2. Create a file named `.env` in the project root and add your Supabase values:

   ```
   VITE_SUPABASE_URL=https://pibmtxkwqlpaqpkfrahx.supabase.co
   VITE_SUPABASE_ANON_KEY=YOUR_ANON_KEY_HERE
   ```

   > **Do not** commit `.env` to source control — it contains your public anon key.

3. Start the dev server:
   ```bash
   npm run dev
   ```

4. Open `http://localhost:5173` and log in / sign up with an email & password.

## Project notes

- Replace `VITE_SUPABASE_ANON_KEY` with your actual anon public key from Supabase.
- This starter includes simple Auth and an Events dashboard where you can add/edit/delete events.
- Deploy to Vercel / Netlify by connecting the repository and adding the same environment variables in the platform's dashboard.

