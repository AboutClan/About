import { useAdminLocationActiveQuery } from "../../../hooks/admin/quries";

interface LocationActiveProps {}

function LocationActive({}: LocationActiveProps) {
  const { data } = useAdminLocationActiveQuery(2);
  console.log(data);
  return <>2</>;
}

export default LocationActive;
