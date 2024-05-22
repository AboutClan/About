/* eslint-disable */

import styled from "styled-components";

import { IModal } from "../../types/components/modalTypes";

export interface IContentPopUpContents {
  title: string;
  contents: { subtitle: string; content: string[] }[];
}

interface IContentPopUp extends IModal {
  content: IContentPopUpContents;
}

function ContentPopUp({ content, setIsModal }: IContentPopUp) {
  return (
    <>
      {/* <ModalLayout onClose={() => setIsModal(false)}>
        <ModalHeader text={content.title} />
        <ModalBody>
          <Wrapper>
            {content.contents.map((item, idx) => (
              <Container key={idx}>
                <Subtitile>{item.subtitle}</Subtitile>
                <Ul>
                  {item.content.map((text, idx2) => {
                    const textArr = text.split("/");

                    return (
                      <li key={idx2}>
                        {textArr[0]}
                        <b>{textArr[1]}</b>
                        {textArr[2]}
                      </li>
                    );
                  })}
                </Ul>
              </Container>
            ))}
          </Wrapper>
        </ModalBody>
        <ModalFooterOne onClick={() => setIsModal(false)} />
      </ModalLayout> */}
    </>
  );
}

const Subtitile = styled.div`
  font-size: 13px;
  font-weight: 600;
  margin-bottom: var(--gap-1);
`;

const Ul = styled.ul`
  font-size: 12px;

  margin-left: var(--gap-4);
`;
const Wrapper = styled.div`
  > div:first-child {
    margin-bottom: var(--gap-2);
  }
`;

const Container = styled.div``;

export default ContentPopUp;
