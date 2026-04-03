import { useEffect, useState } from "react";
import { fetchTheme4ModePayload } from "../services/theme4ContentClient";

export default function useTheme4ModeData(modeId, fallbackData) {
  const [data, setData] = useState(null);
  const [mode, setMode] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const controller = new AbortController();
    let cancelled = false;

    const load = async () => {
      setLoading(true);
      setError("");

      try {
        const payload = await fetchTheme4ModePayload(modeId, controller.signal);
        if (cancelled) return;

        setData(payload?.data ?? fallbackData);
        setMode(payload?.mode || null);
      } catch (fetchError) {
        if (cancelled || fetchError.name === "AbortError") return;

        console.error(`Unable to load Theme 4 mode "${modeId}"`, fetchError);
        setData(fallbackData);
        setMode(null);
        setError(fetchError.message || "Không tải được dữ liệu mode.");
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    load();

    return () => {
      cancelled = true;
      controller.abort();
    };
  }, [fallbackData, modeId]);

  return {
    data,
    mode,
    loading,
    error,
  };
}
