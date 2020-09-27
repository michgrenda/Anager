document.body.addEventListener("mousedown", function () {
  document.body.classList.remove("using-keyboard");
  document.body.classList.add("using-mouse");
});

// Re-enable focus styling when Tab is pressed
document.body.addEventListener("keydown", function (e) {
  if (e.which === 9) {
    document.body.classList.remove("using-mouse");
    document.body.classList.add("using-keyboard");
  }
});
