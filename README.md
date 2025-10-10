<a href="https://long-distance-eta.vercel.app/">
  <h1 align="center">Long Distance</h1>
</a>

<p align="center">
 The fastest way to build apps with Next.js and Supabase
</p>

<p align="center">
  <a href="#features"><strong>Features</strong></a> ·
  <a href="#demo"><strong>Demo</strong></a> ·
  <a href="#clone-and-run-locally"><strong>Clone and run locally</strong></a>
</p>
<br/>

## Features

- Be able to register/login/update profile
- Create many journals
- Invite people to join journal
- Create/update journals' entry
- Update journal settings (Journal's title, long distance date)
- Delete journal

## Demo

You can view a fully working demo at [long-distance-eta.vercel.app](https://long-distance-eta.vercel.app/).


## Clone and run locally

1. You'll first need a Supabase project which can be made [via the Supabase dashboard](https://database.new)

2. Clone this repo to local

3. Go to repo and add `.env.local` and update the following:

   ```
   NEXT_PUBLIC_SUPABASE_URL=[INSERT SUPABASE PROJECT URL]
   NEXT_PUBLIC_SUPABASE_ANON_KEY=[INSERT SUPABASE PROJECT API ANON KEY]
   ```

   Both `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` can be found in [your Supabase project's API settings](https://supabase.com/dashboard/project/_?showConnect=true)

5. You can now run the Next.js local development server:

   ```bash
   npm run dev
   ```
   The app should now be running on [localhost:3000](http://localhost:3000/).
