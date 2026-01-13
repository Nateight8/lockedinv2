"use client";

import { NavigationMenu } from "@base-ui/react/navigation-menu";
import { ChevronDownIcon } from "@radix-ui/react-icons";
import clsx from "clsx";
import Link from "next/link";
import * as React from "react";

import { useToggleState } from "@/hooks/use-toggle-state";
import { Button, buttonVariants } from "../ui/button";

// #region desktop 💻
/* -------------------------------------------------------------------------- */
/*                                   Desktop                                  */
/* -------------------------------------------------------------------------- */

export function NavigationMenuHeader({
  links,
  className,
}: {
  links: {
    id: string;
    label: string;
    href: string;
    sublinks?: { items: { id: string; label: string; href: string }[] };
  }[];
  className?: string;
}) {
  return (
    <NavigationMenu.Root
      className={clsx(
        "z-1 relative flex-col justify-center lg:flex",
        className
      )}
      delay={50}
    >
      <NavigationMenu.List className="flex flex-1 gap-0.5 px-4">
        {links.map((link) => (
          <NavigationMenu.Item key={link.id}>
            {link.sublinks && link.sublinks.items.length > 0 ? (
              <NavigationMenuLinkWithMenu {...link} />
            ) : (
              <NavigationMenu.Link
                className={buttonVariants({
                  className:
                    "inline-flex h-6 shrink-0 items-center justify-center gap-1 rounded-full px-3 pb-px tracking-tight hover:bg-accent lg:h-7",
                  variant: "ghost",
                })}
                href={link.href ?? "#"}
                render={<Link href={link.href ?? "#"} />}
              >
                {link.label}
              </NavigationMenu.Link>
            )}
          </NavigationMenu.Item>
        ))}
      </NavigationMenu.List>
    </NavigationMenu.Root>
  );
}

function NavigationMenuLinkWithMenu({
  label,
  href,
  sublinks,
}: {
  label: string;
  href: string;
  sublinks?: { items: { id: string; label: string; href: string }[] };
}) {
  return (
    <>
      <NavigationMenu.Trigger
        className={buttonVariants({
          className:
            "inline-flex items-center gap-1 rounded-full pb-px pl-3 pr-2 tracking-tight hover:bg-accent lg:h-7",
          variant: "ghost",
        })}
      >
        {label}
        <ChevronDownIcon className="text-muted-foreground" />
      </NavigationMenu.Trigger>
      <NavigationMenu.Portal>
        <NavigationMenu.Positioner align="start" sideOffset={4}>
          <NavigationMenu.Popup className="z-50 w-[clamp(180px,30vw,300px)] rounded-md border bg-background p-0.5 shadow-md outline-none">
            <div className="flex flex-col gap-1">
              {sublinks?.items.map((sublink) => (
                <NavigationMenu.Link
                  key={sublink.id}
                  className={buttonVariants({
                    className:
                      "flex w-full items-center justify-start gap-2 rounded-md px-3 py-1.5 hover:bg-accent",
                    variant: "ghost",
                    size: "sm",
                  })}
                  href={sublink.href}
                  render={<Link href={sublink.href} />}
                >
                  {sublink.label}
                </NavigationMenu.Link>
              ))}
            </div>
          </NavigationMenu.Popup>
        </NavigationMenu.Positioner>
      </NavigationMenu.Portal>
    </>
  );
}

export function DesktopMenu({
  links,
}: {
  links: {
    id: string;
    label: string;
    href: string;
    sublinks?: { items: { id: string; label: string; href: string }[] };
  }[];
}) {
  return (
    <>
      <NavigationMenuHeader links={links} className="hidden lg:flex" />
      <div className="hidden items-center gap-2 justify-self-end lg:flex">
        <Link className={buttonVariants({ variant: "default" })} href="/auth">
          Get Started
        </Link>
      </div>
    </>
  );
}

// #region mobile 📱
/* -------------------------------------------------------------------------- */
/*                                   Mobile                                   */
/* -------------------------------------------------------------------------- */

// Mobile menu implementation remains simplified for now as per current requirement
export function MobileMenu() {
  const { handleToggle, isOn } = useToggleState();

  return (
    <div className="lg:hidden">
      <Button
        variant="outline"
        size="icon"
        onClick={handleToggle}
        aria-label="Toggle menu"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <line x1="4" x2="20" y1="12" y2="12" />
          <line x1="4" x2="20" y1="6" y2="6" />
          <line x1="4" x2="20" y1="18" y2="18" />
        </svg>
      </Button>
      {isOn && (
        <div className="fixed inset-x-0 top-[--header-height] bottom-0 z-50 bg-background/80 backdrop-blur-sm lg:hidden">
          <nav className="flex flex-col gap-4 p-6">
            {/* Mobile links could be added here */}
          </nav>
        </div>
      )}
    </div>
  );
}
