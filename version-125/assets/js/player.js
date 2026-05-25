(function () {
    function attachPlayer(shell) {
        var video = shell.querySelector('.site-video');
        var button = shell.querySelector('[data-play-video]');
        if (!video || !button) {
            return;
        }
        var hasStarted = false;

        function playVideo() {
            var source = video.getAttribute('data-src');
            if (!source) {
                return;
            }
            button.classList.add('is-hidden');
            video.style.display = 'block';

            if (hasStarted) {
                video.play().catch(function () {});
                return;
            }
            hasStarted = true;

            if (window.Hls && window.Hls.isSupported()) {
                var hls = new window.Hls({
                    enableWorker: true,
                    lowLatencyMode: true
                });
                hls.loadSource(source);
                hls.attachMedia(video);
                hls.on(window.Hls.Events.MANIFEST_PARSED, function () {
                    video.play().catch(function () {});
                });
            } else {
                video.src = source;
                video.addEventListener('loadedmetadata', function () {
                    video.play().catch(function () {});
                }, { once: true });
                video.load();
            }
        }

        button.addEventListener('click', playVideo);
    }

    document.addEventListener('DOMContentLoaded', function () {
        Array.prototype.slice.call(document.querySelectorAll('.player-shell')).forEach(attachPlayer);
    });
})();
