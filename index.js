class Song {
    constructor(track,artist){
        this.track = track;
        this.artist = artist;
    }
 }

 class SongService{
    static url = 'https://640a826981d8a32198c9bec9.mockapi.io/playlist';

    static getAllSongs(){
        return $.get(this.url);
    }
    static getSong(id){
        return $.get(this.url + `/${id}`);
    }
    static createSong(song){
        return $.post(this.url, song)
    }
    static updateSong(song){
        return $.ajax({
            url: this.url + `/${song.id}`,
            dataType:'json',
            data: JSON.stringify(song),
            contentType:'application/json',
            type:'PUT'
        });
    }
    static deleteSong(id){
        return $.ajax({
            url: this.url + `/${id}`,
            type:'DELETE'
        });
    }
}

class DOMManager{
    static songs;

    static getAllSongs(){
        SongService.getAllSongs().then(songs => this.render(songs));
    }

    static createSong(artist, track){
        SongService.createSong(new Song(artist,track))
        .then(() => {
            return SongService.getAllSongs();
        })
        .then((songs) => this.render(songs));
    }

    static deleteSong(id){
        SongService.deleteSong(id)
        .then(() => {
            return SongService.getAllSongs();
        })
        .then((songs) => this.render(songs));
    }



    static render(songs){
      this.songs = songs;
      $('#app').empty();
      for(let song of songs){
        $('#app').prepend(`
            <div id="${song.id}" class="card border-warning">
                <div class="card-header border-success">
                    <h2>${song.track}</h2>
                    <button class="btn btn-warning" onclick="DOMManager.deleteSong('${song.id}')">Delete</button>
                </div>
                <div class="card-body">
                    <div class="card ">
                        <div class="row">
                        <h4>${song.artist}</h4>
                        </div>
                    </div>
                </div>
            </div>
            <br>`
            );
        }
    }
}
$("#create-new-song").click(() => {
    DOMManager.createSong($("#new-song-track").val(),$("#new-song-artist").val());
    $("#new-song-track").val("");
    $("#new-song-artist").val("");
});

DOMManager.getAllSongs();

