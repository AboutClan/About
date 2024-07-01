import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

import Selector from "../../../components/atoms/Selector";
import SectionBar from "../../../components/molecules/bars/SectionBar";
import { ACTIVE_LOCATIONS } from "../../../constants/locationConstants";
import { ActiveLocation } from "../../../types/services/locationTypes";
import { convertLocationLangTo } from "../../../utils/convertUtils/convertDatas";

export default function HomeLocationBar() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const newSearchParams = new URLSearchParams(searchParams);

  const locationKr = convertLocationLangTo(searchParams.get("location") as ActiveLocation, "kr");
  const [location, setLocation] = useState<ActiveLocation>(locationKr);

  useEffect(() => {
    setLocation(locationKr);
  }, [locationKr]);

  useEffect(() => {
    if (locationKr !== location) {
      newSearchParams.set("location", convertLocationLangTo(location, "en"));
      router.replace(`/home?${newSearchParams.toString()}`);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location]);

  return (
    <SectionBar
      title="카공 스터디"
      rightComponent={
        <Selector defaultValue={location} options={ACTIVE_LOCATIONS} setValue={setLocation} />
      }
    />
  );
}
