import React, { useRef, useEffect, useState, useCallback } from "react";
import { NavLink, Link } from "react-router-dom";
import { SignIn } from "../auth/SignIn";
import { Button } from "../Button";
import { Navbar3d } from "../layouts/Navbar3d";
import { withRouter } from "react-router-dom";

const mnPnlProps = [
  {
    path: "/",
    text: "home",
    icon: "fa-home",
  },
  {
    path: "/read-more",
    text: "read more",
    icon: "fa-info-circle",
  },
];

const gstPnlProps = [
  {
    path: "sign-up",
    text: "sign up",
  },
];

const Navbar = (props) => {
  // States
  const [hidden, setHidden] = useState(true);

  // References
  const mnPnl = useRef(null);
  const mnInd = useRef(null);
  const authLnks = useRef([]);
  const smNav = useRef(null);
  const smBtn = useRef(null);

  // Set indicator's initial state
  const setInitialIndicator = (parPad, pthEl) => {
    // Initial settings
    mnInd.current.style.transition = "none";
    mnInd.current.style.opacity = 0;
    mnInd.current.style.width = `${pthEl.offsetWidth}px`;
    mnInd.current.style.transform = `translateX(${
      pthEl.offsetLeft - parPad
    }px)`;

    // Manage indicator's initial transitions
    setTimeout(() => {
      mnInd.current.style.transition =
        "width 0.4s, transform 0.4s, opacity 0.4s";
      mnInd.current.style.opacity = 1;
    }, 10);
  };

  // componentDidMount - Keep CSS from refreshing
  useEffect(() => {
    // Initial settings
    const pthnm = window.location.pathname;
    const allowedPthnms = ["/", "/read-more"];

    // Get an element corresponding to the pathname
    const pthEl = document.querySelector(`a[href="${pthnm}"]`);
    if (pthEl) {
      if (allowedPthnms.includes(pthnm)) {
        // setTimeout - Solution to indicator's initial styles
        setTimeout(() => {
          // Get an element's padding value - The nearest ancestor that has a position other than static
          const parPad = parseInt(
            getComputedStyle(mnInd.current.offsetParent).paddingLeft,
            10
          );
          setInitialIndicator(parPad, pthEl);
        }, 10);
      } else {
        // Set indicator's flag to handle transitions
        mnInd.current.flag = true;
        // Set link's state to active for the authentication part of the navigation
        pthEl.classList.add("top-nav__lnk--auth-is-active");
      }
    }
  }, []);

  // Manage the navigation bar's states (@media (max-width: 991px))
  const handleMainButtonClick = (e) => {
    e.currentTarget.classList.toggle("button--nav-mn-is-active");

    mnPnl.current.classList.toggle("top-nav__mn-pnl--is-extended");
    smNav.current.classList.toggle("navbar-3d--is-extended");
  };

  // Close the navigation bar and remove the indicator when the link is clicked
  const handleSmallLinksClick = () => {
    mnInd.current.style.display = "none";

    smBtn.current.classList.remove("button--nav-mn-is-active");

    mnPnl.current.classList.remove("top-nav__mn-pnl--is-extended");
    smNav.current.classList.remove("navbar-3d--is-extended");
  };

  // Remove CSS when the window is resized ***
  const handleWindowResize = useCallback(() => {
    if (window.matchMedia("(min-width: 992px)").matches) {
      mnPnl.current.classList.remove("top-nav__mn-pnl--is-extended");
      smNav.current.classList.remove("navbar-3d--is-extended");
      smBtn.current.classList.remove("button--nav-mn-is-active");
    }
  }, []);

  useEffect(() => {
    window.addEventListener("resize", handleWindowResize);

    return () => {
      window.removeEventListener("click", handleWindowResize);
    };
  }, [handleWindowResize]);
  // End ***

  // Close the sign-in form when the click is detected outside ***
  const handleDocumentClick = useCallback((el, e) => {
    if (
      el.firstChild.classList.contains("button--nav-auth-is-active") &&
      !el.contains(e.target)
    ) {
      el.firstChild.classList.remove("button--nav-auth-is-active");
      el.lastChild.classList.remove("sign-in--nav-is-extended");

      setHidden((prevHidden) => !prevHidden);
    }
  }, []);

  useEffect(() => {
    const authBtnCtr = document.querySelector(".top-nav__btn");
    if (authBtnCtr) {
      document.addEventListener(
        "click",
        handleDocumentClick.bind(null, authBtnCtr)
      );

      return () => {
        window.removeEventListener("click", handleDocumentClick);
      };
    }
  }, [handleDocumentClick]);
  // End ***

  // Set the indicator when the link is clicked
  const handleLinksClick = (e) => {
    // Remove the active state from the authentication part of the navigation
    authLnks.current.forEach((authLnk) => {
      authLnk.classList.remove("top-nav__lnk--auth-is-active");
    });
    // Restore the indicator
    mnInd.current.style.display = "block";
    // Get an element's padding value - The nearest ancestor that has a position other than static
    const parPad = parseInt(
      getComputedStyle(mnInd.current.offsetParent).paddingLeft,
      10
    );

    // Manage the indicator
    if (mnInd.current.flag) {
      setInitialIndicator(parPad, e.currentTarget);
      mnInd.current.flag = false;
    } else {
      mnInd.current.style.transition = "width 0.4s, transform 0.4s";
      mnInd.current.style.width = `${e.currentTarget.offsetWidth}px`;
      mnInd.current.style.transform = `translateX(${
        e.currentTarget.offsetLeft - parPad
      }px)`;
    }
  };

  // Set the active state when the link is clicked
  const handleAuthenticationLinkClick = (e) => {
    // Remove the indicator
    mnInd.current.style.display = "none";
    mnInd.current.flag = true;
    // Remove the active state from the authentication part of the navigation
    authLnks.current.forEach((authLnk) => {
      authLnk.classList.remove("top-nav__lnk--auth-is-active");
    });
    // Add the active state to the current element
    e.currentTarget.classList.add("top-nav__lnk--auth-is-active");
  };

  // Open and close the sign-in form when the button is clicked
  const handleSignInButtonClick = (e) => {
    e.currentTarget.classList.toggle("button--nav-auth-is-active");
    e.currentTarget.parentElement.lastChild.classList.toggle(
      "sign-in--nav-is-extended"
    );

    setHidden((prevHidden) => !prevHidden);
  };

  // Variables
  const mnMnu = mnPnlProps.map((param) => (
    <li className="top-nav__itm" key={param.path}>
      <NavLink
        exact
        className="top-nav__lnk txt txt--nav"
        to={param.path}
        onClick={handleLinksClick}
        activeClassName="top-nav__lnk--is-active"
      >
        <i className={`top-nav__icon fas ${param.icon}`}></i>{" "}
        <span className="top-nav__txt">{param.text}</span>
      </NavLink>
    </li>
  ));

  const gstMnu = gstPnlProps.map((param, index) => (
    <li className="top-nav__itm" data-path={`/${param.path}`} key={param.path}>
      <Link
        className="top-nav__lnk top-nav__lnk--auth txt txt--nav txt--nav-auth"
        to={param.path}
        onClick={handleAuthenticationLinkClick}
        ref={(el) => (authLnks.current[index] = el)}
      >
        {param.text}
      </Link>
    </li>
  ));

  return (
    <header>
      <nav className="top-nav">
        <div className="container">
          {/* fixed-top */}
          <div className="row">
            <div className="top-nav__cntnr">
              <Navbar3d
                bootstrapClasses="col-12 d-lg-none"
                ref={smNav}
                click={handleSmallLinksClick}
              />
              <div className="top-nav__mn-pnl col-12 col-lg-6" ref={mnPnl}>
                <ul className="top-nav__lst">{mnMnu}</ul>
                <Button
                  categories={["nav-mn"]}
                  bootstrapClasses="d-lg-none"
                  ref={smBtn}
                  click={handleMainButtonClick}
                >
                  <span className="button__burger-ln"></span>
                  <span className="button__burger-ln"></span>
                  <span className="button__burger-ln"></span>
                </Button>
                <div className="top-nav__ind" ref={mnInd}></div>
              </div>
              <div className="top-nav__auth-pnl col-lg-6 d-none d-lg-flex">
                {props.location.pathname !== "/sign-in" ? (
                  <div className="top-nav__btn">
                    <Button
                      categories={["nav-auth"]}
                      textCategories={["nav", "nav-auth"]}
                      icon="fas fa-angle-down"
                      iconModifier="nav-sign-in"
                      rightIcon
                      click={handleSignInButtonClick}
                    >
                      sign in
                    </Button>
                    <SignIn categories={["nav"]} hidden={hidden} />
                  </div>
                ) : null}
                <ul className="top-nav__lst top-nav__lst--auth">{gstMnu}</ul>
              </div>
            </div>
          </div>
        </div>
      </nav>
    </header>
  );
};

export default withRouter(Navbar);
