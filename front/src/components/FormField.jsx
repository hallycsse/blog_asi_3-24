import clsx from "clsx"
import { Field } from "formik"

const FormField = (props) => {
  const { name, className, label = props.name, ...otherProps } = props

  return (
    <Field name={name}>
      {({ field, meta }) => (
        <label className={clsx("flex flex-col gap-2", className)}>
          <span className="text-[#51afa6]">{label}</span>
          <input {...field} {...otherProps} className="border-2 px-3 py-1.5" />
          {meta.touched && meta.error ? (
            <span className="text-sm text-red-600">{meta.error}</span>
          ) : null}
        </label>
      )}
    </Field>
  )
}

export default FormField
