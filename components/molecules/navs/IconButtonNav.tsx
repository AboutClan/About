import { Flex } from "@chakra-ui/react";
import Link from "next/link";

import IconButton from "../../atoms/buttons/IconButton";

export interface IIconButtonNavBtn {
  icon: React.ReactNode;
  func?: () => void;
  link?: string;
}

interface IIconButtonNav {
  iconList: IIconButtonNavBtn[];
}

export default function IconButtonNav({ iconList }: IIconButtonNav) {
  return (
    <Flex h="100%" alignItems="center" as="nav">
      {iconList.map((icon, idx) => (
        <Flex w="32x" h="32x" justify="center" align="center" fontSize="18px" key={idx}>
          {icon?.link ? (
            <Link style={{ position: "relative" }} href={icon.link} onClick={icon?.func}>
              {icon.icon}
            </Link>
          ) : (
            <IconButton onClick={icon.func}>{icon.icon}</IconButton>
          )}
        </Flex>
      ))}
    </Flex>
  );
}
