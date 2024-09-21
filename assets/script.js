
  // Function to get URL parameter by name
  function getURLParameter(name) {
      return new URLSearchParams(window.location.search).get(name);
  }



document.addEventListener('DOMContentLoaded', function() {


  // Get the 'lang' parameter from the URL (if available)
  var langOverride = getURLParameter('lang');

  // Get the user's browser language
  var userLang = navigator.language || navigator.userLanguage;

  // Override the browser language if ?lang=xx is passed
  var finalLang = langOverride || userLang;


  // If the user's language starts with 'fr', switch to French
  if (finalLang.startsWith('fr')) {
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
