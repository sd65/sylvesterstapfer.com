document.addEventListener('DOMContentLoaded', function() {

  // Variables to hold the current image index and the image data
  let currentIndex = 0;
  let images = [];

  // DOM elements
  const thumbnails = document.getElementById('thumbnails');
  const gallery = document.getElementById('gallery');
  const lightboxSidecar = document.getElementById('lightbox-sidecar');
  const lightboxImage = document.getElementById('currentImage');
  const lightboxTitle = document.getElementById('lightbox-title');
  const lightbox = document.getElementById('lightbox');
  const returnGalleryBtn = document.querySelector('#return-gallery-btn');
  const prevBtn = document.querySelector('#prev-btn');
  const nextBtn = document.querySelector('#next-btn');

  // Fetch image data from pics.json and generate the gallery
  fetch('https://pics.sylvesterstapfer.com/index.json')
    .then(response => response.json())
    .then(data => {
      images = data; // Store the images for later use (e.g., navigation)
      generateThumbnails(images); // Create thumbnail elements
      setUpLazyLoading(); // Initialize lazy loading for images
    })
    .catch(error => console.error('Error loading images:', error));

  /**
   * Generate thumbnail elements from the image data
   */
  function generateThumbnails(images) {
    images.forEach((image, index) => {
      const thumbnail = document.createElement('div');
      thumbnail.classList.add('thumbnail');
      thumbnail.setAttribute('data-index', index);
      thumbnail.setAttribute('title', image.title);

      // Create an img element for the thumbnail
      const img = document.createElement('img');
      img.dataset.src = `https://pics.sylvesterstapfer.com/p/${image.filename}_thumbnail.jpg`; // Use data-src for lazy loading
      img.alt = image.title;
      img.classList.add('lazy-image');
      thumbnail.appendChild(img);

      // Add click event to open lightbox
      thumbnail.addEventListener('click', () => openLightbox(index));
      thumbnails.appendChild(thumbnail);
    });
  }

  /**
   * Set up lazy loading for images using IntersectionObserver
   */
  function setUpLazyLoading() {
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

    const lazyImages = document.querySelectorAll('img.lazy-image');
    lazyImages.forEach(image => lazyLoadObserver.observe(image));
  }

  /**
   * Open the lightbox with the selected image
   * @param {number} index - The index of the image to display
   */
  function openLightbox(index) {
    currentIndex = index; // Update current image index
    setLightboxImage(currentIndex); // Set the lightbox image
    lightbox.classList.remove('hidden'); // Show the lightbox
    gallery.classList.add('hidden'); // Hide the gallery
    lightboxSidecar.classList.remove('hidden'); // Show navigation controls
  }

  /**
   * Set the lightbox image based on the current index
   * @param {number} index - The index of the image to display
   */
  function setLightboxImage(index) {
    lightboxImage.src = `https://pics.sylvesterstapfer.com/p/${images[index].filename}.jpg`; // Update image source
    lightboxTitle.innerText = images[index].title; // Update image title
  }

  /**
   * Close the lightbox and return to the gallery view
   */
  function closeLightbox() {
    lightbox.classList.add('hidden'); // Hide the lightbox
    lightboxSidecar.classList.add('hidden'); // Hide navigation controls
    gallery.classList.remove('hidden'); // Show the gallery
  }

  /**
   * Navigate through the lightbox images
   * @param {number} direction - Direction to navigate (-1 for prev, 1 for next)
   */
  function navigateLightbox(direction) {
    currentIndex = (currentIndex + direction + images.length) % images.length; // Loop through images
    setLightboxImage(currentIndex); // Set the new image
  }

  /**
   * Event listeners
   */
  
  // Close the lightbox when clicking the "return to gallery" button
  returnGalleryBtn.addEventListener('click', closeLightbox);

  // Close the lightbox if clicking outside the image
  lightbox.addEventListener('click', function(event) {
    if (event.target !== lightboxImage) {
      closeLightbox();
    }
  });

  // Navigate images with "previous" and "next" buttons
  prevBtn.addEventListener('click', () => navigateLightbox(-1));
  nextBtn.addEventListener('click', () => navigateLightbox(1));

  // Navigate images with left and right arrow keys
  document.addEventListener('keydown', function(event) {
    if (!lightbox.classList.contains('hidden')) { // Only navigate if lightbox is visible
      if (event.key === 'ArrowLeft') {
        navigateLightbox(-1);
      } else if (event.key === 'ArrowRight') {
        navigateLightbox(1);
      }
    }
  });

});
