/* eslint-disable */

import {
  Accordion,
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Box,
  Button,
  Popover,
  PopoverArrow,
  PopoverBody,
  PopoverCloseButton,
  PopoverContent,
  PopoverFooter,
  PopoverHeader,
  PopoverTrigger,
  Portal,
} from "@chakra-ui/react";
import { faChevronLeft, faChevronRight } from "@fortawesome/pro-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import dayjs from "dayjs";
import { useState } from "react";
import styled from "styled-components";

import Header from "../../../components/layouts/Header";
import { useStudyVoteQuery } from "../../../hooks/study/queries";
import { StudyStatus } from "../../../types/models/studyTypes/studyDetails";
import { IUser } from "../../../types/models/userTypes/userInfoTypes";
import { dayjsToStr } from "../../../utils/dateTimeUtils";

const LOCATION = ["SUWAN", "YANG"];

function AdminStudyStatus() {
  const [date, setDate] = useState(dayjs());
  const { data: SUWAN } = useStudyVoteQuery(dayjsToStr(date), "수원");
  const { data: YANG } = useStudyVoteQuery(dayjsToStr(date), "양천");

  console.log(date, SUWAN);

  const handleStatus = (type: StudyStatus) => {};

  return (
    <>
      <Header title="스터디 상태 관리" />
      <Layout>
        <Date>
          <FontAwesomeIcon
            icon={faChevronLeft}
            color="var(--gray-2)"
            onClick={() => setDate((old) => old.subtract(1, "day"))}
          />
          <span>{date.format("M월 DD일")}</span>
          <FontAwesomeIcon
            icon={faChevronRight}
            color="var(--gray-2)"
            onClick={() => setDate((old) => old.add(1, "day"))}
          />
        </Date>
        <Main>
          {LOCATION.map((place) => (
            <Section key={place}>
              <SectionHeader>{place}</SectionHeader>
              <Accordion defaultIndex={[0]} allowMultiple>
                {(place === "SUWAN" ? SUWAN : YANG).map((place) => (
                  <AccordionItem key={place.place._id}>
                    <h2>
                      <AccordionButton background="gray.200" borderBottom="1px solid lightGray">
                        <Box as="span" flex="1" textAlign="left" fontWeight="600">
                          {place.place.brand} / {place.attendences.length}명 /{place.status}
                        </Box>
                        <AccordionIcon />
                      </AccordionButton>
                    </h2>
                    <AccordionPanel pb={4}>
                      <SpaceItem>
                        <div>
                          <span style={{ fontSize: "15px" }}>상태: {place.status}</span>
                          <Popover>
                            <PopoverTrigger>
                              <Button>Trigger</Button>
                            </PopoverTrigger>
                            <Portal>
                              <PopoverContent>
                                <PopoverArrow />
                                <PopoverHeader>Header</PopoverHeader>
                                <PopoverCloseButton />
                                <PopoverBody>
                                  <Button size="sm" ml="2" onClick={() => handleStatus("open")}>
                                    open
                                  </Button>
                                  <Button
                                    size="sm"
                                    ml="2"
                                    onClick={() => handleStatus("dismissed")}
                                  >
                                    dismissed
                                  </Button>
                                  <Button size="sm" ml="2" onClick={() => handleStatus("pending")}>
                                    pending
                                  </Button>
                                </PopoverBody>
                                <PopoverFooter>This is the footer</PopoverFooter>
                              </PopoverContent>
                            </Portal>
                          </Popover>
                        </div>
                        <Participant>
                          {place?.attendences.map((who, idx) => (
                            <Att key={idx}>
                              <span> {(who.user as IUser).name}</span>
                              {/* <Delete onClick={() => handleDeleteUser(who)}>
                                <FontAwesomeIcon icon={faDeleteLeft} />
                              </Delete> */}
                              temp
                            </Att>
                          ))}
                        </Participant>
                      </SpaceItem>
                    </AccordionPanel>
                  </AccordionItem>
                ))}
              </Accordion>
            </Section>
          ))}
        </Main>
      </Layout>
    </>
  );
}

const Layout = styled.div`
  display: flex;
  flex-direction: column;
`;

const Date = styled.div`
  text-align: center;
  margin-top: 12px;
  > span {
    font-size: 18px;
    font-weight: 600;
    margin: 0 12px;
  }
`;

const Main = styled.main`
  padding: 14px;
`;

const Section = styled.section`
  margin-bottom: 12px;
`;

const SectionHeader = styled.header`
  font-size: 16px;
  font-weight: 600;
  margin-bottom: 12px;
`;

const SpaceItem = styled.div``;

const Name = styled.div``;

const Participant = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(20%, auto));
  margin-top: 6px;
`;

const Att = styled.div`
  margin-right: 4px;
  display: flex;
  justify-content: space-around;
`;

const Delete = styled.div``;

export default AdminStudyStatus;
