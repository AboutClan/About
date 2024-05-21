import { Table, TableContainer, Tbody, Td, Th, Thead, Tr } from "@chakra-ui/react";

interface ISummaryTable {
  headerInfos: string[];
  tableInfosArr: string[][];
  size: "sm" | "md" | "lg";
}

export default function SummaryTable({ headerInfos, tableInfosArr, size = "md" }: ISummaryTable) {
  return (
    <TableContainer overflow="hidden">
      <Table variant="striped" size={size} colorScheme="gray">
        <Thead>
          <Tr>
            {headerInfos.map((info, idx) => (
              <Th color="var(--gray-1)" key={idx} textAlign="center" p="4px 12px">
                {info}
              </Th>
            ))}
          </Tr>
        </Thead>
        <Tbody>
          {tableInfosArr.map((info, idx) => (
            <Tr key={idx}>
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
