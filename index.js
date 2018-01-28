$(document).ready(main);

function timeToSeconds(time) {
  var parts = time.split(':');
  if (parts.length > 1) {
    return parseInt(parts [0]) * 60 + parseInt(parts [1]);
  }
  return parseInt(parts[0]);
}

function urlToId(url) {
  var videoId = url.split('v=')[1];
  var ampersandPosition = videoId.indexOf('&');
  if(ampersandPosition != -1) {
    videoId = videoId.substring(0, ampersandPosition);
  }
  return videoId;
}

var player;
var interval;
function main() {
  $('#startWorkout').attr('disabled', false);
  $('#workoutForm').submit(function(e) {
    e.preventDefault();
    player && player.destroy();
    interval && clearInterval(interval);
    var loopCount = 1;
    var videoUrl = $('#workoutVideo').val();
    var startTime = $('#startTime').val();
    var endTime = $('#endTime').val();
    var breakTime = (parseInt($('#breakTime').val()) || 10) * 1000;
    var shouldMute = $('#muteVideo').is(':checked');

    if (!videoUrl || !startTime || !endTime) {
      alert('Workout Video, Start Time, and End Time are Required.');
      return;
    }

    var videoId = urlToId(videoUrl);
    var startSecs = timeToSeconds(startTime);
    var endSecs = timeToSeconds(endTime);

    player = new YT.Player('player', {
      height: $(window).height() - $('#workoutForm').outerHeight(),
      width: $(window).width(),
      videoId: videoId,
      playerVars: {
        start: timeToSeconds(startTime)
      },
      events: {
        'onReady': function() {
          player.unMute();
          if(shouldMute) {
            player.mute();
          }
          player.playVideo();
        }
      }
    });

    interval = setInterval(function() {
      var currentSecs = player.getCurrentTime();
      if (currentSecs >= endSecs) {
        player.pauseVideo();
        player.seekTo(startSecs, true);
        setTimeout(function() {
          player.playVideo();
        }, breakTime);
      }
    }, 1000);
  });
}
