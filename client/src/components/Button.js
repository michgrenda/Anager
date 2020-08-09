import React from "react";
import classNames from "classnames";

export const Button = React.forwardRef((props, ref) => {
  // Manage the received classes
  const catgs = {};
  const txtCatgs = {};
  const chdMods = {};

  if (props.categories) {
    props.categories.forEach((catg) => {
      catgs[`button--${catg}`] = catg;
    });
  }
  if (props.textCategories) {
    props.textCategories.forEach((catg) => {
      catgs[`txt--${catg}`] = catg;
    });
  }
  if (props.childrenModifiers) {
    props.childrenModifiers.forEach((mod) => {
      chdMods[`button__chd--${mod}`] = mod;
    });
  }

  const cls = classNames({
    ...catgs,
    ...txtCatgs,
  });
  const chdCls = classNames({
    ...chdMods,
  });

  const inrTxtMod = classNames({
    [`button__txt--${props.textSpace}`]: props.textSpace,
  });

  const iconMod = classNames({
    [`button__icon--${props.iconModifier}`]: props.iconModifier,
  });

  return (
    <button
      className={`button txt ${cls} ${props.bootstrapClasses || ""}`}
      type="button"
      ref={ref || null}
      disabled={props.hidden}
      onClick={props.click}
    >
      {/* Place the icon on the left side if (!rightIcon && icon) */}
      {props.icon && !props.rightIcon && (
        <i className={`button__icon ${iconMod} ${props.icon}`}></i>
      )}
      {/* Place the children and set the proper class, depending on the type */}
      {props.children && (
        <span
          className={
            props.icon || typeof props.children === "string"
              ? `button__txt ${inrTxtMod}`
              : `button__chd ${chdCls}`
          }
        >
          {props.children}
        </span>
      )}
      {/* Place the icon on the right side if (rightIcon && icon) */}
      {props.icon && props.rightIcon && (
        <i className={`button__icon ${iconMod} ${props.icon}`}></i>
      )}
    </button>
  );
});
