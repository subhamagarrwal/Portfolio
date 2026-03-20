# Portfolio Website

A v2 of the earlier vibecoded portfolio, built with React, TypeScript, and Tailwind CSS. Worked on dynamic time-based theming, glassmorphism design and the interactive time dialer. The project is a showcase of my frontend development skills, creativity, and attention to detail.

## Features

- Dynamic time-based theming (light/dark mode)
- Glassmorphism design elements
- Interactive time dialer for theme switching
- Responsive design for various screen sizes
- Showcases projects, skills, and contact information

## Technologies Used
- React
- TypeScript
- Tailwind CSS
- Vite
- Vercel(deployment)

## Installation
1. Clone the repository:
   ```bash
   git clone
    ```
2. Navigate to the project directory:

    ```bash
    cd portfolio
    ```

3. Install dependencies:
    ```bash
    npm install
    ```
4. Start the development server:
    ```bash
    npm run dev
    ```

## Spotify Integration

The portfolio includes a Spotify integration that displays the currently playing track. To set this up, you need to create a Spotify application and obtain the client ID, client secret, and refresh token. These credentials should be added to the `.env` file in the root of the project.
```
SPOTIFY_CLIENT_ID=your_client_id
SPOTIFY_CLIENT_SECRET=your_client_secret
SPOTIFY_REFRESH_TOKEN=your_refresh_token

```
Link to go to for obtaining Spotify credentials: [Spotify Developer Dashboard](https://developer.spotify.com/dashboard/applications)
You can obtain the refresh token from this link- make sure your app is deployed first:

https://accounts.spotify.com/authorize
?client_id=[CLIENT_ID]
&response_type=code
&redirect_uri=[REDIRECT_URI]
&scope=user-read-currently-playing



