import React from "react";
import { Redirect, Link } from "react-router-dom";
import Ripple from "@intereact/ripple";
// Redux
import { connect } from "react-redux";

const Landing = (props) => {
  // Redux
  const { isAuthenticated } = props;
  if (isAuthenticated) {
    return <Redirect to="/dashboard" />;
  }

  return (
    <section className="landing-page col-12">
      <div className="container">
        <div className="row h-100">
          <header className="landing-page__header col-12 col-lg-6">
            <div className="row h-100">
              <h1 className="landing-page__header-quote col-lg-10 offset-lg-1 col-12">
                For every minute spent organizing, an hour is earned.
              </h1>
              <p className="landing-page__header-text col-lg-10 offset-lg-1 col-12">
                Start something big, something that matters to you. Anager
                organizes work so teams are clear what to do, and how to get it
                done.
              </p>

              <div className="landing-page__try-for-free-wrapper col-lg-10 offset-lg-1 col-12">
                <Link className="landing-page__try-for-free" to="/sign-in">
                  Try for free
                </Link>
              </div>
            </div>
          </header>
          <div className="landing-page__grid-wrapper col-12 col-lg-6">
            <div className="landing-page__grid">
              <section className="landing-page__sections-list">
                <section className="landing-page__section">
                  <header className="landing-page__section-header">
                    <div className="landing-page__section-information">
                      <span className="landing-page__section-text">
                        Content development
                      </span>
                    </div>
                  </header>
                  <div className="landing-page__grid-project">
                    <Ripple>
                      {(ripples) => (
                        <div
                          className="landing-page__project-col"
                          style={{ position: "relative" }}
                        >
                          {ripples}
                          <div className="landing-page__project-name">
                            <i className="landing-page__project-icon far fa-check-circle"></i>
                            <span className="landing-page__project-text">
                              Gray Panthers
                            </span>
                          </div>
                        </div>
                      )}
                    </Ripple>
                    <div className="landing-page__project-col landing-page__project-col--date">
                      <span className="projects__project-due-date">28 Nov</span>
                    </div>
                    <div className="landing-page__project-col landing-page__project-col--options">
                      <div className="landing-page__status-priority landing-page__status-priority--on-hold"></div>
                    </div>
                    <div className="landing-page__project-col landing-page__project-col--options">
                      <div className="landing-page__status-priority landing-page__status-priority--on-hold"></div>
                    </div>
                    <div className="landing-page__project-col landing-page__project-col--ellipsis landing-page__project-col--options"></div>
                  </div>
                  <div className="landing-page__grid-project">
                    <Ripple>
                      {(ripples) => (
                        <div
                          className="landing-page__project-col"
                          style={{ position: "relative" }}
                        >
                          {ripples}
                          <div className="landing-page__project-name">
                            <i className="landing-page__project-icon far fa-check-circle"></i>
                            <span className="landing-page__project-text">
                              Golden Bulls
                            </span>
                          </div>
                        </div>
                      )}
                    </Ripple>
                    <div className="landing-page__project-col landing-page__project-col--date">
                      <span className="projects__project-due-date">12 Dec</span>
                    </div>
                    <div className="landing-page__project-col landing-page__project-col--options">
                      <div className="landing-page__status-priority landing-page__status-priority--active"></div>
                    </div>
                    <div className="landing-page__project-col landing-page__project-col--options">
                      <div className="landing-page__status-priority landing-page__status-priority--active"></div>
                    </div>
                    <div className="landing-page__project-col landing-page__project-col--ellipsis landing-page__project-col--options"></div>
                  </div>
                  <div className="landing-page__grid-project">
                    <Ripple>
                      {(ripples) => (
                        <div
                          className="landing-page__project-col"
                          style={{ position: "relative" }}
                        >
                          {ripples}
                          <div className="landing-page__project-name">
                            <i className="landing-page__project-icon far fa-check-circle"></i>
                            <span className="landing-page__project-text">
                              Pink Dragons
                            </span>
                          </div>
                        </div>
                      )}
                    </Ripple>
                    <div className="landing-page__project-col landing-page__project-col--date">
                      <span className="projects__project-due-date">14 Mar</span>
                    </div>
                    <div className="landing-page__project-col landing-page__project-col--options">
                      <div className="landing-page__status-priority landing-page__status-priority--archived"></div>
                    </div>
                    <div className="landing-page__project-col landing-page__project-col--options">
                      <div className="landing-page__status-priority landing-page__status-priority--archived"></div>
                    </div>
                    <div className="landing-page__project-col landing-page__project-col--ellipsis landing-page__project-col--options"></div>
                  </div>
                </section>
                <section className="landing-page__section">
                  <header className="landing-page__section-header">
                    <div className="landing-page__section-information">
                      <span className="landing-page__section-text">
                        Planning
                      </span>
                    </div>
                  </header>
                  <div className="landing-page__grid-project">
                    <Ripple>
                      {(ripples) => (
                        <div
                          className="landing-page__project-col"
                          style={{ position: "relative" }}
                        >
                          {ripples}
                          <div className="landing-page__project-name">
                            <i className="landing-page__project-icon far fa-check-circle"></i>
                            <span className="landing-page__project-text">
                              Yellow Moose
                            </span>
                          </div>
                        </div>
                      )}
                    </Ripple>
                    <div className="landing-page__project-col landing-page__project-col--date">
                      <span className="projects__project-due-date">5 Jan</span>
                    </div>
                    <div className="landing-page__project-col landing-page__project-col--options">
                      <div className="landing-page__status-priority landing-page__status-priority--medium"></div>
                    </div>
                    <div className="landing-page__project-col landing-page__project-col--options">
                      <div className="landing-page__status-priority landing-page__status-priority--medium"></div>
                    </div>
                    <div className="landing-page__project-col landing-page__project-col--ellipsis landing-page__project-col--options"></div>
                  </div>
                  <div className="landing-page__grid-project">
                    <Ripple>
                      {(ripples) => (
                        <div
                          className="landing-page__project-col"
                          style={{ position: "relative" }}
                        >
                          {ripples}
                          <div className="landing-page__project-name">
                            <i className="landing-page__project-icon far fa-check-circle"></i>
                            <span className="landing-page__project-text">
                              Red Butter
                            </span>
                          </div>
                        </div>
                      )}
                    </Ripple>
                    <div className="landing-page__project-col landing-page__project-col--date">
                      <span className="projects__project-due-date">17 Sep</span>
                    </div>
                    <div className="landing-page__project-col landing-page__project-col--options">
                      <div className="landing-page__status-priority landing-page__status-priority--high"></div>
                    </div>
                    <div className="landing-page__project-col landing-page__project-col--options">
                      <div className="landing-page__status-priority landing-page__status-priority--high"></div>
                    </div>
                    <div className="landing-page__project-col landing-page__project-col--ellipsis landing-page__project-col--options"></div>
                  </div>
                  <div className="landing-page__grid-project">
                    <Ripple>
                      {(ripples) => (
                        <div
                          className="landing-page__project-col"
                          style={{ position: "relative" }}
                        >
                          {ripples}
                          <div className="landing-page__project-name">
                            <i className="landing-page__project-icon far fa-check-circle"></i>
                            <span className="landing-page__project-text">
                              The Blue Bird
                            </span>
                          </div>
                        </div>
                      )}
                    </Ripple>
                    <div className="landing-page__project-col landing-page__project-col--date">
                      <span className="projects__project-due-date">26 Apr</span>
                    </div>
                    <div className="landing-page__project-col landing-page__project-col--options">
                      <div className="landing-page__status-priority landing-page__status-priority--low"></div>
                    </div>
                    <div className="landing-page__project-col landing-page__project-col--options">
                      <div className="landing-page__status-priority landing-page__status-priority--low"></div>
                    </div>
                    <div className="landing-page__project-col landing-page__project-col--ellipsis landing-page__project-col--options"></div>
                  </div>
                </section>
              </section>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

const mapStateToProps = (state) => ({
  isAuthenticated: state.auth.isAuthenticated,
});

export default connect(mapStateToProps)(Landing);
