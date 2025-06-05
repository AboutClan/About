import { Divider as ChakraDivder } from "@chakra-ui/react";
export default function Divider({ type = 100 }: { type?: 100 | 200 }) {
  return <ChakraDivder h="8px" bgColor={`gray.${type}`} />;
}
