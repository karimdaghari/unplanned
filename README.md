<h1 align="center">Unplanned</h1>

<p align="center">
 AI-powered event planning assistant built with Next.js, tRPC, and the Vercel AI SDK
</p>

<p align="center">
  <a href="#features"><strong>Features</strong></a> ·
  <a href="#tech-stack"><strong>Tech Stack</strong></a> ·
  <a href="#local-development"><strong>Local Development</strong></a> ·
  <a href="#deployment"><strong>Deployment</strong></a> ·
  <a href="#possible-improvements"><strong>Possible Improvements</strong></a>
</p>
<br/>

## About

Unplanned is a conversational AI assistant for event planning, helping users brainstorm and schedule corporate event ideas. The application uses AI to generate creative event concepts and suggests venues for different types of events.

Whether you're planning a team offsite, a corporate conference, or a virtual meeting, Unplanned helps you explore options, find inspiration, and save your ideas.

_P.S.: Whipped up in a weekend, it’s more about speed and potential than perfection. Think of it as a POC, for people who value action > words._

## Features

- **AI-Powered Event Ideation**: Get creative event ideas based on your input
- **Venue Suggestions**: Discover potential venues for your events
- **User Authentication**: Save your event plans and access them later
- **Conversational Interface**: Natural chat-based interaction with the AI assistant
- **Suggested Prompts**: Quick-start your planning with prepared suggestions

## Tech Stack

- **Framework**: [Next.js 15](https://nextjs.org) with App Router
- **AI**: [Vercel AI SDK](https://sdk.vercel.ai/docs) with OpenAI integration
- **Database/Authentication**: [Supabase](https://supabase.com) with PostgreSQL
- **ORM**: [Drizzle ORM](https://orm.drizzle.team)
- **API**: [tRPC](https://trpc.io) for type-safe API calls
- **State Management**: [TanStack Query](https://tanstack.com/query)
- **UI Components/Styling**: [Shadcn UI](https://ui.shadcn.com/): Radix primitive + [Tailwind CSS](https://tailwindcss.com) v4

## Local Development

### Prerequisites

- Node.js (v20 or later)
- pnpm (v10 or later)
- Docker (for local database)

### Setup

1. Clone the repository

   ```bash
   git clone https://github.com/karimdaghari/unplanned.git
   cd unplanned
   ```

2. Install dependencies

   ```bash
   pnpm install
   ```

3. Copy the example environment file and update with your credentials

   ```bash
   cp .env.example .env
   ```

4. Update `.env` with your Supabase and OpenAI API credentials

5. Start the development database

   ```bash
   pnpm db:start
   ```

6. Migrate the database schema

   ```bash
   pnpm db:migrate
   ```

7. Run the development server

   ```bash
   pnpm dev
   ```

8. Open [http://localhost:3000](http://localhost:3000) in your browser

## Database

The project uses PostgreSQL via Supabase for data storage. The local development setup uses Docker to run PostgreSQL.

## Deployment

### Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new).

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fkarimdaghari%2Funplanned)

### Environment Variables

For deployment, you'll need to set the following environment variables:

- `SUPABASE_URL`: Your Supabase project URL
- `SUPABASE_ANON_KEY`: Your Supabase anonymous key
- `OPENAI_API_KEY`: Your OpenAI API key
- `DATABASE_URL`: Your PostgreSQL connection string

## Possible Improvements

With more time, I’d enhance Unplanned by adding:

- **Real Venue Integration**: Use Google Places API for dynamic venue suggestions.
- **Events/Trips Dashboard**: Add a page to view and edit saved events/trips.
- **Event/Trips Details**: Support additional fields like budget or attendees.
- **Personalized AI**: Incorporate user context (e.g., current location, event season and timing etc...), history (i.e., past conversations) or preferences for smarter suggestions.
- **Advanced AI**: Use **tools** to allow the user to plan everything using natural language.
- **UI Refinement**: Add animations and custom shadcn/ui tweaks for a unique look.
- **Testing**: Add unit/integration tests with Jest or Playwright.
