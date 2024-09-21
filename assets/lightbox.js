document.addEventListener('DOMContentLoaded', function() {


  let currentIndex = 0;
  let images = [];
  const thumbnails = document.getElementById('thumbnails');
  const gallery = document.getElementById('gallery');
  const lightboxSidecar = document.getElementById('lightbox-sidecar');
  const lightboxImage = document.getElementById('currentImage');
  const lightboxTitle = document.getElementById('lightbox-title');

  // Fetch the pics.json file and generate the gallery
fetch('pics.json')
  .then(response => response.json())
  .then(data => {
    images = data; // Store the images for later use (e.g., for navigation)
    const thumbnailsContainer = document.getElementById('thumbnails'); // Get your container

    // Loop through the images and create thumbnail elements
    images.forEach((image, index) => {
      const thumbnail = document.createElement('div');
      thumbnail.classList.add('thumbnail');
      thumbnail.setAttribute('data-index', index);
      thumbnail.setAttribute('title', image.title);

      // Use a placeholder image to display before lazy loading
      const img = document.createElement('img');
      img.dataset.src = image.src; // Set data-src for lazy loading
      img.alt = image.title;
      img.src = 'assets/1.jpg'; // Placeholder image until real image is loaded
      img.classList.add('lazy-image');
      thumbnail.appendChild(img);

      // Add click event to open lightbox
      thumbnail.addEventListener('click', function() {
        openLightbox(index);
      });

      thumbnailsContainer.appendChild(thumbnail);
    });

    // Set up the lazy loading observer
    const lazyLoadObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const img = entry.target;
          img.src = img.dataset.src; // Load the actual image
          img.classList.remove('lazy-image');
          observer.unobserve(img); // Stop observing once the image is loaded
        }
      });
    });

    // Observe all images for lazy loading
    const lazyImages = document.querySelectorAll('img.lazy-image');
    lazyImages.forEach(image => lazyLoadObserver.observe(image));
  })
  .catch(error => console.error('Error loading images:', error));


  // Function to open the lightbox
  function openLightbox(index) {
    currentIndex = index; // Update current index
    const lightbox = document.getElementById('lightbox');
    setLightboxImage(index)
    // Set the src attribute of the img tag to the selected image
    lightbox.classList.remove('hidden');
    gallery.classList.add('hidden');
    lightboxSidecar.classList.remove('hidden');
  }

  function setLightboxImage(index) {
      console.log(currentIndex);
      lightboxImage.src = images[currentIndex].src;
      lightboxTitle.innerText = images[currentIndex].title;
  }



  // Function to close the lightbox
  function closeLightbox() {
    lightbox.classList.add('hidden');
    lightboxSidecar.classList.add('hidden');
    gallery.classList.remove('hidden');
  }
  document.querySelector('#return-gallery-btn').addEventListener('click', function() {
    closeLightbox();
  });
  lightbox.addEventListener('click', function(event) {
  if (event.target !== currentImage) {
    closeLightbox();
  }
});


  // Navigation buttons functionality
  document.querySelector('#prev-btn').addEventListener('click', function() {
    navigateLightbox(-1);
  });

  document.querySelector('#next-btn').addEventListener('click', function() {
    navigateLightbox(1);
  });


  document.addEventListener('keydown', function(event) {
    if (!lightbox.classList.contains('hidden')) { // Only if the lightbox is visible
      if (event.key === 'ArrowLeft') {
        navigateLightbox(-1);
      } else if (event.key === 'ArrowRight') {
        navigateLightbox(1);
      }
    }
  });

  // Function to navigate through lightbox images
  function navigateLightbox(direction) {
    currentIndex = (currentIndex + direction + images.length) % images.length; // Loop around if at start or end
    setLightboxImage(currentIndex)
  }

  
});
