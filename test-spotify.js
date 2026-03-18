
import * as dotenv from "dotenv"; import { fileURLToPath } from "url"; import path from "path";
dotenv.config();

async function run() {
  const { SPOTIFY_CLIENT_ID: client_id, SPOTIFY_CLIENT_SECRET: client_secret, SPOTIFY_REFRESH_TOKEN: refresh_token } = process.env;
  if (!client_id || !client_secret || !refresh_token) {
    console.log("Missing env vars!");
    return;
  }
  const basic = Buffer.from(`${client_id}:${client_secret}`).toString("base64");
  try {
    const tokenResponse = await fetch("https://accounts.spotify.com/api/token", {
      method: "POST",
      headers: { Authorization: `Basic ${basic}`, "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({ grant_type: "refresh_token", refresh_token }),
    });
    const tokenData = await tokenResponse.json();
    if (!tokenResponse.ok) {
      console.log("Token refresh failed:", tokenData);
      return;
    }
    const nowPlayingResponse = await fetch("https://api.spotify.com/v1/me/player/currently-playing", {
      headers: { Authorization: `Bearer ${tokenData.access_token}` },
    });
    if (nowPlayingResponse.status === 204 || nowPlayingResponse.status > 400) {
      console.log("Status:", nowPlayingResponse.status, "- Not playing");
      return;
    }
    const song = await nowPlayingResponse.json();
    console.log("Is Playing:", song.is_playing);
    console.log("Title:", song.item?.name);
    console.log("Artist:", song.item?.artists?.map(a => a.name).join(", "));
  } catch (err) {
    console.error(err);
  }
}
run();
