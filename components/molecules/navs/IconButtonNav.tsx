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
        <Flex w="28px" h="28px" justify="center" align="center" ml="8px" key={idx}>
          {icon?.link ? (
            <Link
              style={{ position: "relative", padding: "16px" }}
              href={icon.link}
              onClick={icon?.func}
            >
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
