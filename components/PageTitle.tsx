export function PageTitle({ children }: { children: string }) {
  return (
    <h1 className="text-4xl font-medium mb-12 pb-4 Xborder-b text-center px-8 font-display text-red-500">
      {children}
    </h1>
  )
}
