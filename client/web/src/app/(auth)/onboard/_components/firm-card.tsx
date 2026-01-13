function FirmCard({ firm, isAuthenticated }) {
  const [isComparing, setIsComparing] = useState(false);
  
  return (
    <div className="group relative p-8 transition-colors hover:bg-muted/30">
      <div className="flex items-start gap-6">
        {/* Left: Firm Logo & Info */}
        <div className="flex-1">
          <div className="mb-4 flex items-start justify-between">
            <div className="flex items-center gap-3">
              {/* Firm Logo */}
              <div className="h-12 w-12 rounded-lg border bg-background p-2">
                <img src={firm.logo} alt={firm.name} />
              </div>
              
              <div>
                <h4 className="text-xl font-medium">{firm.name}</h4>
                <div className="mt-1 flex items-center gap-2">
                  {/* Star Rating */}
                  <div className="flex gap-0.5">
                    {[...Array(5)].map((_, i) => (
                      <svg key={i} className="h-4 w-4 fill-yellow-400" />
                    ))}
                  </div>
                  <span className="text-sm text-muted-foreground">
                    4.8 (247 reviews)
                  </span>
                </div>
              </div>
            </div>
            
            {/* Compare Checkbox */}
            <label className="flex cursor-pointer items-center gap-2 rounded-md border px-3 py-1.5 text-sm transition-colors hover:bg-muted">
              <input
                type="checkbox"
                checked={isComparing}
                onChange={(e) => setIsComparing(e.target.checked)}
                className="h-4 w-4"
              />
              Compare
            </label>
          </div>
          
          {/* Pass Rate Badge */}
          <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-green-500/10 px-3 py-1">
            <svg className="h-4 w-4 text-green-600" /* checkmark */ />
            <span className="text-sm font-medium text-green-700 dark:text-green-400">
              {firm.lockedInPassRate}% LockedIn Pass Rate
            </span>
            <span className="text-xs text-muted-foreground">
              (from {firm.userCount} users)
            </span>
          </div>
          
          {/* Pricing */}
          <div className="mb-4">
            <div className="flex items-baseline gap-2">
              <span className="text-sm text-muted-foreground line-through">
                ${firm.regularPrice}
              </span>
              <span className="text-3xl font-semibold">
                ${firm.discountedPrice}
              </span>
              <span className="rounded-full bg-primary/10 px-2 py-0.5 text-sm font-medium text-primary">
                Save ${firm.regularPrice - firm.discountedPrice}
              </span>
            </div>
            <p className="mt-1 text-sm text-muted-foreground">
              {firm.accountSize} Challenge • {firm.accountType}
            </p>
          </div>
          
          {/* Key Rules Grid */}
          <div className="mb-6 grid grid-cols-2 gap-3">
            <RuleItem
              icon="target"
              label="Profit Target"
              value={`${firm.profitTarget}%`}
              status="neutral"
            />
            <RuleItem
              icon="alert"
              label="Daily Loss Limit"
              value={`${firm.dailyLossLimit}%`}
              status={firm.dailyLossLimit <= 5 ? "warning" : "neutral"}
            />
            <RuleItem
              icon="calendar"
              label="Weekend Holding"
              value={firm.weekendHolding ? "Allowed" : "Prohibited"}
              status={firm.weekendHolding ? "success" : "warning"}
            />
            <RuleItem
              icon="chart"
              label="Consistency Rule"
              value={firm.consistencyRule ? `${firm.consistencyRule}%` : "None"}
              status={firm.consistencyRule ? "warning" : "success"}
            />
          </div>
          
          {/* Expandable Details */}
          <details className="group/details">
            <summary className="flex cursor-pointer items-center gap-2 text-sm font-medium text-primary">
              <span>View All {firm.totalRules} Rules</span>
              <svg className="h-4 w-4 transition-transform group-open/details:rotate-180" />
            </summary>
            
            <div className="mt-4 grid grid-cols-2 gap-3 rounded-lg border bg-muted/30 p-4">
              {firm.allRules.map((rule) => (
                <RuleItem key={rule.id} {...rule} />
              ))}
            </div>
          </details>
        </div>
        
        {/* Right: CTAs */}
        <div className="flex w-64 flex-col gap-3">
          {/* Primary CTA: Visit Site (Affiliate Link) */}
          
            href={firm.affiliateUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex h-12 items-center justify-center gap-2 rounded-lg bg-primary text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            <span>Buy Challenge</span>
            <svg className="h-4 w-4" /* external link icon */ />
          </a>
          
          {/* Secondary CTA: Track Challenge (Requires Auth) */}
          {!isAuthenticated ? (
            <button
              onClick={() => openSignUpModal('track_challenge', firm)}
              className="flex h-12 items-center justify-center gap-2 rounded-lg border bg-background text-sm font-medium transition-colors hover:bg-muted"
            >
              <svg className="h-4 w-4" /* lock icon */ />
              <span>Track This Challenge</span>
            </button>
          ) : (
            <button
              onClick={() => connectChallenge(firm)}
              className="flex h-12 items-center justify-center gap-2 rounded-lg border bg-background text-sm font-medium transition-colors hover:bg-muted"
            >
              <svg className="h-4 w-4" /* chart icon */ />
              <span>Start Tracking</span>
            </button>
          )}
          
          {/* Tertiary: Save/Favorite */}
          {!isAuthenticated ? (
            <button
              onClick={() => openSignUpModal('save_firm', firm)}
              className="flex h-10 items-center justify-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
            >
              <svg className="h-4 w-4" /* heart icon */ />
              <span>Save for Later</span>
            </button>
          ) : (
            <button
              onClick={() => toggleFavorite(firm)}
              className="flex h-10 items-center justify-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
            >
              <svg className="h-4 w-4 fill-current" /* filled heart */ />
              <span>Saved</span>
            </button>
          )}
          
          {/* Social Proof */}
          <div className="mt-2 rounded-lg border bg-muted/30 p-3">
            <p className="text-xs text-muted-foreground">
              <span className="font-medium text-foreground">
                {firm.recentPurchases}
              </span>{" "}
              traders bought this week
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}