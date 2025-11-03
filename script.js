// Add this JavaScript code to handle the button click and redirect to the new page

document.getElementById("readMoreBtn").addEventListener("click", function() {
    window.location.href = "newpage.html"; // Change "newpage.html" to the actual URL of your new page
});
function showText() {
    //shows the #more
    document.getElementById('more').style.display = "block";
    //hides the link
    document.getElementById('link').style.display = "none";
  }
  
  function showText2() {
    //shows the #more
    document.getElementById('more2').style.display = "block";
    //hides the link
    document.getElementById('link2').style.display = "none";
  }
  function showText3() {
    //shows the #more
    document.getElementById('more3').style.display = "block";
    //hides the link
    document.getElementById('link3').style.display = "none";
  }
  function showText1() {
    //shows the #more
    document.getElementById('more1').style.display = "block";
    //hides the link
    document.getElementById('link1').style.display = "none";
  }
  let images = document.querySelectorAll('img');
  images.forEach(img => {
    img.addEventListener('mouseover', () => {
      images.forEach(img => img.classList.remove('active'));
      img.classList.add('active');
    });
  });
  