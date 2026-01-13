import { useMutation, useQuery } from "@tanstack/react-query";
import { apiFetch } from "@/lib/api";

interface SendMagicLinkData {
  email: string;
}

export function useSendMagicLink() {
  return useMutation({
    mutationFn: (data: SendMagicLinkData) =>
      apiFetch("/auth/magiclink", {
        method: "POST",
        body: JSON.stringify(data),
      }),
    onSuccess: (data) => {
      console.log("Magic link sent successfully:", data);
    },
    onError: (error) => {
      console.error("Failed to send magic link:", error);
    },
  });
}

export function useValidateMagicLink() {
  return useMutation({
    mutationFn: (token: string) =>
      apiFetch(`/auth/magiclink/validate?token=${token}`, {
        method: "GET",
      }),
  });
}

export function useRevokeAuth() {
  return useMutation({
    mutationFn: () =>
      apiFetch("/auth/magiclink/revoke", {
        method: "POST",
      }),
  });
}

export function useRefreshToken() {
  return useMutation({
    mutationFn: () =>
      apiFetch("/auth/refresh-token", {
        method: "POST",
      }),
  });
}

export function useGenerateQR(requestId: string | null) {
  return useQuery({
    queryKey: ["auth", "qr", requestId],
    queryFn: () =>
      apiFetch<{ success: boolean; qrCodeUrl: string }>(
        `/auth/qr?requestId=${requestId}`
      ),
    enabled: !!requestId,
  });
}

export function usePollAuthStatus(email: string | null) {
  return useQuery({
    queryKey: ["auth", "status", email],
    queryFn: () =>
      apiFetch<{ status: "pending" | "validated" | "not_started" }>(
        "/auth/poll",
        {
          method: "POST",
          body: JSON.stringify({ email }),
        }
      ),
    enabled: !!email,
    refetchInterval: (query) =>
      query.state.data?.status === "validated" ? false : 2000,
  });
}

export function useContinueOnDevice() {
  return useMutation({
    mutationFn: (requestId: string) =>
      apiFetch<{ success: boolean; user: any }>("/auth/continue", {
        method: "POST",
        body: JSON.stringify({ requestId }),
      }),
  });
}

export function usePollQRStatus(requestId: string | null) {
  return useQuery({
    queryKey: ["auth", "qr-status", requestId],
    queryFn: () =>
      apiFetch<{ status: "pending" | "authenticated"; token?: string }>(
        `/auth/qr-status?requestId=${requestId}`
      ),
    enabled: !!requestId,
    refetchInterval: (query) =>
      query.state.data?.status === "authenticated" ? false : 2000,
  });
}
