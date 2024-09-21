document.addEventListener("DOMContentLoaded", () => {
  const thumbnails = document.querySelectorAll('.thumbnail');
  const lightbox = document.getElementById('lightbox');
  const gallery = document.getElementById('gallery');
  const currentImage = document.getElementById('currentImage');
  const prevBtn = document.querySelector('.prev-btn');
  const nextBtn = document.querySelector('.next-btn');
  let currentIndex = 0;

  const images = [
    '#FF5733', '#33FFBD', '#335BFF', '#FF33A8', '#FFD133', '#33FF57', '#FF5733', '#33FFBD'
  ];

  // Function to open the lightbox
  const openLightbox = (index) => {
    gallery.classList.add('hidden'); // Hide the gallery
    lightbox.classList.remove('hidden'); // Show the lightbox
    currentIndex = index;
    currentImage.style.backgroundColor = images[currentIndex];
  };

  // Function to close the lightbox and return to gallery
  const closeLightbox = () => {
    lightbox.classList.add('hidden');
    gallery.classList.remove('hidden');
  };

  // Show next image
  const showNextImage = () => {
    currentIndex = (currentIndex + 1) % images.length;
    currentImage.style.backgroundColor = images[currentIndex];
  };

  // Show previous image
  const showPrevImage = () => {
    currentIndex = (currentIndex - 1 + images.length) % images.length;
    currentImage.style.backgroundColor = images[currentIndex];
  };

  // Event listeners for thumbnails
  thumbnails.forEach((thumbnail, index) => {
    thumbnail.addEventListener('click', () => {
      openLightbox(index);
    });
  });

  // Event listeners for Prev/Next buttons
  nextBtn.addEventListener('click', showNextImage);
  prevBtn.addEventListener('click', showPrevImage);
});
