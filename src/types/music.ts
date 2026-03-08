export interface Track {
  id: string;
  title: string;
  artist: string;
  artistId: string;
  genre: string;
  coverArt: string;
  duration: number; // seconds
  playCount: number;
  liked: boolean;
  ipfsHash?: string;
}

export interface Artist {
  id: string;
  name: string;
  avatar: string;
  banner: string;
  bio: string;
  followers: number;
  totalTips: number;
  walletAddress: string;
  tracks: Track[];
}

export interface Playlist {
  id: string;
  name: string;
  coverArt: string;
  trackCount: number;
  tracks: Track[];
}
