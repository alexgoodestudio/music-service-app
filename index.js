class Song {
    constructor(track,artist){
        this.track = track;
        this.artist = artist;
        this.comments =[];     
    }
    addComment(area){
        this.comments.push(new Comment(area));
    }
}
class Comment {
    constructor(area){
        this.area = area;
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
    static addComment(id){
        for(let song of this.songs){
            if(song._id == id){
                song.comments.push(new Comment($(`#${song._id}-comment-area`).val()));
                SongService.updateSong(song)
                .then(() => {
                    return SongService.getAllSongs();
                })
                .then((songs)=> this.render(songs));

            } 
        }
    }


    static render(songs){
      this.songs = songs;
      $('#app').empty();
      for(let song of songs){
        $('#app').prepend(`
            <div id="${song._id}" class="card border-warning">
                <div class="card-header border-success">
                    <h2>${song.track}</h2>
                    <button class="btn btn-warning" onclick="DOMManager.deleteSong('${song.id}')">Delete</button>
                </div>
                <div class="card-body">
                    <div class="card ">
                        <h4>${song.artist}</h4>
                                <input type ="text" id="${song._id}-comment-area" class="form-control mx-auto w-50 my-3" placeholder="Comment">
                        <button id="(${song._id})-new-comment" onclick="DOMManager.addComment('${song._id}')" class="btn btn-primary form-control my-4 w-25 mx-auto">Add</button>
                    </div>

            </div>
        </div><br>`
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

