document.addEventListener("DOMContentLoaded", () => {
  const thumbnails = document.querySelectorAll('.thumbnail');
  const lightbox = document.querySelector('.lightbox');
  const currentImage = document.getElementById('currentImage');
  const prevBtn = document.querySelector('.prev-btn');
  const nextBtn = document.querySelector('.next-btn');
  const closeBtn = document.querySelector('.close-btn');
  let currentIndex = 0;

  const images = [
    '#FF5733', '#33FFBD', '#335BFF', '#FF33A8', '#FFD133', '#33FF57', '#FF5733', '#33FFBD'
  ];

  const openLightbox = (index) => {
    lightbox.classList.remove('hidden');
    currentIndex = index;
    currentImage.style.backgroundColor = images[currentIndex];
  };

  const closeLightbox = () => {
    lightbox.classList.add('hidden');
  };

  const showNextImage = () => {
    currentIndex = (currentIndex + 1) % images.length;
    currentImage.style.backgroundColor = images[currentIndex];
  };

  const showPrevImage = () => {
    currentIndex = (currentIndex - 1 + images.length) % images.length;
    currentImage.style.backgroundColor = images[currentIndex];
  };

  thumbnails.forEach((thumbnail, index) => {
    thumbnail.addEventListener('click', () => {
      openLightbox(index);
    });
  });

  nextBtn.addEventListener('click', showNextImage);
  prevBtn.addEventListener('click', showPrevImage);
  closeBtn.addEventListener('click', closeLightbox);
});
