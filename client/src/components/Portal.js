import { useState, useEffect } from "react";
import ReactDOM from "react-dom";

const Portal = ({ children, className = "portal-root", el = "div" }) => {
  const [portalRoot] = useState(() => {
    const portalRoot = document.createElement(el);
    portalRoot.classList.add(className);
    return portalRoot;
  });

  useEffect(() => {
    document.body.appendChild(portalRoot);

    return () => document.body.removeChild(portalRoot);
  }, [portalRoot]);

  return ReactDOM.createPortal(children, portalRoot);
};

export default Portal;
