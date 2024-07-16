import { Link } from "@chakra-ui/react";
import NextLink from "next/link";
import React, { type PropsWithChildren, type ReactHTML } from "react";

import { isWebView } from "../../utils/convertUtils/appEnvUtils";
import { NATIVE_METHODS } from "../../utils/nativeMethodUtils";

interface IExternalLink {
  href: string;
  className?: string;
  as?: keyof ReactHTML;
}

const ExternalLink = React.forwardRef<HTMLElement, PropsWithChildren<IExternalLink>>(
  (props, ref) => {
    const { as = "button", href, className, children } = props;

    if (isWebView()) {
      return React.createElement(
        as,
        {
          ...props,
          ref,
          className,
          onClick: () => NATIVE_METHODS.OPEN_EXTERNAL_LINK(href),
        },
        children,
      );
    }

    return (
      <Link href={href} as={NextLink} className={className} isExternal>
        {children}
      </Link>
    );
  },
);

if (process.env.NODE_ENV === "development") {
  ExternalLink.displayName = "ExternalLink";
}

export default ExternalLink;
