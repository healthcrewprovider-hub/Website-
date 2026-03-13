import { useState, useEffect } from "react"
import { Menu, X, Mail } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const navLinks = [
    { name: "Home", href: "#" },
    { name: "About Us", href: "#about" },
    { name: "Roles", href: "#roles" },
    { name: "Regions", href: "#regions" },
    { name: "Contact", href: "#contact" },
  ]

  const scrollToContact = () => {
    document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" })
    setIsMobileMenuOpen(false)
  }

  return (
    <header className="fixed top-0 left-0 right-0 z-50 transition-all duration-300">
      {/* Top Info Bar */}
      <div className={`bg-primary text-primary-foreground text-xs py-2 px-4 transition-all duration-300 ${isScrolled ? 'h-0 opacity-0 overflow-hidden py-0' : 'h-10 opacity-100'}`}>
        <div className="max-w-7xl mx-auto flex justify-between items-center h-full">
          <div className="hidden md:flex items-center gap-6">
            <a href="mailto:healthcrewprovider@gmail.com" className="flex items-center gap-2 hover:text-accent transition-colors font-medium">
              <Mail className="w-3.5 h-3.5" />
              healthcrewprovider@gmail.com
            </a>
          </div>
          <div className="flex items-center gap-3 ml-auto">
            <span className="text-primary-foreground/70">Canada's Trusted Healthcare Staffing Agency</span>
          </div>
        </div>
      </div>

      {/* Main Navbar */}
      <nav className={`transition-all duration-300 ${isScrolled ? 'bg-white/95 backdrop-blur-md shadow-lg py-3' : 'bg-white py-3 shadow-sm'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center">

            {/* Logo + Brand Name */}
            <a href="#" className="flex-shrink-0 flex items-center gap-3 group">
              <img
                src={`${import.meta.env.BASE_URL}logo.jpeg`}
                alt="Health Crew Provider Logo"
                className="h-12 w-auto object-contain rounded-md transition-transform duration-200 group-hover:scale-105"
              />
              <div className="hidden sm:block leading-tight">
                <div className="text-base font-extrabold tracking-tight">
                  <span className="text-primary">Health </span>
                  <span className="text-accent">Crew Provider</span>
                </div>
                <div className="text-[11px] text-muted-foreground font-medium tracking-widest uppercase">
                  Healthcare Agency
                </div>
              </div>
            </a>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-7">
              {navLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.href}
                  className="text-sm font-semibold text-foreground/75 hover:text-primary transition-colors relative group"
                >
                  {link.name}
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-accent transition-all duration-300 group-hover:w-full rounded-full"></span>
                </a>
              ))}
              <Button onClick={scrollToContact} className="ml-2 shadow-md hover:shadow-lg" data-testid="button-apply-now-nav">
                Apply Now
              </Button>
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden flex items-center">
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="text-foreground p-2 focus:outline-none rounded-lg hover:bg-muted transition-colors"
                aria-label="Toggle menu"
              >
                {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <div className="md:hidden absolute top-full left-0 w-full bg-white border-b border-border shadow-xl">
            <div className="px-4 pt-2 pb-6 space-y-1">
              {navLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.href}
                  className="block px-3 py-4 text-base font-medium text-foreground hover:bg-primary/5 hover:text-primary rounded-lg transition-colors"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {link.name}
                </a>
              ))}
              <div className="pt-4 px-3">
                <Button onClick={scrollToContact} className="w-full" data-testid="button-apply-now-mobile">
                  Apply Now
                </Button>
              </div>
            </div>
          </div>
        )}
      </nav>
    </header>
  )
}
