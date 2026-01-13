import { Button } from "@/components/ui/button";

export default function OnboardPage() {
  return (
    <div>
      <section className="relative min-h-screen border-t">
        {/* Sticky Section Header (appears when scrolling) */}
        <div className="sticky bg-background top-0 z-30 backdrop-blur supports-backdrop-filter:bg-background/60">
          <div className="grid grid-cols-[clamp(28px,10vw,120px)_auto_clamp(28px,10vw,120px)] border-b">
            <div className="col-span-1" />
            <div className="col-span-1 border-x px-6 py-4">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-medium">Prop Firm Marketplace</h3>

                {/* Quick Filters */}
                <div className="flex gap-2">
                  <select className="rounded border px-3 py-1.5 text-sm">
                    <option>All Sizes</option>
                    <option>$10K</option>
                    <option>$25K</option>
                    <option>$50K</option>
                    <option>$100K+</option>
                  </select>

                  <select className="rounded border px-3 py-1.5 text-sm">
                    <option>Sort: Most Popular</option>
                    <option>Highest Pass Rate</option>
                    <option>Best Discount</option>
                    <option>Easiest Rules</option>
                  </select>
                </div>
              </div>
            </div>
            <div className="col-span-1" />
          </div>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-[clamp(28px,10vw,120px)_auto_clamp(28px,10vw,120px)]">
          <div className="col-span-1" />

          <div className="col-span-1 border-x">
            {/* AI Recommendation Teaser (Anonymous State) */}
            <div className="border-b bg-muted/30 p-8">
              <div className="mx-auto max-w-4xl">
                <div className="flex items-start gap-6">
                  <div className="flex-1">
                    <div className="mb-2 flex items-center gap-2">
                      <svg
                        className="h-5 w-5 text-primary" /* AI sparkle icon */
                      />
                      <span className="text-sm font-medium text-primary">
                        AI-Powered Matching
                      </span>
                    </div>

                    <h3 className="mb-2 text-2xl font-medium">
                      Find Your Perfect Prop Firm in 60 Seconds
                    </h3>

                    <p className="mb-4 text-muted-foreground">
                      Answer 5 quick questions about your trading style and get
                      personalized recommendations with compatibility scores.
                    </p>

                    <Button size="lg" className="gap-2">
                      <svg className="h-4 w-4" /* sparkle icon */ />
                      Get Personalized Recommendations
                    </Button>

                    <p className="mt-2 text-xs text-muted-foreground">
                      Free • No credit card required
                    </p>
                  </div>

                  {/* Blurred Preview */}
                  <div className="relative hidden w-80 lg:block">
                    <div className="rounded-lg border bg-background p-4">
                      <div className="mb-3 text-sm font-medium">
                        Your Top Matches:
                      </div>

                      {/* Blurred content */}
                      <div className="space-y-2 blur-sm">
                        <div className="flex items-center gap-2">
                          <div className="h-8 w-8 rounded bg-green-500/20" />
                          <div className="flex-1">
                            <div className="h-4 w-24 rounded bg-muted" />
                            <div className="mt-1 h-3 w-16 rounded bg-muted/50" />
                          </div>
                          <div className="text-sm font-medium text-green-600">
                            92%
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          <div className="h-8 w-8 rounded bg-green-500/20" />
                          <div className="flex-1">
                            <div className="h-4 w-32 rounded bg-muted" />
                            <div className="mt-1 h-3 w-20 rounded bg-muted/50" />
                          </div>
                          <div className="text-sm font-medium text-green-600">
                            87%
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Lock overlay */}
                    <div className="absolute inset-0 flex items-center justify-center rounded-lg bg-background/80">
                      <div className="flex flex-col items-center gap-2">
                        <svg
                          className="h-8 w-8 text-muted-foreground" /* lock icon */
                        />
                        <span className="text-sm font-medium">
                          Sign up to unlock
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Firm Comparison Grid */}
            <div className="divide-y">
              {/* {firms.map((firm) => (
                <FirmCard key={firm.id} firm={firm} isAuthenticated={false} />
              ))} */}
            </div>

            {/* Load More */}
            <div className="flex justify-center p-8">
              <Button variant="outline" size="lg">
                Load More Firms (38 more)
              </Button>
            </div>
          </div>

          <div className="col-span-1" />
        </div>
      </section>
    </div>
  );
}
