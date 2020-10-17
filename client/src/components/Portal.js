import { useState, useEffect } from "react";
import ReactDOM from "react-dom";

const Portal = ({
  children,
  className = "portal-root",
  el = "div",
  container = {},
}) => {
  const [portalRoot] = useState(() => {
    const portalRoot = document.createElement(el);
    portalRoot.classList.add(className);
    return portalRoot;
  });

  useEffect(() => {
    if (!container.current) {
      document.body.appendChild(portalRoot);

      return () => document.body.removeChild(portalRoot);
    }
  }, [portalRoot, container]);

  if (container.current)
    return ReactDOM.createPortal(children, container.current);
  else return ReactDOM.createPortal(children, portalRoot);
};

export default Portal;
