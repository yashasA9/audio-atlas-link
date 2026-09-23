# MusicD

> A blockchain-enabled music platform that connects artists and listeners through music discovery, playlists, and direct artist tipping.

## Overview

MusicD is a web-based music platform designed to provide a modern music discovery and listening experience while enabling listeners to directly support artists through blockchain-based tips.

The application combines a React frontend, Supabase for authentication and application data, and Ethereum-compatible wallet interaction through MetaMask and ethers.js.

Artists can create profiles, upload and manage tracks, monitor platform activity, and receive tips. Listeners can discover music, manage playlists, follow artists, review tracks, and support artists through blockchain transactions.

## Features

### For Listeners

*  Browse and discover music
*  Discover artists and tracks
*  Integrated music player
*  Personal music library
*  Create and manage playlists
*  Like tracks
*  Follow artists
*  Review and rate tracks
*  Directly tip artists through a connected wallet
*  View transaction history

### For Artists

*  Create an artist profile
*  Upload tracks
*  Rename and manage tracks
*  Delete tracks
*  View track statistics
*  Monitor followers
*  Track tips received
*  Access an artist dashboard

### Blockchain

* MetaMask wallet connection
* Wallet address and balance detection
* Ethereum-compatible transaction flow
* Direct artist tipping
* Transaction status tracking
* Transaction hash storage

## Architecture

```text
                         ┌─────────────────┐
                         │      User       │
                         └────────┬────────┘
                                  │
                                  ▼
                    ┌─────────────────────────┐
                    │ React + TypeScript App  │
                    │                         │
                    │ Music Player            │
                    │ Discovery               │
                    │ Playlists               │
                    │ Artist Dashboard        │
                    │ Reviews                 │
                    └──────────┬───────┬──────┘
                               │       │
                    ┌──────────┘       └──────────┐
                    ▼                             ▼
             Supabase                       MetaMask
                    │                             │
          ┌─────────┴─────────┐                   ▼
          │                   │              Blockchain
          ▼                   ▼                   │
       Auth / DB         Application Data         │
          │                   │                   │
          └─────────┬─────────┘                   │
                    │                             │
                    └─────────────┬───────────────┘
                                  ▼
                         Transaction Records
                         & Application State
```

## Technology Stack

### Frontend

* React 18
* TypeScript
* Vite
* React Router
* Tailwind CSS
* Framer Motion
* shadcn/Radix UI components

### Authentication & Database

* Supabase Authentication
* Supabase PostgreSQL
* Row Level Security (RLS)

### Blockchain

* Ethereum-compatible wallet interaction
* MetaMask
* ethers.js

### Development

* Bun / npm
* ESLint
* Vitest
* Git

## Application Flow

### Authentication

Users can register and sign in using Supabase Authentication.

```text
User
 │
 ▼
Auth Page
 │
 ▼
Supabase Auth
 │
 ├── Sign Up
 └── Sign In
 │
 ▼
Authenticated Session
 │
 ▼
User Profile
```

A database trigger automatically creates a profile record when a new authenticated user is created.

### Artist Management

Artists can create and manage their artist profile.

The application stores artist information such as:

* Artist name
* Biography
* Avatar
* Banner
* Wallet address
* Followers
* Tip statistics

Artists can also manage their uploaded tracks through the dashboard.

### Music Data

Supabase PostgreSQL stores application data including:

* Profiles
* Artists
* Tracks
* Playlists
* Playlist tracks
* Likes
* Follows
* Tips
* Reviews

Relationships and indexes are defined through Supabase migrations.

### Artist Tipping

The tipping flow uses MetaMask and ethers.js.

```text
Listener
   │
   ▼
Select Artist
   │
   ▼
Enter Tip Amount
   │
   ▼
Connect MetaMask
   │
   ▼
Wallet Transaction
   │
   ▼
Blockchain
   │
   ▼
Transaction Hash
   │
   ▼
Transaction Status
   │
   ▼
Application Transaction History
```

The application also maintains tip-related records in Supabase, including the sender, artist, amount, transaction hash, and transaction status.

