"use client";

import { useEffect, useState } from "react";
import { ApiResponse } from "@/types/booking";

const API_BASE = "https://knightsbridge.heartitout.in/webhook/api/hio/services/get_all_slots";

interface FetchSlotsParams {
  therapist_id: string;
  loc_id: string;
  service_id: string;
  get_more?: number;
}
export function useFetchSlots(params: FetchSlotsParams) {
  const [data, setData] = useState<ApiResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    async function fetchSlots() {
      try {
        setLoading(true);

        const res = await fetch(API_BASE, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            therapist_id: params.therapist_id,
            loc_id: params.loc_id,
            service_id: params.service_id,
            get_more: params.get_more ?? 0,
          }),
        });

        if (!res.ok) {
          throw new Error(`API error: ${res.status}`);
        }

        // 👇 SAFETY: read text first
        const text = await res.text();

        if (!text) {
          throw new Error("Empty response from API");
        }

        let json: ApiResponse;
        try {
          json = JSON.parse(text);
        } catch {
          console.error("Non-JSON response:", text);
          throw new Error("Invalid JSON returned by API");
        }

        setData(json);
        setError(null);
      } catch (err) {
        const error = err instanceof Error ? err : new Error("Unknown error");
        setError(error);
        console.error("Failed to fetch slots:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchSlots();
  }, [params.therapist_id, params.loc_id, params.service_id, params.get_more]);

  return { data, loading, error };
}
