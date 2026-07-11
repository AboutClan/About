import { useRouter } from "next/router";
import { ParsedUrlQueryInput } from "querystring";
import { useCallback } from "react";

export const useOverlayRouter = () => {
   const router = useRouter();

   const buildNextQuery = useCallback(
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

       return nextQuery;
     },
     [router],
   );

   const updateQuery = useCallback(
     (query: ParsedUrlQueryInput) =>
       router.push(
         {
           pathname: router.pathname,
           query: buildNextQuery(query),
         },
         undefined,
         {
           shallow: true,
           scroll: false,
         },
       ),
     [router, buildNextQuery],
   );

   // updateQuery(push)와 달리 현재 히스토리 엔트리를 대체한다.
   // 직전에 쌓인 모달 상태(예: addCafe)를 그대로 남겨두면 안 되는 경우에 사용.
   const replaceQuery = useCallback(
     (query: ParsedUrlQueryInput) =>
       router.replace(
         {
           pathname: router.pathname,
           query: buildNextQuery(query),
         },
         undefined,
         {
           shallow: true,
           scroll: false,
         },
       ),
     [router, buildNextQuery],
   );

   return { updateQuery, replaceQuery };
};
