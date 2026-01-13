import clsx from "clsx";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Button } from "../ui/button";
import { TrackedButtonLink } from "../ui/tracked-btn";
import Link from "next/link";

export default function Hero() {
  return (
    <section className="relative min-h-[calc(630px-var(--header-height))] overflow-hidden pb-10">
      <div className="absolute left-0 top-0 z-0 grid h-full w-full grid-cols-[clamp(28px,10vw,120px)_auto_clamp(28px,10vw,120px)] border-b">
        {/* Decorations */}
        <div className="col-span-1 flex h-full items-center justify-center" />
        <div className="col-span-1 flex h-full items-center justify-center border-x" />
        <div className="col-span-1 flex h-full items-center justify-center" />
      </div>
      {/* --- */}
      <figure className="pointer-events-none absolute -bottom-[70%] left-1/2 z-0 block aspect-square w-[520px] -translate-x-1/2 rounded-full bg-primary/50 blur-[200px]" />
      <figure className="pointer-events-none absolute left-[4vw] top-[64px] z-20 hidden aspect-square w-[32vw] rounded-full bg-background opacity-50 blur-[100px]  md:block" />
      <figure className="pointer-events-none absolute bottom-[-50px] right-[7vw] z-20 hidden aspect-square w-[30vw] rounded-full bg-[--surface-primary] opacity-50 blur-[100px] dark:bg-[--dark-surface-primary] md:block" />
      {/* --- */}
      <div className="relative z-10 flex flex-col divide-y divide-[--border] pt-[35px] dark:divide-[--dark-border]">
        <div className="flex flex-col items-center justify-end">
          <div className="flex items-center gap-2 border! border-b-0! px-4 py-2 dark:border-[--dark-border]">
            <div className="-space-x-[0.6rem] flex">
              <Avatar className="ring-2 ring-background size-6">
                <AvatarImage
                  alt="U1"
                  src="https://images.unsplash.com/photo-1543610892-0b1f7e6d8ac1?w=96&h=96&dpr=2&q=80"
                />
                <AvatarFallback>U1</AvatarFallback>
              </Avatar>

              <Avatar className="ring-2 ring-background size-6">
                <AvatarImage
                  alt="U3"
                  src="https://images.unsplash.com/photo-1655874819398-c6dfbec68ac7?w=96&h=96&dpr=2&q=80"
                />
                <AvatarFallback>U3</AvatarFallback>
              </Avatar>
              <Avatar className="ring-2 ring-background size-6">
                <AvatarImage
                  alt="U2"
                  src="https://images.unsplash.com/photo-1628157588553-5eeea00af15c?w=96&h=96&dpr=2&q=80"
                />
                <AvatarFallback>U2</AvatarFallback>
              </Avatar>
            </div>
            <p className="text-sm tracking-tight text-muted-foreground">
              124 reviews
            </p>
          </div>
        </div>
        <div>
          <div className="mx-auto flex min-h-[288px] max-w-[80vw] shrink-0 flex-col items-center justify-center gap-2 px-2 py-4 sm:px-16 lg:px-24">
            <h1 className="max-w-5xl! text-pretty text-center text-[clamp(32px,7vw,64px)] font-medium leading-none tracking-[-1.44px] text-[--text-primary] dark:text-[--dark-text-primary] md:tracking-[-2.16px]">
              Never Lose a Prop Firm Payout Again
            </h1>
            <h2 className="text-md max-w-2xl text-pretty text-center text-muted-foreground md:text-lg">
              Real-time compliance monitoring and AI-powered journaling for
              serious forex traders
            </h2>
          </div>
        </div>
        <div className="flex items-start justify-center px-8 sm:px-24">
          <div className="flex w-full max-w-[80vw] flex-col items-center justify-start md:max-w-[392px]">
            <Link
              className={clsx(
                "h-14! flex-col border items-center justify-center rounded-none text-base! text-primary-foreground hover:bg-muted",
                "flex w-full"
              )}
              href="/signup"
            >
              Watch Demo
            </Link>
            <Link
              className={clsx(
                "h-14! flex-col items-center justify-center rounded-none text-base! bg-primary text-primary-foreground hover:bg-primary/90",
                "flex w-full"
              )}
              href="/signup"
            >
              Get Started for Free
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