### Wallet Management

The wallet context handles:

* Connecting MetaMask
* Disconnecting the wallet
* Reading the connected account
* Detecting the current chain
* Fetching wallet balance
* Responding to account changes
* Responding to network changes
* Reconnecting previously authorized accounts

## Database Design

The main database entities include:

```text
profiles
    │
    └── users

artists
    │
    └── tracks

users ────────── follows ────────── artists

users ────────── likes ─────────── tracks

users ────────── reviews ────────── tracks

users ─────── playlists
                  │
                  └── playlist_tracks ── tracks

users ────────── tips ───────────── artists
```

Row Level Security policies are used to restrict operations such as:

* Updating a user's profile
* Managing an artist's own tracks
* Managing personal playlists
* Creating and removing likes
* Following/unfollowing artists
* Creating reviews
* Viewing tip information according to sender/artist ownership

## Project Structure

```text
audio-atlas-link/
├── src/
│   ├── components/
│   │   ├── ui/
│   │   ├── AudioPlayer.tsx
│   │   ├── ArtistCard.tsx
│   │   ├── MusicCard.tsx
│   │   ├── TipModal.tsx
│   │   └── ...
│   │
│   ├── context/
│   │   ├── AuthContext.tsx
│   │   ├── PlayerContext.tsx
│   │   ├── TransactionContext.tsx
│   │   └── WalletContext.tsx
│   │
│   ├── integrations/
│   │   └── supabase/
│   │
│   ├── pages/
│   │   ├── HomePage.tsx
│   │   ├── DiscoverPage.tsx
│   │   ├── ArtistPage.tsx
│   │   ├── LibraryPage.tsx
│   │   ├── PlaylistsPage.tsx
│   │   ├── UploadPage.tsx
│   │   ├── ArtistDashboardPage.tsx
│   │   └── TransactionHistoryPage.tsx
│   │
│   ├── hooks/
│   ├── data/
│   ├── types/
│   └── App.tsx
│
├── supabase/
│   ├── config.toml
│   └── migrations/
│
├── package.json
└── vite.config.ts
```

## Installation

### Prerequisites

* Node.js or Bun
* A Supabase project
* MetaMask browser extension for blockchain functionality

### Clone the repository

```bash
git clone https://github.com/yashasA9/audio-atlas-link.git
cd audio-atlas-link
```

### Install dependencies

Using npm:

```bash
npm install
```

Or using Bun:

```bash
bun install
```

### Configure environment variables

Create a `.env` file containing the required Supabase configuration.

```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_PUBLISHABLE_KEY=your_supabase_publishable_key
```

Never commit private credentials or secret keys to the repository.

### Start the development server

```bash
npm run dev
```

or:

```bash
bun run dev
```

## My Contributions

This project was developed as an individual project.

Key areas of development included:

* Designed and developed the music platform interface.
* Implemented React pages and reusable UI components.
* Integrated Supabase authentication and PostgreSQL-backed application data.
* Implemented artist profiles, track management, playlists, likes, follows, and reviews.
* Integrated MetaMask wallet connectivity using ethers.js.
* Implemented blockchain-based artist tipping and transaction tracking.
* Built artist dashboard functionality for monitoring tracks, plays, followers, and tips.

## Security Considerations

The application uses Supabase Row Level Security policies to control access to user-owned data.

Examples include:

* Users can only modify their own profiles.
* Artists can manage only their own tracks.
* Playlist owners control their own playlists.
* Users can manage their own likes and reviews.
* Tip records have sender/artist access restrictions.

Wallet transactions are initiated through the user's connected wallet rather than exposing private keys to the application.

## Future Improvements

* Deploy smart contracts to a production network
* Add decentralized music storage
* Improve on-chain transaction verification
* Add artist revenue analytics
* Add richer music recommendation features
* Add decentralized identity/profile options
* Improve transaction persistence and synchronization
* Add automated end-to-end testing

## Repository

[GitHub Repository](https://github.com/yashasA9/audio-atlas-link)
