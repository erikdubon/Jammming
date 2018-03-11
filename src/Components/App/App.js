import React, { Component } from 'react';
import './App.css';

import SearchBar from '../SearchBar/SearchBar';
import SearchResults from '../SearchResults/SearchResults';
import Playlist from '../Playlist/Playlist';
import Spotify from '../../util/Spotify';

class App extends Component {
  constructor(props){
    super(props);

    this.state ={
      searchResults: [],

      playlistName: '',

      playlistTracks:[]
    };

    this.addTrack = this.addTrack.bind(this);
    this.removeTrack = this.removeTrack.bind(this);
    this.updatePlaylistName = this.updatePlaylistName.bind(this);
    this.savePlaylist = this.savePlaylist.bind(this);
    this.search = this.search.bind(this);
  }

  addTrack(track){
    let findSong = this.state.playlistTracks.find(arrayTrack => arrayTrack.id === track.id)
    if(!findSong) {
      let newPlaylistTracks = this.state.playlistTracks.concat(track);
      this.setState({ playlistTracks: newPlaylistTracks });
    }
  }

  removeTrack(track){
    let newRemovedSongPlayList = this.state.playlistTracks.filter(arrayTrack => arrayTrack.id !== track.id);
    this.setState({ playlistTracks: newRemovedSongPlayList})
  }

  updatePlaylistName(name){
    this.setState({playlistName: name});
  }

  savePlaylist(){
    const trackURIs = this.state.playlistTracks.map(track => track.uri);
    Spotify.savePlaylist(this.state.playlistName, trackURIs);
    this.setState({
        playlistName: 'New Playlist',
        playlistTracks: []
      });
  }

  search(term){
    Spotify.search(term).then(
      newSearchResults => {this.setState({ searchResults: newSearchResults })}
    );
  }

  render() {
    return (
      <div>
        <h1>Ja<span className="highlight">mmm</span>ing</h1>
        <div className="App">
          <SearchBar onSearch={this.search} />
          <div className="App-playlist">
            <SearchResults searchResults={this.state.searchResults} onAdd={this.addTrack} />
            <Playlist playlistName={this.state.playlistName} playlistTracks={this.state.playlistTracks} onRemove={this.removeTrack} onNameChange={this.updatePlaylistName} name={this.state.playlistName} onSave={this.savePlaylist} />
          </div>
        </div>
      </div>
    );
  }
}

export default App;
