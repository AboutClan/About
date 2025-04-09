import { Button } from "@chakra-ui/react";
import { useRouter } from "next/router";

import { EllipsisIcon } from "../../components/Icons/DotIcons";
import KakaoShareBtn from "../../components/Icons/KakaoShareBtn";
import Header from "../../components/layouts/Header";
import { MergePlaceInfoProps } from "../../libs/study/convertMergePlaceToPlace";
interface IStudyHeader {
  date: string;
  placeInfo: MergePlaceInfoProps;
}

function StudyHeader({ date, placeInfo }: IStudyHeader) {
  const router = useRouter();

  const onClick = () => {};

  return (
    <>
      <Header title={placeInfo.branch} isCenter defaultUrl="/home">
        <KakaoShareBtn
          img={placeInfo.image}
          title={placeInfo.name}
          subtitle={placeInfo.address}
          date={date}
          url={"https://study-about.club" + router.asPath}
        />
        <Button variant="unstyled" onClick={onClick}>
          <EllipsisIcon size="md" />
        </Button>
      </Header>
      {/* {isModal && <BottomButtonColDrawer infoArr={infoArr} setIsModal={setIsModal} />} */}
    </>
  );
}

export default StudyHeader;
