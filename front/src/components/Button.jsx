import clsx from "clsx"

const sizes = {
  lg: "text-lg",
}

const variants = {
  primary: "",
  secondary:
    " rounded-lg border-2 border-[#51afa6] px-1.5 py-1 disabled:border-neutral-400 disabled:text-neutral-400",
  underlined: "underline",
}

const colors = {
  green: "text-[#51afa6]",
}

const Button = (props) => {
  const {
    className,
    size,
    variant = "primary",
    color = "green",
    ...otherProps
  } = props

  return (
    <button
      {...otherProps}
      className={clsx(variants[variant], colors[color], sizes[size], className)}
    />
  )
}

export default Button
