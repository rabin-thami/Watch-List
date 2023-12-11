const icons = document.querySelectorAll('ul li i');

icons.forEach((icon) => {
  icon.addEventListener('mouseenter', () => {
    icon.classList.add('fa-solid');
    icon.classList.remove('fa-light');
  });

  icon.addEventListener('mouseleave', () => {
    icon.classList.remove('fa-solid');
    icon.classList.add('fa-light');
  });
});