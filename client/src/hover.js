const watchForHover = () => {
  // Used for ignoring emulated mousemove events
  let lastTouchTime = 0;

  const enableHover = () => {
    if (new Date() - lastTouchTime < 500) return;

    document.body.classList.remove("no-hover");
    document.body.classList.add("has-hover");
  };

  const disableHover = () => {
    document.body.classList.remove("has-hover");
    document.body.classList.add("no-hover");
  };

  const updateLastTouchTime = () => (lastTouchTime = new Date());

  document.addEventListener("touchstart", updateLastTouchTime);
  document.addEventListener("touchstart", disableHover);
  document.addEventListener("mousemove", enableHover);

  enableHover();
};

watchForHover();
