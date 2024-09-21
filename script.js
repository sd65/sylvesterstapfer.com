document.addEventListener('DOMContentLoaded', function() {
  let currentIndex = 0;
  let images = [];
  const thumbnails = document.getElementById('thumbnails');
  const gallery = document.getElementById('gallery');

  // Fetch the pics.json file and generate the gallery
  fetch('pics.json')
    .then(response => response.json())
    .then(data => {
      images = data; // Store the images for later use (e.g., for navigation)

      // Loop through the images and create thumbnail elements
      images.forEach((image, index) => {
        const thumbnail = document.createElement('div');
        thumbnail.classList.add('thumbnail');
        thumbnail.setAttribute('data-index', index);
        thumbnail.style.backgroundImage = `url(${image.src})`;
        thumbnail.setAttribute('title', image.title);
        
        // Add click event to open lightbox
        thumbnail.addEventListener('click', function() {
          openLightbox(index);
        });

        thumbnails.appendChild(thumbnail);
      });
    })
    .catch(error => console.error('Error loading images:', error));

  // Function to open the lightbox
  function openLightbox(index) {
    currentIndex = index; // Update current index
    const lightbox = document.getElementById('lightbox');
    const lightboxImage = document.getElementById('currentImage');

    lightboxImage.style.backgroundImage = `url(${images[currentIndex].src})`;
    lightbox.classList.remove('hidden');
    gallery.classList.add('hidden');
  }

  // Function to close the lightbox
  document.getElementById('lightbox').addEventListener('click', function() {
    this.classList.add('hidden');
    gallery.classList.remove('hidden');
  });

  // Navigation buttons functionality
  document.querySelector('.prev-btn').addEventListener('click', function() {
    navigateLightbox(-1);
  });

  document.querySelector('.next-btn').addEventListener('click', function() {
    navigateLightbox(1);
  });

  // Function to navigate through lightbox images
  function navigateLightbox(direction) {
    currentIndex = (currentIndex + direction + images.length) % images.length; // Loop around if at start or end
    const lightboxImage = document.getElementById('currentImage');
    lightboxImage.style.backgroundImage = `url(${images[currentIndex].src})`;
  }
});
