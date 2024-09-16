import { Box, Flex } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import Header from "../../../components/layouts/Header";
import ButtonGroups, {
  ButtonOptionsProps,
} from "../../../components/molecules/groups/ButtonGroups";
import ProfileDetailBlock from "../../../components/molecules/ProfileDetailBlock";
import { LOCATION_OPEN } from "../../../constants/location";
import { useUpdateProfileMutation } from "../../../hooks/admin/mutation";
import { useAdminLocationActiveQuery } from "../../../hooks/admin/quries";
import { useToast } from "../../../hooks/custom/CustomToast";
import { useUserInfoQuery } from "../../../hooks/user/queries";
import { IUserSummary, UserRole } from "../../../types/models/userTypes/userInfoTypes";
import { ActiveLocation } from "../../../types/services/locationTypes";

interface LocationActiveProps {}

export interface UserModalInfoProps {
  status: "";
  role: UserRole;
  id: string;
}

export interface UserActiveInfoProps {
  attendCnt: number;
  gatherCnt: number;
  groupCnt: number;
  selfStudyCnt: number;
  userInfo: IUserSummary;
}

function LocationActive({}: LocationActiveProps) {
  const toast = useToast();
  const { data: userInfo } = useUserInfoQuery();

  const [selectedLocation, setSelectedLocation] = useState<ActiveLocation>();
  const [userModalInfo, setUserModalInfo] = useState<UserModalInfoProps>();

  useEffect(() => {
    if (userInfo) {
      setSelectedLocation(userInfo?.location);
    }
  }, [userInfo]);

  const { data } = useAdminLocationActiveQuery(2);
  console.log(data);

  const { mutate: updateProfile } = useUpdateProfileMutation({
    onSuccess() {
      // toast({
      //   title: "변경 완료",
      //   // description: "개인 정보 보호를 위해 게스트에게는 허용되지 않습니다.",
      //   status: "success",
      //   duration: 1000,
      //   isClosable: true,
      //   position: "bottom",
      // });
    },
  });

  const handleChangeLocation = (location: ActiveLocation) => {
    if (location !== userInfo?.location) {
      toast("error", "권한이 없습니다.");
      return;
    } else setSelectedLocation(location);
  };

  const buttonOptionArr: ButtonOptionsProps[] =
    selectedLocation &&
    LOCATION_OPEN.sort((a, b) =>
      a === selectedLocation ? -1 : b === selectedLocation ? 1 : 0,
    ).map((location) => ({
      text: location,
      func: () => handleChangeLocation(location),
    }));

  console.log(42, selectedLocation, buttonOptionArr);

  return (
    <>
      <Header title="지역 활동 정보" />
      <Box p={4}>
        {selectedLocation && buttonOptionArr && (
          <ButtonGroups currentValue={selectedLocation} buttonOptionsArr={buttonOptionArr} />
        )}
      </Box>
      <Flex direction="column" px={2}>
        <ProfileDetailBlock handleInfoButton={(info) => setUserModalInfo(info)} />
        <ProfileDetailBlock handleInfoButton={(info) => setUserModalInfo(info)} />
        <ProfileDetailBlock handleInfoButton={(info) => setUserModalInfo(info)} />
      </Flex>
    </>
  );
}

export default LocationActive;
