let resizeTimer;

// Stop transitions and animations during window resizing
const handleWindowResize = () => {
  document.body.classList.add("resize-animation-transition-stopper");

  clearTimeout(resizeTimer);
  resizeTimer = setTimeout(
    () => document.body.classList.remove("resize-animation-transition-stopper"),
    400
  );
};

window.addEventListener("resize", handleWindowResize);
