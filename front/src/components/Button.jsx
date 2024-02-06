import clsx from "clsx"

const sizes = {
  lg: "text-lg",
}

const Button = (props) => {
  // eslint-disable-next-line no-unused-vars
  const { className, size, ...otherProps } = props

  return <button {...otherProps} className={clsx(sizes[size], className)} />
}

export default Button
