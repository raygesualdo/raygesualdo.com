import React from 'react'

export const A = React.forwardRef<
  HTMLAnchorElement,
  React.HTMLAttributes<HTMLAnchorElement> & { href?: string }
>(function A(props, ref) {
  return <a {...props} className="text-sky-600 underline" ref={ref} />
})