import React from "react";
import PropTypes from "prop-types";
import { TransitionGroup, CSSTransition } from "react-transition-group";
// Redux
import { connect } from "react-redux";

const Alert = (props) => {
  // Redux
  const { alerts } = props;

  // Variables
  const receivedAlerts = alerts.map((alert, index) => (
    <CSSTransition
      in
      timeout={props.transitionDuration}
      classNames={props.transitionClassNames}
      appear
      key={alert.id}
    >
      <div
        className={`alerts__alert alerts__alert--${alert.alertType}`}
        style={{ transitionDelay: `${props.transitionDelay * index}s` }}
      >
        {alert.icon && <i className={`alerts__icon ${alert.icon}`}></i>}
        <span
          className={`alerts__text ${
            alert.icon && "alerts__text--margin-left"
          }`}
        >
          {alert.message}
        </span>
      </div>
    </CSSTransition>
  ));

  return (
    alerts && (
      <TransitionGroup className={props.transitionGroupClassName}>
        {receivedAlerts}
      </TransitionGroup>
    )
  );
};

Alert.defaultProps = {
  transitionDuration: 400,
  transitionGroupClassName: "alerts",
  transitionClassNames: "alerts__alert",
  transitionDelay: 0.1,
};

Alert.propTypes = {
  transitionDuration: PropTypes.number,
  transitionGroupClassName: PropTypes.string,
  transitionClassNames: PropTypes.string,
  transitionDelay: PropTypes.number,
  // Redux
  alerts: PropTypes.array.isRequired,
};

const mapStateToProps = (state) => ({
  alerts: state.alert.alerts,
});

export default connect(mapStateToProps)(Alert);
