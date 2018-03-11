const clientId = 'f5ca0881af1140a2824ef359c0f7bc4f';
/*const redirectUri = 'http://localhost:3000/';*/
const redirectUri = 'https://jammmgted.surge.sh';

let accToken = '';
let expTime = '';

const Spotify = {
  getAccessToken(){
    if(accToken){
      return accToken;
    }

    const accessToken = window.location.href.match(/access_token=([^&]*)/);
    const accessExpTime = window.location.href.match(/expires_in=([^&]*)/);
    if(accessToken && accessExpTime){
      accToken = accessToken[1];
      expTime = Number(accessExpTime[1]);
      window.setTimeout(() => accToken = '', expTime * 1000);
      window.history.pushState('Access Token', null, '/');
      return accToken;
    }
    else {
      const urlSpot = `https://accounts.spotify.com/authorize?client_id=${clientId}&redirect_uri=${redirectUri}&scope=playlist-modify-public&response_type=token`;
      window.location = urlSpot;
    }
  },

  search(term){
    const accssTkn = accToken;
    if (accssTkn.length === 0){
      Spotify.getAccessToken();
    }

    return fetch(`https://api.spotify.com/v1/search?type=track&q=${term}`, {
      headers: {
        Authorization: `Bearer ${accToken}`
      }
    }).then(
      response => {
        return response.json();
    }).then(
      jsonResponse => {
      if(jsonResponse.tracks) {
        return jsonResponse.tracks.items.map(track => ({
            id: track.id,
            name: track.name,
            artist: track.artists[0].name,
            album: track.album.name,
            uri: track.uri
          }));

      } else {
        return [];
      }
    });
  },

  savePlaylist(playlistName, trackURIs){
    if(!playlistName || !trackURIs) {
      return;
    }
    const tokenAccess = accToken;
    const headers = {
      Authorization: `Bearer ${tokenAccess}`
    }
    let userId;

    fetch('https://api.spotify.com/v1/me', {
      headers: headers
    }).then(
      response => {
        return response.json();
      }
    ).then(
      jsonResponse => {
        userId = jsonResponse.id;
        fetch(`https://api.spotify.com/v1/users/${userId}/playlists`, {
          headers: headers,
          method: 'POST',
          body: JSON.stringify({name: playlistName})
        }).then(
          response => {
            return response.json();
          }
        ).then(
          jsonResponse => {
            let playlistId = jsonResponse.id;

            return fetch(`https://api.spotify.com/v1/users/${userId}/playlists/${playlistId}/tracks`, {
              headers: headers,
              method: 'POST',
              body: JSON.stringify({ uris: trackURIs})
            })
          }
        );
      }
    );

  }
};

export default Spotify;
