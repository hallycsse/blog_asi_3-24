import Link from "next/link"

const PaginationItem = ({ query, pathname, className = "", ...otherProps }) => {
  return (
    <li>
      <Link
        className={`bg-gray-100 rounded-md px-2.5 py-1.5 font-semibold ${className}`}
        href={`/posts?page=${query.page}`}
        {...otherProps}
      />
    </li>
  )
}

const Pagination = (props) => {
  const { page, pathname, countPages } = props

  return (
    <nav>
      <ul className="flex gap-2">
        {page > 1 && (
          <>
            <PaginationItem pathname={pathname} query={{ page: page - 1 }}>
              Previous
            </PaginationItem>
            <PaginationItem pathname={pathname} query={{ page: page - 1 }}>
              {page - 1}
            </PaginationItem>
          </>
        )}
        <PaginationItem
          pathname={pathname}
          query={{ page }}
          className="bg-gray-300"
        >
          {page}
        </PaginationItem>
        {page < countPages && (
          <>
            <PaginationItem pathname={pathname} query={{ page: page + 1 }}>
              {page + 1}
            </PaginationItem>
            <PaginationItem pathname={pathname} query={{ page: page + 1 }}>
              Next
            </PaginationItem>
          </>
        )}
      </ul>
    </nav>
  )
}

export default Pagination
