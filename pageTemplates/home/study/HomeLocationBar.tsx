import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

import LocationSelector from "../../../components/atoms/LocationSelector";
import SectionBar from "../../../components/molecules/bars/SectionBar";
import { LOCATION_ALL } from "../../../constants/location";
import { ActiveLocation, Location } from "../../../types/services/locationTypes";
import { convertLocationLangTo } from "../../../utils/convertUtils/convertDatas";

export default function HomeLocationBar() {
  const router = useRouter();

  const searchParams = useSearchParams();
  const newSearchParams = new URLSearchParams(searchParams);

  const locationKr = convertLocationLangTo(searchParams.get("location") as ActiveLocation, "kr");
  const [location, setLocation] = useState<Location>(locationKr);

  useEffect(() => {
    setLocation(locationKr);
  }, [locationKr]);

  useEffect(() => {
    if (locationKr !== location) {
      newSearchParams.set("location", convertLocationLangTo(location, "en"));
      router.replace(`/home?${newSearchParams.toString()}`, { scroll: false });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location]);

  return (
    <SectionBar
      title="카공 스터디"
      rightComponent={
        <LocationSelector defaultValue={location} options={LOCATION_ALL} setValue={setLocation} />
      }
    />
  );
}
