"use client";

import { LampIcon } from "@phosphor-icons/react/dist/ssr";
import { DesktopMenu } from "./menu-navigations";
import { usePathname } from "next/navigation";

export const Header = () => {
  const headerLinks = [
    {
      id: "1",
      label: "Market Place",
      href: "/",
      sublinks: {
        items: [],
      },
    },
    {
      id: "12",
      label: "Features",
      href: "/",
      sublinks: {
        items: [],
      },
    },
    {
      id: "2",
      label: "Pricing",
      href: "/pricing",
      sublinks: {
        items: [],
      },
    },
    {
      id: "3",
      label: "Resources",
      href: "/resources",
      sublinks: {
        items: [],
      },
    },
  ];

  return (
    <header className="sticky left-0 top-0 z-50 flex w-full flex-col border-b bg-background ">
      <div className="flex h-(--header-height) ">
        <div className="container mx-auto grid w-full grid-cols-[1fr_max-content_1fr] place-items-center content-center items-center px-6 *:first:justify-self-start">
          {/* <ButtonLink
            unstyled
            className="flex items-center ring-offset-2"
            href="/"
          >
            <DarkLightImageAutoscale priority {...logo} />
          </ButtonLink> */}
          <LampIcon size={32} />
          <DesktopMenu links={headerLinks} />
          {/* <MobileMenu {...header} /> */}
        </div>
      </div>
    </header>
  );
};
