import { useRouter } from "next/router";
import { ParsedUrlQueryInput } from "querystring";
import { useCallback } from "react";

export const useOverlayRouter = () => {
   const router = useRouter();

   const updateQuery = useCallback(
     (query: ParsedUrlQueryInput) => {
       const nextQuery = {
         ...router.query,
         ...query,
       };

       Object.keys(nextQuery).forEach((key) => {
         if (nextQuery[key] === undefined || nextQuery[key] === null) {
           delete nextQuery[key];
         }
       });

       return router.push(
         {
           pathname: router.pathname,
           query: nextQuery,
         },
         undefined,
         {
           shallow: true,
           scroll: false,
         },
       );
     },
     [router],
   );

   return { updateQuery };
};
