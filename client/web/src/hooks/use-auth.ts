import { useMutation } from "@tanstack/react-query";
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
