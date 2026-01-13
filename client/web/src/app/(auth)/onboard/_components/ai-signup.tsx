function AIMatchSignUpModal() {
  return (
    <Dialog>
      <div className="max-w-md p-6">
        <h3 className="mb-2 text-2xl font-medium">
          Get AI-Matched Firm Recommendations
        </h3>
        <p className="mb-6 text-sm text-muted-foreground">
          Create your free account to unlock personalized recommendations based
          on your trading style.
        </p>

        {/* Benefits */}
        <div className="mb-6 space-y-3">
          <BenefitItem icon="sparkles" text="AI analyzes your trading style" />
          <BenefitItem
            icon="shield"
            text="See compatibility scores for each firm"
          />
          <BenefitItem icon="alert" text="Avoid firms with conflicting rules" />
          <BenefitItem
            icon="chart"
            text="Track challenge progress after purchase"
          />
        </div>

        {/* Auth Options */}
        <Button className="w-full" size="lg">
          <svg className="mr-2 h-5 w-5" /* Google icon */ />
          Continue with Google
        </Button>

        <div className="my-4 flex items-center gap-2">
          <div className="h-px flex-1 bg-border" />
          <span className="text-xs text-muted-foreground">OR</span>
          <div className="h-px flex-1 bg-border" />
        </div>

        <form onSubmit={sendMagicLink}>
          <input
            type="email"
            placeholder="your@email.com"
            className="mb-3 w-full rounded-lg border px-4 py-3"
          />
          <Button type="submit" variant="outline" className="w-full" size="lg">
            Send Magic Link
          </Button>
        </form>

        <p className="mt-4 text-center text-xs text-muted-foreground">
          Free forever • No credit card required
        </p>
      </div>
    </Dialog>
  );
}
