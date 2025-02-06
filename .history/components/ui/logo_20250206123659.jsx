export const Logo = () => {
  return (
    <a href="/" className="flex items-center gap-2" aria-label="Home" tabIndex={0} onKeyDown={(e) => e.key === 'Enter' && e.target.click()
  }