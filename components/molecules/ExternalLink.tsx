import { Link, LinkProps } from "@chakra-ui/react";
import NextLink from "next/link";
import { forwardRef, useCallback } from "react";

import { isWebView } from "../../utils/appEnvUtils";
import { nativeMethodUtils } from "../../utils/nativeMethodUtils";

interface ExternalLinkProps extends Omit<LinkProps, "href"> {
  href: string;
  className?: string;
}

const ExternalLink = forwardRef<HTMLAnchorElement, ExternalLinkProps>(
  ({ href, className, children, ...rest }, ref) => {
    const handleClick = useCallback(() => {
      if (isWebView()) {
        nativeMethodUtils.openExternalLink(href);
      }
    }, [href]);

    if (isWebView()) {
      return (
        <Link
          as="button"
          className={className}
          color="blue"
          onClick={handleClick}
          ref={ref}
          {...rest}
        >
          {children}
        </Link>
      );
    }

    return (
      <Link
        href={href}
        as={NextLink}
        className={className}
        color="blue"
        isExternal
        ref={ref}
        {...rest}
      >
        {children}
      </Link>
    );
  },
);

ExternalLink.displayName = "ExternalLink";

export default ExternalLink;
