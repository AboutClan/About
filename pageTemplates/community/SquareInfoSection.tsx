import { Box } from "@chakra-ui/react";

import SecretSquareCategories from "./SecretSquareCategories";

function SquareSecretSection() {
  // const { data: session } = useSession();
  // const [category, setCategory] = useState<SecretSquareCategoryWithAll>("전체");
  // const [cursor, setCursor] = useState(0);
  // const [sqaures, setSqaures] = useState<SecretSquareListResponse["squareList"]>([]);

  // const isGuest = session?.user.role === "guest";
  // const loader = useRef<HTMLDivElement | null>(null);
  // const firstLoad = useRef(true);

  // const { data, isLoading } = useSecretSquareListQuery(
  //   { category, cursor },
  //   {
  //     enabled: (!!category && cursor === 0 && firstLoad.current) || cursor !== 0,
  //   },
  // );

  // useEffect(() => {
  //   firstLoad.current = true;
  //   setSqaures([]);
  //   setCursor(0);
  // }, [category]);

  // useEffect(() => {
  //   if (data) {
  //     setSqaures((old) => [...old, ...data.squareList]);
  //     firstLoad.current = false;
  //   }
  // }, [data]);

  // useEffect(() => {
  //   const observer = new IntersectionObserver(
  //     (entries) => {
  //       if (entries[0].isIntersecting && !firstLoad.current) {
  //         setCursor((prevCursor) => prevCursor + 1);
  //       }
  //     },
  //     { threshold: 1.0 },
  //   );
  //   if (loader.current) {
  //     observer.observe(loader.current);
  //   }
  //   return () => {
  //     if (loader.current) {
  //       observer.unobserve(loader.current);
  //     }
  //   };
  // }, []);

  return (
    <>
      <SecretSquareCategories type="info" category="전체" setCategory={() => {}} />
      <Box pb="80px">
        <Box as="p" fontSize="18px" mt={20} textAlign="center">
          여름 시즌을 위한 &apos;팀원 모집&apos; / &apos;정보&apos; / &apos;홍보&apos; 등
          <br /> <b>6월 29일(일) 오픈!</b>
        </Box>
        {/* {sqaures && sqaures.length === 0 && data ? (
          <Flex fontSize="18px" height="200px" justify="center" align="center">
            가장 먼저 &ldquo;#{category}&rdquo;에 글을 남겨보세요!
          </Flex>
        ) : (
          <>
            {sqaures.map((squareItem) => (
              <BlurredPart key={squareItem._id} isBlur={!!isGuest}>
                <SquareItem item={squareItem} />
              </BlurredPart>
            ))}
          </>
        )}
        <div ref={loader} />
        {isLoading && (
          <Box position="relative" mt="60px" mb="40px">
            <MainLoadingAbsolute size="sm" />
          </Box>
        )} */}
      </Box>
    </>
  );
}

export default SquareSecretSection;
