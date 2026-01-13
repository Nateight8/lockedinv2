"use client";

import * as React from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { QRAuthCard } from "../_components/qr-auth-card";
import { usePollQRStatus } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import {
  WarningIcon,
  CheckCircleIcon,
  XCircleIcon,
  ClockClockwiseIcon,
} from "@phosphor-icons/react";

interface PageProps {
  params: Promise<{ qr: string }>;
}

export default function AuthDynamicPage({ params }: PageProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { qr: type } = React.use(params);

  const requestId = searchParams.get("requestId");
  const reason = searchParams.get("reason");

  const { data } = usePollQRStatus(type === "qr" ? requestId : null);

  React.useEffect(() => {
    if (data?.status === "authenticated") {
      router.push("/");
    }
  }, [data, router]);

  // Handle QR case
  if (type === "qr") {
    if (!requestId) {
      return (
        <ErrorState
          title="Invalid Request"
          message="The authentication request is missing or has expired."
        />
      );
    }
    return <QRAuthCard requestId={requestId} />;
  }

  // Handle Error case
  if (type === "error") {
    return <ErrorState reason={reason} />;
  }

  // Fallback
  return (
    <ErrorState
      title="Page Not Found"
      message="The page you are looking for does not exist."
    />
  );
}

function ErrorState({
  title,
  message,
  reason,
}: {
  title?: string;
  message?: string;
  reason?: string | null;
}) {
  const router = useRouter();

  const getErrorContent = () => {
    switch (reason) {
      case "expired_token":
        return {
          title: "Link Expired",
          message:
            "The magic link has expired for security reasons. Please request a new one.",
          icon: <ClockClockwiseIcon size={48} className="text-warning" />,
        };
      case "used_token":
        return {
          title: "Link Already Used",
          message:
            "This magic link has already been used to sign in. Please request a new link.",
          icon: <CheckCircleIcon size={48} className="text-secondary" />,
        };
      case "invalid_token":
        return {
          title: "Invalid Link",
          message:
            "The link you followed is invalid or has been tampered with.",
          icon: <XCircleIcon size={48} className="text-destructive" />,
        };
      default:
        return {
          title: title || "Something went wrong",
          message:
            message || "An unexpected error occurred during authentication.",
          icon: <WarningIcon size={48} className="text-destructive" />,
        };
    }
  };

  const {
    title: displayTitle,
    message: displayMessage,
    icon,
  } = getErrorContent();

  return (
    <div className="flex flex-col items-center justify-center text-center space-y-6 pt-4">
      <div className="p-3 bg-muted/30 rounded-full">{icon}</div>
      <div className="space-y-2">
        <h1 className="text-2xl font-semibold tracking-tight">
          {displayTitle}
        </h1>
        <p className="text-sm text-muted-foreground max-w-[280px] mx-auto">
          {displayMessage}
        </p>
      </div>
      <Button
        className="w-full"
        variant="secondary"
        onClick={() => router.push("/auth")}
      >
        Return to Login
      </Button>
    </div>
  );
}
