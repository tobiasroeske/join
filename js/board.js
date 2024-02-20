function toggleAddTask() {
  var popup = document.getElementById('popup');
  if (popup.classList.contains('popup-show')) {
      popup.classList.remove('popup-show');
  } else {
      popup.classList.add('popup-show');
  }
}

  function closePopup() {
    document.getElementById('popup').style.display = 'none';
  }