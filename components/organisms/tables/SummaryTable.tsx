import { Table, TableContainer, Tbody, Td, Th, Thead, Tr } from "@chakra-ui/react";

interface ISummaryTable {
  headerInfos: string[];
  tableInfosArr: string[][];
  size: "sm" | "md" | "lg";
}

export default function SummaryTable({ headerInfos, tableInfosArr, size = "md" }: ISummaryTable) {
  return (
    <TableContainer color="var(--gray-700)" overflow="hidden" p="0 10px" fontSize="12px">
      <Table size={size}>
        <Thead h="44px">
          <Tr>
            {headerInfos.map((info, idx) => (
              <Th key={idx} textAlign="center" p="0px 12px" fontSize="12px">
                {info}
              </Th>
            ))}
          </Tr>
        </Thead>
        <Tbody>
          {tableInfosArr.map((info, idx) => (
            <Tr key={idx} h="44px">
              {info.map((content, idx) => (
                <Td key={idx} fontWeight={400} textAlign="center" p="4px 12px">
                  {idx === 1 && headerInfos.length === 4
                    ? `${content}○`
                    : idx === 3 && content.length > 5
                      ? `${content.slice(0, 5)}...`
                      : content}
                </Td>
              ))}
            </Tr>
          ))}
        </Tbody>
      </Table>
    </TableContainer>
  );
}
