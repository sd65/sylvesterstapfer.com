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


});
