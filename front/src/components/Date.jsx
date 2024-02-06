const Date = ({ date }) => {
  console.log(date)
  const formatedDate = new Date(date)

  return (
    <div>
      {formatedDate.getHours() < 10
        ? `0${formatedDate.getMinutes()}`
        : formatedDate.getMinutes()}
      :
      {formatedDate.getMinutes() < 10
        ? `0${formatedDate.getMinutes()}`
        : `${formatedDate.getMinutes()}`}
        
      {formatedDate.getDate() < 10
        ? `0${formatedDate.getDate()}`
        : formatedDate.getDate()}
      -
      {formatedDate.getMonth() + 1 < 10
        ? `0${formatedDate.getMonth()}`
        : formatedDate.getMonth()}
      -{formatedDate.getFullYear()}
    </div>
  )
}
export default Date
