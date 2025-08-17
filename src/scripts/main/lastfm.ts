export interface LastFmData {
  recenttracks: Recenttracks;
}

export interface Recenttracks {
  track: Track[];
  "@attr": Attr;
}

export interface Track {
  artist: Artist;
  mbid: string;
  name: string;
  image: Image2[];
  streamable: string;
  album: Album;
  url: string;
  loved: string;
  nowplaying: string;
  date?: Date;
}

export interface Artist {
  url: string;
  name: string;
  image: Image[];
  mbid: string;
}

export interface Image {
  size: string;
  "#text": string;
}

export interface Image2 {
  size: string;
  "#text": string;
}

export interface Album {
  mbid: string;
  "#text": string;
  isnsfw: boolean;
}

export interface Date {
  uts: string;
  "#text": string;
}

export interface Attr {
  user: string;
  totalPages: string;
  page: string;
  perPage: string;
  total: string;
}

// ---

const WS_URL = "wss://scrobbled.tepiloxtl.net/ws/get_last_track/lelillumina";
const DEFAULT_NO_ART = "/images/nekofm/NoArt.png";
const DEFAULT_NSFW_COVER = "/images/nekofm/NSFWCOVER.png";
const LASTFM_DEFAULT_IMG =
  "https://lastfm.freetls.fastly.net/i/u/2a96cbd8b46e442fc41c2b86b821562f.png";

const lastFmStatus = document.getElementById(
  "lastfm-status",
) as HTMLHeadingElement;

const trackNameEl = document.querySelector("#trackName") as HTMLHeadingElement;
const artistNameEl = document.querySelector(
  "#artistName",
) as HTMLParagraphElement;
const coverImgEl = document.querySelector("#trackCover") as HTMLImageElement;

async function openWebSocket(url: string): Promise<WebSocket> {
  const socket = new WebSocket(url);
  await new Promise<void>((resolve, reject) => {
    socket.addEventListener("open", () => resolve());
    socket.addEventListener("error", (err) => reject(err));
  });
  return socket;
}

async function handleMessage(event: MessageEvent) {
  let data: LastFmData;
  try {
    data = JSON.parse(event.data);
  } catch (error) {
    console.error("Failed to parse message:", error);
    return;
  }

  const track = data.recenttracks.track[0];
  if (!track) return;

  // Update online status display
  lastFmStatus.textContent =
    track.nowplaying === "false" ? "Last Played" : "Now Playing";

  // Determine cover image URL based on NSFW flag and default art fallback
  let coverImgUrl = track.album.isnsfw
    ? DEFAULT_NSFW_COVER
    : track.image[2]["#text"];
  if (coverImgUrl === LASTFM_DEFAULT_IMG) coverImgUrl = DEFAULT_NO_ART;

  // Update track details in DOM
  trackNameEl.textContent = track.name;
  artistNameEl.textContent = `by ${track.artist.name}`;
  coverImgEl.src = coverImgUrl || DEFAULT_NO_ART;
}

export async function initLastFmSocket() {
  try {
    const socket = await openWebSocket(WS_URL);
    socket.addEventListener("message", handleMessage);
  } catch (error) {
    console.error("WebSocket connection error:", error);
  }
}

// Initialize connection immediately
initLastFmSocket();
