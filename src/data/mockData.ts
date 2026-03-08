import { Track, Artist, Playlist } from "@/types/music";

// Generate deterministic UUIDs for mock data so they work with the database
function mockUUID(prefix: string, index: number): string {
  const hex = index.toString(16).padStart(4, "0");
  return prefix === "track"
    ? `00000000-0000-4000-a000-00000000${hex}`
    : `00000000-0000-4000-b000-00000000${hex}`;
}
const covers = [
  "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=300&h=300&fit=crop",
  "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=300&h=300&fit=crop",
  "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=300&h=300&fit=crop",
  "https://images.unsplash.com/photo-1514320291840-2e0a9bf2a9ae?w=300&h=300&fit=crop",
  "https://images.unsplash.com/photo-1459749411175-04bf5292ceea?w=300&h=300&fit=crop",
  "https://images.unsplash.com/photo-1504898770365-14faca6a7320?w=300&h=300&fit=crop",
  "https://images.unsplash.com/photo-1526478806334-5fd488fcaabc?w=300&h=300&fit=crop",
  "https://images.unsplash.com/photo-1571330735066-03aaa9429d89?w=300&h=300&fit=crop",
];

const avatars = [
  "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&h=150&fit=crop",
  "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop",
  "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop",
  "https://images.unsplash.com/photo-1527980965255-d3b416303d12?w=150&h=150&fit=crop",
];

const banners = [
  "https://images.unsplash.com/photo-1501386761578-eac5c94b800a?w=1200&h=400&fit=crop",
  "https://images.unsplash.com/photo-1524368535928-5b5e00ddc76b?w=1200&h=400&fit=crop",
  "https://images.unsplash.com/photo-1506157786151-b8491531f063?w=1200&h=400&fit=crop",
];

const genres = ["Electronic", "Hip Hop", "Lo-Fi", "Ambient", "Indie", "Pop", "R&B", "Jazz"];

const trackNames = [
  "Neon Dreams", "Digital Sunrise", "Crypto Waves", "Chain Reaction",
  "Block Party", "Decentralized", "Token of Love", "Hash Function",
  "Smart Contract", "Gas Fee Blues", "Mint Condition", "Stake Your Claim",
  "Web3 Lullaby", "DeFi Groove", "NFT Symphony", "Validator",
  "Consensus", "Genesis Block", "Zero Knowledge", "Proof of Work",
];

const artistNames = ["CryptoBeats", "BlockchainBabe", "DeFi Diva", "NFT Ninja", "Hash Hero", "Web3 Wizard"];

export const mockTracks: Track[] = trackNames.map((title, i) => ({
  id: `track-${i}`,
  title,
  artist: artistNames[i % artistNames.length],
  artistId: `artist-${i % artistNames.length}`,
  genre: genres[i % genres.length],
  coverArt: covers[i % covers.length],
  duration: 180 + Math.floor(Math.random() * 120),
  playCount: Math.floor(Math.random() * 50000),
  liked: Math.random() > 0.6,
}));

export const mockArtists: Artist[] = artistNames.map((name, i) => ({
  id: `artist-${i}`,
  name,
  avatar: avatars[i % avatars.length],
  banner: banners[i % banners.length],
  bio: "Pioneering the future of decentralized music. Creating sounds that live forever on the blockchain.",
  followers: Math.floor(Math.random() * 10000),
  totalTips: parseFloat((Math.random() * 5).toFixed(2)),
  walletAddress: `0x${Array.from({ length: 8 }, () => Math.floor(Math.random() * 16).toString(16)).join("")}...`,
  tracks: mockTracks.filter((t) => t.artistId === `artist-${i}`),
}));

export const mockPlaylists: Playlist[] = [
  { id: "pl-1", name: "Web3 Vibes", coverArt: covers[0], trackCount: 12, tracks: mockTracks.slice(0, 5) },
  { id: "pl-2", name: "DeFi Chill", coverArt: covers[2], trackCount: 8, tracks: mockTracks.slice(5, 10) },
  { id: "pl-3", name: "NFT Bangers", coverArt: covers[4], trackCount: 15, tracks: mockTracks.slice(10, 15) },
  { id: "pl-4", name: "Blockchain Beats", coverArt: covers[6], trackCount: 10, tracks: mockTracks.slice(3, 8) },
];

export const trendingTracks = mockTracks.slice(0, 8);
export const newReleases = mockTracks.slice(8, 16);
export const recommendedArtists = mockArtists.slice(0, 4);
