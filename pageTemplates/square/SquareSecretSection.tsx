import { Box, Flex } from "@chakra-ui/react";
import { useEffect, useRef, useState } from "react";

import { MainLoadingAbsolute } from "../../components/atoms/loaders/MainLoading";
import {
  SecretSquareListResponse,
  useSecretSquareListQuery,
} from "../../hooks/secretSquare/queries";
import { type SecretSquareCategoryWithAll } from "../../types/models/square";
import SecretSquareCategories from "./SecretSquare/SecretSquareCategories";
import SquareItem from "./SecretSquare/SquareItem";

function SquareSecretSection() {
  const [category, setCategory] = useState<SecretSquareCategoryWithAll>("전체");
  const [cursor, setCursor] = useState(0);
  const [sqaures, setSqaures] = useState<SecretSquareListResponse["squareList"]>([]);

  const loader = useRef<HTMLDivElement | null>(null);
  const firstLoad = useRef(true);

  const { data, isLoading } = useSecretSquareListQuery(
    { category, cursor },
    {
      enabled: (!!category && cursor === 0 && firstLoad.current) || cursor !== 0,
    },
  );

  useEffect(() => {
    firstLoad.current = true;
    setSqaures([]);
    setCursor(0);
  }, [category]);

  useEffect(() => {
    if (data) {
      setSqaures((old) => [...old, ...data.squareList]);
      firstLoad.current = false;
    }
  }, [data]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !firstLoad.current) {
          setCursor((prevCursor) => prevCursor + 1);
        }
      },
      { threshold: 1.0 },
    );
    if (loader.current) {
      observer.observe(loader.current);
    }
    return () => {
      if (loader.current) {
        observer.unobserve(loader.current);
      }
    };
  }, []);

  return (
    <>
      <SecretSquareCategories category={category} setCategory={setCategory} />
      <Box pb="80px">
        {sqaures && sqaures.length === 0 && data ? (
          <Flex fontSize="18px" height="200px" justify="center" align="center">
            가장 먼저 &ldquo;#{category}&rdquo;에 글을 남겨보세요!
          </Flex>
        ) : (
          <>
            {sqaures.map((squareItem) => (
              <SquareItem key={squareItem._id} item={squareItem} />
            ))}
          </>
        )}
        <div ref={loader} />
        {isLoading && (
          <Box position="relative" mt="60px" mb="40px">
            <MainLoadingAbsolute size="sm" />
          </Box>
        )}
      </Box>
    </>
  );
}

export default SquareSecretSection;
