import React from "react";
import classNames from "classnames";
import PropTypes from "prop-types";
import { Modal as ModulesModal } from "react-responsive-modal";

const AnimatedModal = (props) => {
  // Manage received modifiers
  const { categories } = props;

  const catgs = {};
  if (categories)
    categories.forEach((catg) => (catgs[`modal__overlay--${catg}`] = catg));

  const modifiers = classNames({
    ...catgs,
  });

  // Variables
  const modalCloseIcon = <div className="modal__close-icon"></div>;

  return (
    <ModulesModal
      open={props.visible}
      onClose={props.onClose}
      center={props.center}
      closeOnEsc={false} // Propagation problem
      animationDuration={props.animationDuration}
      closeIcon={modalCloseIcon}
      showCloseIcon={props.showCloseIcon}
      container={document.querySelector("#modal-root")}
      classNames={{
        overlay: `modal__overlay ${props.overlayClassName} ${modifiers} ${
          props.defaultLight && !props.defaultDark
            ? "modal__overlay--default-light"
            : props.defaultDark && "modal__overlay--default-dark"
        } ${
          props.visible ? props.overlayClassNameIn : props.overlayClassNameOut
        }`,
        modal: `modal__container ${props.modalClassName} ${
          props.visible ? props.modalClassNameIn : props.modalClassNameOut
        }`,
        closeButton: "modal__close-button",
      }}
      styles={{
        overlay: {
          animation: `${
            props.visible ? props.animationOverlayIn : props.animationOverlayOut
          } ${props.animationDuration}ms`,
          ...props.overlayStyles,
        },
        modal: {
          animation: `${
            props.visible ? props.animationModalIn : props.animationModalOut
          } ${props.animationDuration}ms`,
          ...props.modalStyles,
        },
      }}
      onAnimationEnd={props.onAnimationEnd}
    >
      {props.children}
    </ModulesModal>
  );
};

AnimatedModal.defaultProps = {
  overlayStyles: {},
  modalStyles: {},
  showCloseIcon: true,
  center: true,
  animationDuration: 400,
  defaultLight: true,
  defaultDark: false,
  animationOverlayIn: "modal-fade-enter",
  animationOverlayOut: "modal-fade-leave",
  overlayClassNameIn: "modal-fade-enter",
  overlayClassNameOut: "modal-fade-leave",
  animationModalIn: "modal-zoom-enter",
  animationModalOut: "modal-zoom-leave",
  modalClassNameIn: "modal-zoom-enter",
  modalClassNameOut: "modal-zoom-leave",
};

AnimatedModal.propTypes = {
  overlayStyles: PropTypes.object,
  modalStyles: PropTypes.object,
  showCloseIcon: PropTypes.bool,
  categories: PropTypes.arrayOf(PropTypes.string),
  visible: PropTypes.bool,
  onClose: PropTypes.func.isRequired,
  center: PropTypes.bool,
  animationDuration: PropTypes.number,
  default: PropTypes.string,
  animationOverlayIn: PropTypes.string,
  animationOverlayOut: PropTypes.string,
  overlayClassName: PropTypes.string,
  overlayClassNameIn: PropTypes.string,
  overlayClassNameOut: PropTypes.string,
  animationModalIn: PropTypes.string,
  animationModalOut: PropTypes.string,
  modalClassName: PropTypes.string,
  modalClassNameIn: PropTypes.string,
  modalClassNameOut: PropTypes.string,
  onAnimationEnd: PropTypes.func,
};

export default AnimatedModal;
