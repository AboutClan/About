import { useRouter, useSearchParams } from "next/navigation";
import { useCallback } from "react";

// Custom hook for updating URL parameters
function useUpdateUrlParams() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Function to update the URL parameters
  const updateUrlParams = useCallback(
    (newParams) => {
      const newSearchParams = new URLSearchParams(searchParams);

      // Update new parameters
      Object.keys(newParams).forEach((key) => {
        newSearchParams.set(key, newParams[key]);
      });

      // Update the URL with the new search parameters
      router.replace(`/studyPage?${newSearchParams.toString()}`);
    },
    [router, searchParams],
  );

  return updateUrlParams;
}

export default useUpdateUrlParams;
