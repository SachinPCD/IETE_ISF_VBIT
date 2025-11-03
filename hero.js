        var slideIndex = 0;
        var slides = document.getElementsByClassName("slideh");

        function showSlide() {
            for (var i = 0; i < slides.length; i++) {
                slides[i].style.display = "none";
            }
            slides[slideIndex].style.display = "block";
            slideIndex++;
            if (slideIndex >= slides.length) { slideIndex = 0; }
        }

        showSlide();
        setInterval(showSlide, 7000); // Change slide every 10 seconds