$(document).on('ajaxStart',function(){
	$('.loading').show();
}).on('ajaxStop', function(){
	$('.loading').hide();
});

function timeConvert(millis) {
  var minutes = Math.floor(millis / 60000);
  var seconds = ((millis % 60000) / 1000).toFixed(0);
  return minutes + ":" + (seconds < 10 ? '0' : '') + seconds;
}

function audioPause() {
	$('audio').each(function(){
		$(this)[0].pause();
	});
}

function searchAlbum(id) {
	var artist = Handlebars.compile($('#template-artist').html());
	$.ajax({
		url: "https://api.spotify.com/v1/artists/" + id,
		dataType: "json",
		global: false
	}).done(function(artist_info){
		$('.extra-info').append(artist(artist_info));
	});
}

$('.track-search').on('keypress', function(e){
	if (e.which == 13) {
		var song = Handlebars.compile($('#template-track').html());
		var search = $(this).val();
		if (search != "") {
			$('tr').remove();
			$.getJSON("https://api.spotify.com/v1/search?q=" + search + "&type=track&limit=50" , function(lista){
				if (lista.tracks) {
					lista.tracks.items.forEach(function(track){
						actual_Song = {
						  image_url: track.album.images[1].url,
						  name: track.name,
						  artist: track.artists[0],
						  preview_url: track.preview_url,
						  rate: track.popularity,
						  album: track.album,
						  //album_url: track.album.external_urls.spotify,
						  duration: timeConvert(track.duration_ms),
						  spotify_url: track.external_urls.spotify
						}

						var Iartists = [];
						if (track.artists.length > 0) {
							for(var i = 1; i < track.artists.length; i++){
								Iartists[i] = track.artists[i];
							}
							actual_Song.inviteArtists = Iartists;
						}
						$('.table-principal tbody').append(song(actual_Song));
					});
				}
			});
		}
		$(this).val('');
		return false;
	}
});

$('table').on('mouseenter', 'tr', function(){
	$('.display-info').hide();
	$('.highlight').removeClass('highlight');
	audioPause();
	var conf = $(this).closest('.track')
	conf.find('.display-info').show();
	conf.addClass('highlight');
	//$(this).find('#track-preview')[0].play();
});

$('table').on('mouseleave', 'tr', function(){
	//var conf = $(this).closest('.track')
	//conf.find('.display-info').hide();
	//conf.removeClass('highlight');
	//$(this).find('#track-preview')[0].pause();
});

$('table').on('click', '.artist', function(){
	$('.extra-info').empty();
	$('.extra-info').show();
	var id = $(this).data('artist');
	searchAlbum(id);
});

$('table').on('click', '.link-artist', function(){
	$('.extra-info').show();
});

$('.extra-info').on('click', '.close-artist', function(){
	$('.extra-info').fadeOut();
});









