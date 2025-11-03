var index = 0;
        var intervalId = setInterval(nextSlide, 2000); // Change slides every 2 seconds

        function nextSlide() {
            var slides = document.querySelectorAll('.slide');
            slides.forEach(function(slide, i) {
                slide.style.animation = 'none';
                slide.offsetHeight; /* trigger reflow */
                slide.style.animation = '';
                slide.classList.remove('active');
            });
            slides[(index + 0) % slides.length].classList.add('active');
            slides[(index + 1) % slides.length].classList.add('active');
            slides[(index + 2) % slides.length].classList.add('active');
            index++;
            index++;
            index++;
        }

        var container = document.getElementById('slide-container');
        container.addEventListener('mouseover', function() {
            clearInterval(intervalId);
        });
        container.addEventListener('mouseout', function() {
            intervalId = setInterval(nextSlide, 3500);
        });