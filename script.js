document.addEventListener('DOMContentLoaded', function() {



  // Detect the user's browser language
  var userLang = navigator.language || navigator.userLanguage;

  // If the user's language starts with 'fr', switch to French
  if (userLang.startsWith('fr')) {
    // Hide English content
    document.querySelectorAll('.lang-en').forEach(function(el) {
      el.style.display = 'none';
    });

    // Show French content
    document.querySelectorAll('.lang-fr').forEach(function(el) {
      el.style.display = 'inline';
    });
  } else {
    // Otherwise, show English and hide French (default state)
    document.querySelectorAll('.lang-en').forEach(function(el) {
      el.style.display = 'inline';
    });

    document.querySelectorAll('.lang-fr').forEach(function(el) {
      el.style.display = 'none';
    });
  }



  let currentIndex = 0;
  let images = [];
  const thumbnails = document.getElementById('thumbnails');
  const gallery = document.getElementById('gallery');
  const lightboxNavigation = document.getElementById('lightbox-navigation');
  const lightboxImage = document.getElementById('currentImage');

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
    
    // Set the src attribute of the img tag to the selected image
    lightboxImage.src = images[currentIndex].src;
    lightbox.classList.remove('hidden');
    gallery.classList.add('hidden');
    lightboxNavigation.classList.remove('hidden');
  }




  // Function to close the lightbox
  function closeLightbox() {
    lightbox.classList.add('hidden');
    lightboxNavigation.classList.add('hidden');
    gallery.classList.remove('hidden');
  }
  document.querySelector('.return-gallery-btn').addEventListener('click', function() {
    closeLightbox();
  });
  lightbox.addEventListener('click', function(event) {
  if (event.target !== currentImage) {
    closeLightbox();
  }
});


  // Navigation buttons functionality
  document.querySelector('.prev-btn').addEventListener('click', function() {
    navigateLightbox(-1);
  });

  document.querySelector('.next-btn').addEventListener('click', function() {
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
    lightboxImage.src = images[currentIndex].src;
  }
});
