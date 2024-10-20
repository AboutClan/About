import { Box } from "@chakra-ui/react";
import Image from "next/image";
import { useSession } from "next-auth/react";

import { useTogglePlaceHeart } from "../../hooks/custom/CustomHooks";
import { useUserInfoQuery } from "../../hooks/user/queries";
import { HeartIcon } from "../Icons/HeartIcons";

interface PlaceHeartImageProps {
  imageProps: {
    image: string;
    isPriority?: boolean;
  };
  id?: string;
  hasToggleHeart?: boolean;
  selected?: "main" | "sub" | null;
  size: "sm" | "md" | "lg";
}

function PlaceImage({ imageProps, id, hasToggleHeart, selected, size }: PlaceHeartImageProps) {
  const { data: session } = useSession();
  const isGuest = session?.user.name === "guest";

  const { data: userInfo, isLoading: userLoading } = useUserInfoQuery({
    enabled: isGuest === false,
  });
  const preference = userInfo?.studyPreference;
  const myPreferType =
    preference?.place === id ? "main" : preference?.subPlace?.includes(id) ? "sub" : null;

  const toggleHeart = useTogglePlaceHeart();

  const sizeLength =
    size === "sm" ? "60px" : size === "md" ? "80px" : size === "lg" ? "100px" : null;
 
  return (
    <Box
      borderRadius={size === "md" ? "4px" : "12px"}
      position="relative"
      overflow="hidden"
      border={
        selected === "main"
          ? "2px solid var(--color-mint)"
          : selected === "sub"
            ? "2px solid var(--color-orange)"
            : null
      }
      boxShadow={
        selected === "main"
          ? " 0px 5px 10px 0px #1BB8760A"
          : selected === "sub"
            ? "0px 5px 10px 0px #1BB8760A"
            : null
      }
      w={sizeLength}
      h={sizeLength}
    >
      <Image
        src={imageProps.image}
        alt="thumbnailImage"
        sizes={sizeLength}
        fill
        priority={imageProps?.isPriority}
        style={{ objectPosition: "center", objectFit: "cover" }}
      />
      {selected === "main" && (
        <Box pos="absolute" top={1} right={1} color="white">
          <CheckCircleSvg />
        </Box>
      )}
      {hasToggleHeart && (
        <Box
          pos="absolute"
          w={4}
          h={4}
          bottom={1.5}
          right={1.5}
          color="white"
          onClick={(e) => toggleHeart(e, preference, id, userLoading)}
        >
          {myPreferType ? (
            <HeartIcon fill color={myPreferType === "main" ? "red" : "orange"} />
          ) : (
            <HeartIcon fill={false} />
          )}
        </Box>
      )}
    </Box>
  );
}

function CheckCircleSvg() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="13" height="12" viewBox="0 0 13 12" fill="none">
      <rect x="0.5" y="0.000488281" width="12" height="11.9996" rx="5.99981" fill="white" />
      <g clipPath="url(#clip0_78_554)">
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M9.1035 5.10784L6.312 7.89975C6.21796 7.99315 6.09079 8.04556 5.95825 8.04556C5.82571 8.04556 5.69854 7.99315 5.6045 7.89975L3.8965 6.1918C3.85008 6.14538 3.81325 6.09027 3.78813 6.02962C3.76301 5.96897 3.75008 5.90396 3.75008 5.83832C3.75008 5.70573 3.80275 5.57858 3.8965 5.48483C3.99025 5.39108 4.11741 5.33841 4.25 5.33841C4.38259 5.33841 4.50975 5.39108 4.6035 5.48483L5.958 6.83928L8.3965 4.40086C8.44292 4.35444 8.49803 4.31762 8.55869 4.2925C8.61934 4.26737 8.68435 4.25444 8.75 4.25444C8.81565 4.25444 8.88066 4.26737 8.94131 4.2925C9.00197 4.31762 9.05708 4.35444 9.1035 4.40086C9.14992 4.44728 9.18675 4.50239 9.21187 4.56304C9.23699 4.6237 9.24992 4.6887 9.24992 4.75435C9.24992 4.82 9.23699 4.88501 9.21187 4.94566C9.18675 5.00631 9.14992 5.06142 9.1035 5.10784ZM6.5 0.500488C3.4625 0.500488 1 2.96291 1 6.00031C1 9.03771 3.4625 11.5001 6.5 11.5001C9.5375 11.5001 12 9.03771 12 6.00031C12 2.96291 9.5375 0.500488 6.5 0.500488Z"
          fill="#00C2B3"
        />
      </g>
      <defs>
        <clipPath id="clip0_78_554">
          <rect width="12" height="11.9996" fill="white" transform="translate(0.5 0.000488281)" />
        </clipPath>
      </defs>
    </svg>
  );
}

export default PlaceImage;
