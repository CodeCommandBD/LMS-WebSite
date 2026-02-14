import React from "react";

export const Input = React.forwardRef((props, ref) => (
  <input {...props} ref={ref} />
));
Input.displayName = "Input";

export const Label = React.forwardRef(({ children, ...props }, ref) => (
  <label {...props} ref={ref}>
    {children}
  </label>
));
Label.displayName = "Label";

export const Button = React.forwardRef(({ children, ...props }, ref) => (
  <button {...props} ref={ref}>
    {children}
  </button>
));
Button.displayName = "Button";

export const RadioGroup = React.forwardRef(({ children, ...props }, ref) => (
  <div {...props} ref={ref}>
    {children}
  </div>
));
RadioGroup.displayName = "RadioGroup";

export const RadioGroupItem = React.forwardRef((props, ref) => (
  <input type="radio" {...props} ref={ref} />
));
RadioGroupItem.displayName = "RadioGroupItem";

const MockComponent = React.forwardRef(({ children, ...props }, ref) => (
  <div {...props} ref={ref}>
    {children}
  </div>
));
MockComponent.displayName = "MockComponent";

export default MockComponent;
