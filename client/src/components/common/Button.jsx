import React, { forwardRef } from "react";
import { Loader2 } from "lucide-react";

const Button = forwardRef(
  (
    {
      children,
      variant = "primary",
      size = "md",
      fullWidth = false,
      isLoading = false,
      disabled = false,
      icon: Icon,
      iconPosition = "left",
      onClick,
      type = "button",
      className = "",
      ...props
    },
    ref
  ) => {
    // Base classes that are always applied
    const baseStyles =
      "inline-flex items-center justify-center font-medium transition-all rounded-md focus:outline-none";

    // Variant styles
    const variants = {
      primary:
        "bg-blue-600 text-white hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2",
      secondary:
        "bg-gray-200 text-gray-900 hover:bg-gray-300 focus:ring-2 focus:ring-gray-500 focus:ring-offset-2",
      outline:
        "border border-gray-300 bg-transparent hover:bg-gray-50 text-gray-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2",
      ghost: "bg-transparent text-gray-700 hover:bg-gray-100",
      danger:
        "bg-red-600 text-white hover:bg-red-700 focus:ring-2 focus:ring-red-500 focus:ring-offset-2",
      success:
        "bg-green-600 text-white hover:bg-green-700 focus:ring-2 focus:ring-green-500 focus:ring-offset-2",
      warning:
        "bg-yellow-500 text-white hover:bg-yellow-600 focus:ring-2 focus:ring-yellow-500 focus:ring-offset-2",
    };

    // Size styles
    const sizes = {
      sm: "px-3 py-1.5 text-sm",
      md: "px-4 py-2 text-sm",
      lg: "px-6 py-3 text-base",
      xl: "px-8 py-4 text-lg",
    };

    // Icon sizes based on button size
    const iconSizes = {
      sm: 16,
      md: 18,
      lg: 20,
      xl: 24,
    };

    // States
    const isDisabled = disabled || isLoading;
    const disabledStyles = isDisabled
      ? "opacity-50 cursor-not-allowed"
      : "cursor-pointer";
    const widthStyles = fullWidth ? "w-full" : "";

    // Compute icon spacing based on position and presence of children
    const iconSpacing = children
      ? iconPosition === "left"
        ? "mr-2"
        : "ml-2"
      : "";

    return (
      <button
        ref={ref}
        type={type}
        onClick={isDisabled ? undefined : onClick}
        disabled={isDisabled}
        className={`
        ${baseStyles}
        ${variants[variant]}
        ${sizes[size]}
        ${disabledStyles}
        ${widthStyles}
        ${className}
      `}
        {...props}
      >
        {isLoading && (
          <Loader2 className="animate-spin mr-2" size={iconSizes[size]} />
        )}

        {!isLoading && Icon && iconPosition === "left" && (
          <Icon size={iconSizes[size]} className={iconSpacing} />
        )}

        {children}

        {!isLoading && Icon && iconPosition === "right" && (
          <Icon size={iconSizes[size]} className={iconSpacing} />
        )}
      </button>
    );
  }
);

Button.displayName = "Button";

// Example usage components for different button types
export const IconButton = forwardRef(({ icon: Icon, ...props }, ref) => (
  <Button ref={ref} icon={Icon} {...props} />
));

IconButton.displayName = "IconButton";

export const LoadingButton = forwardRef((props, ref) => (
  <Button ref={ref} isLoading={true} {...props} />
));

LoadingButton.displayName = "LoadingButton";

export const ButtonGroup = ({ children, className = "", ...props }) => (
  <div
    className={`inline-flex rounded-md shadow-sm ${className}`}
    role="group"
    {...props}
  >
    {React.Children.map(children, (child, index) => {
      if (!React.isValidElement(child)) return child;

      return React.cloneElement(child, {
        className: `
          ${child.props.className || ""}
          ${index === 0 ? "rounded-r-none" : ""}
          ${
            index === React.Children.count(children) - 1 ? "rounded-l-none" : ""
          }
          ${
            index !== 0 && index !== React.Children.count(children) - 1
              ? "rounded-none"
              : ""
          }
          ${index !== 0 ? "-ml-px" : ""}
        `,
      });
    })}
  </div>
);

export default Button;
