(function () {
  var button = document.querySelector('[data-stream]');
  var video = document.getElementById('video-player');

  if (!button || !video) {
    return;
  }

  var attached = false;
  var player = null;

  function attachStream() {
    if (attached) {
      return;
    }

    var url = button.getAttribute('data-stream');

    if (window.Hls && window.Hls.isSupported()) {
      player = new window.Hls({
        enableWorker: true,
        lowLatencyMode: true
      });
      player.loadSource(url);
      player.attachMedia(video);
    } else {
      video.src = url;
    }

    attached = true;
  }

  function beginPlay() {
    attachStream();
    button.classList.add('is-hidden');

    var request = video.play();
    if (request && typeof request.catch === 'function') {
      request.catch(function () {
        button.classList.remove('is-hidden');
      });
    }
  }

  button.addEventListener('click', beginPlay);

  video.addEventListener('play', function () {
    button.classList.add('is-hidden');
  });

  video.addEventListener('pause', function () {
    if (video.currentTime === 0 || video.ended) {
      button.classList.remove('is-hidden');
    }
  });

  window.addEventListener('beforeunload', function () {
    if (player && typeof player.destroy === 'function') {
      player.destroy();
    }
  });
})();
