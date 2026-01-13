import Link from "next/link";
import { ThemeSwitcher } from "./theme-switcher";
import { Button } from "./ui/button";
import { LampIcon } from "@phosphor-icons/react/dist/ssr";
import {
  DiscordLogoIcon,
  InstagramLogoIcon,
  TwitterLogoIcon,
} from "@radix-ui/react-icons";

export const Footer = () => {
  const footer = {
    sections: [
      {
        title: "Company",
        links: [
          { _title: "About", url: "/about" },
          { _title: "Contact", url: "/contact" },
          { _title: "Blog", url: "/blog" },
        ],
      },
      {
        title: "Product",
        links: [
          { _title: "Features", url: "/features" },
          { _title: "Pricing", url: "/pricing" },
          { _title: "EA Download", url: "/downloads/ea" },
          { _title: "Roadmap", url: "/roadmap" },
        ],
      },
      {
        title: "Resources",
        links: [
          { _title: "Help Center", url: "/help" },
          { _title: "Getting Started", url: "/docs/getting-started" },
          { _title: "EA Setup Guide", url: "/docs/ea-setup" },
          { _title: "Prop Firms", url: "/prop-firms" },
        ],
      },
      {
        title: "Legal",
        links: [
          { _title: "Terms of Service", url: "/legal/terms" },
          { _title: "Privacy Policy", url: "/legal/privacy" },
          { _title: "Cookie Policy", url: "/legal/cookies" },
        ],
      },
    ],
    copyright: "© 2026 Locked In. All rights reserved.",
    socialLinks: [
      {
        _title: "Discord",
        url: "https://discord.com/invite/lockedin",
        Icon: DiscordLogoIcon,
      },
      {
        _title: "Twitter",
        url: "https://twitter.com/lockedin",
        Icon: TwitterLogoIcon,
      },
      {
        _title: "Instagram",
        url: "https://www.instagram.com/lockedin",
        Icon: InstagramLogoIcon,
      },
    ],
  };

  return (
    <footer className="border-t py-16">
      <div className="container mx-auto px-6">
        {/* Top section with logo and links */}
        <div className="grid grid-cols-2 gap-8 pb-8 sm:grid-cols-3 lg:grid-cols-6">
          {/* Logo */}
          <div className="col-span-2 sm:col-span-3 lg:col-span-2">
            <LampIcon
              className="mb-4 text-muted-foreground hover:text-foreground"
              size={32}
            />
            <p className="text-sm text-muted-foreground max-w-xs">
              Real-time compliance monitoring and AI-powered journaling for
              serious forex traders.
            </p>
          </div>

          {/* Footer sections */}
          {footer.sections.map((section) => (
            <div key={section.title} className="flex flex-col gap-3">
              <h3 className="font-semibold text-sm text-foreground">
                {section.title}
              </h3>
              <nav className="flex flex-col gap-2">
                {section.links.map((link) => (
                  <Link
                    key={link._title}
                    href={link.url}
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {link._title}
                  </Link>
                ))}
              </nav>
            </div>
          ))}
        </div>

        {/* Bottom section with copyright, theme switcher, and socials */}
        <div className="flex flex-col gap-4 border-t pt-8 sm:flex-row sm:items-end sm:justify-between">
          <p className="text-sm text-muted-foreground">{footer.copyright}</p>

          <div className="flex flex-col items-end gap-6">
            {/* Theme Switcher */}
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">Appearance</span>
              <ThemeSwitcher />
            </div>

            {/* Social Links */}
            <ul className="flex items-center gap-4">
              {footer.socialLinks.map(({ Icon, _title, url }) => (
                <li key={_title}>
                  <Link
                    href={url}
                    className="block text-muted-foreground hover:text-foreground transition-colors"
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={_title}
                  >
                    <Icon className="h-5 w-5" />
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </footer>
  );
};
