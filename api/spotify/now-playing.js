
export default async function handler(req, res) {
  const { SPOTIFY_CLIENT_ID: client_id, SPOTIFY_CLIENT_SECRET: client_secret, SPOTIFY_REFRESH_TOKEN: refresh_token } = process.env;

  if (!client_id || !client_secret || !refresh_token) {
    return res.status(200).json({ isPlaying: false, message: "Missing Spotify credentials" });
  }

  const basic = Buffer.from(`${client_id}:${client_secret}`).toString("base64");
  
  try {
    // 1. Get Access Token
    const tokenResponse = await fetch("https://accounts.spotify.com/api/token", {
      method: "POST",
      headers: {
        Authorization: `Basic ${basic}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        grant_type: "refresh_token",
        refresh_token,
      }),
    });

    const tokenData = await tokenResponse.json();
    
    if (!tokenResponse.ok) {
      return res.status(200).json({ isPlaying: false, message: "Token refresh failed" });
    }

    // 2. Fetch Now Playing
    const nowPlayingResponse = await fetch("https://api.spotify.com/v1/me/player/currently-playing", {
      headers: {
        Authorization: `Bearer ${tokenData.access_token}`,
      },
    });

    if (nowPlayingResponse.status === 204 || nowPlayingResponse.status > 400) {
      return res.status(200).json({ isPlaying: false });
    }

    const song = await nowPlayingResponse.json();

    if (song.item === null || !song.is_playing) {
      return res.status(200).json({ isPlaying: false });
    }

    return res.status(200).json({
      isPlaying: true,
      title: song.item.name,
      artist: song.item.artists.map((_artist) => _artist.name).join(", "),
      album: song.item.album.name,
      albumImageUrl: song.item.album.images[0]?.url || "",
      songUrl: song.item.external_urls.spotify,
    });
  } catch (error) {
    console.error("Spotify API Error:", error);
    return res.status(200).json({ isPlaying: false, message: "Server error" });
  }
}
