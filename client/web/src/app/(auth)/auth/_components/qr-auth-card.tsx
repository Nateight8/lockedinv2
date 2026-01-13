"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { useGenerateQR, useContinueOnDevice } from "@/hooks/use-auth";
import { useRouter } from "next/navigation";

interface QRAuthCardProps {
  requestId: string;
}

export function QRAuthCard({ requestId }: QRAuthCardProps) {
  const router = useRouter();
  const {
    data,
    isLoading: qrLoading,
    error: qrError,
  } = useGenerateQR(requestId);
  const { mutate: continueOnDevice, isPending: continueLoading } =
    useContinueOnDevice();

  const handleContinue = () => {
    continueOnDevice(requestId, {
      onSuccess: (response) => {
        if (response.success) {
          router.push("/");
        }
      },
      onError: (error) => {
        if (error.message === "Invalid or expired session") {
          router.push("/auth/error?reason=expired_token");
        }
      },
    });
  };

  if (qrLoading) {
    return (
      <div className="flex flex-col items-center justify-center p-8 space-y-4">
        <div className="w-48 h-48 bg-muted animate-pulse rounded-lg" />
        <p className="text-sm text-muted-foreground">Generating QR code...</p>
      </div>
    );
  }

  if (qrError) {
    return (
      <div className="flex flex-col items-center justify-center p-8 text-center space-y-4">
        <p className="text-sm text-destructive">
          Failed to load QR code. Please try again.
        </p>
        <Button variant="outline" onClick={() => window.location.reload()}>
          Retry
        </Button>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center space-y-6">
      <div className="flex flex-col items-center space-y-4 text-center">
        <h1 className="text-2xl font-semibold tracking-tight">Authenticate</h1>
        <p className="text-sm text-muted-foreground">
          Scan this QR code with your mobile app to authenticate instantly.
        </p>
      </div>

      <div className="relative p-4 bg-white rounded-2xl shadow-sm border">
        {data?.qrCodeUrl && (
          <img
            src={data.qrCodeUrl}
            alt="Authentication QR Code"
            className="w-48 h-48"
          />
        )}
      </div>

      <div className="relative w-full">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-background px-2 text-muted-foreground">Or</span>
        </div>
      </div>

      <Button
        className="w-full"
        variant="secondary"
        size="lg"
        onClick={handleContinue}
        disabled={continueLoading}
      >
        {continueLoading ? "Authenticating..." : "Continue on this device"}
      </Button>
    </div>
  );
}
