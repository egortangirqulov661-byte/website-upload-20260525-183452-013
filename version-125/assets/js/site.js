(function () {
    function normalize(value) {
        return String(value || '').trim().toLowerCase();
    }

    function setupMobileMenu() {
        var toggle = document.querySelector('[data-menu-toggle]');
        var menu = document.querySelector('[data-menu]');
        if (!toggle || !menu) {
            return;
        }
        toggle.addEventListener('click', function () {
            menu.classList.toggle('is-open');
        });
    }

    function setupHeroSlider() {
        var root = document.querySelector('[data-hero-slider]');
        if (!root) {
            return;
        }
        var slides = Array.prototype.slice.call(root.querySelectorAll('.hero-slide'));
        var dots = Array.prototype.slice.call(root.querySelectorAll('[data-slide-dot]'));
        if (slides.length < 2) {
            return;
        }
        var current = 0;
        var timer = null;

        function activate(index) {
            current = (index + slides.length) % slides.length;
            slides.forEach(function (slide, slideIndex) {
                slide.classList.toggle('is-active', slideIndex === current);
            });
            dots.forEach(function (dot, dotIndex) {
                dot.classList.toggle('is-active', dotIndex === current);
            });
        }

        function start() {
            stop();
            timer = window.setInterval(function () {
                activate(current + 1);
            }, 5200);
        }

        function stop() {
            if (timer) {
                window.clearInterval(timer);
                timer = null;
            }
        }

        dots.forEach(function (dot) {
            dot.addEventListener('click', function () {
                activate(Number(dot.getAttribute('data-slide-dot')) || 0);
                start();
            });
        });
        root.addEventListener('mouseenter', stop);
        root.addEventListener('mouseleave', start);
        start();
    }

    function setupFilters() {
        var roots = Array.prototype.slice.call(document.querySelectorAll('[data-filter-root]'));
        roots.forEach(function (root) {
            var input = root.querySelector('[data-card-filter]');
            var sortCards = root.querySelector('[data-sort-cards]');
            var sortRank = root.querySelector('[data-sort-rank]');
            var list = document.querySelector('[data-card-list]');
            if (!list) {
                return;
            }
            var items = Array.prototype.slice.call(list.children);
            items.forEach(function (item, index) {
                item.setAttribute('data-original-order', String(index));
            });

            function itemText(item) {
                return normalize(item.textContent + ' ' + Object.keys(item.dataset).map(function (key) {
                    return item.dataset[key];
                }).join(' '));
            }

            function applyFilter() {
                var query = normalize(input ? input.value : '');
                items.forEach(function (item) {
                    var hit = !query || itemText(item).indexOf(query) !== -1;
                    item.classList.toggle('is-filter-hidden', !hit);
                });
            }

            function sortList(mode) {
                var sorted = items.slice().sort(function (a, b) {
                    if (mode === 'year-desc') {
                        return Number(b.dataset.year || 0) - Number(a.dataset.year || 0);
                    }
                    if (mode === 'year-asc') {
                        return Number(a.dataset.year || 0) - Number(b.dataset.year || 0);
                    }
                    if (mode === 'title') {
                        return normalize(a.dataset.title).localeCompare(normalize(b.dataset.title), 'zh-Hans-CN');
                    }
                    if (mode === 'score-desc') {
                        var scoreA = Number((a.querySelector('.rank-score') || {}).textContent || 0);
                        var scoreB = Number((b.querySelector('.rank-score') || {}).textContent || 0);
                        return scoreB - scoreA;
                    }
                    return Number(a.dataset.originalOrder || 0) - Number(b.dataset.originalOrder || 0);
                });
                sorted.forEach(function (item) {
                    list.appendChild(item);
                });
            }

            if (input) {
                input.addEventListener('input', applyFilter);
                var params = new URLSearchParams(window.location.search);
                var q = params.get('q');
                if (q) {
                    input.value = q;
                    applyFilter();
                }
            }
            if (sortCards) {
                sortCards.addEventListener('change', function () {
                    sortList(sortCards.value);
                });
            }
            if (sortRank) {
                sortRank.addEventListener('change', function () {
                    sortList(sortRank.value);
                });
            }
        });
    }

    function markBrokenImages() {
        var images = Array.prototype.slice.call(document.querySelectorAll('img'));
        images.forEach(function (image) {
            image.addEventListener('error', function () {
                image.style.opacity = '0';
            }, { once: true });
        });
    }

    document.addEventListener('DOMContentLoaded', function () {
        setupMobileMenu();
        setupHeroSlider();
        setupFilters();
        markBrokenImages();
    });
})();
