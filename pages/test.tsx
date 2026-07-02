import { Button } from "@chakra-ui/react";

export default function ExamplePage() {
  const getSchedule = async () => {
    //   const res = await axios.get(`${SERVER_URI}/admin/user/test/schedule/62a44519f4a6968c58fedb88`);
    //   console.log(res.data);
  };

  const recoverGroupstudyTicketPoints = async () => {
    console.log(23);
    // const res = await axios.post(`${SERVER_URI}/admin/user/run/monthly-ticket-attend`);
    // console.log(51, res.data);
  };

  return (
    <>
      <Button>모달 열기</Button>
      <Button onClick={getSchedule}>스케줄 조회</Button>
      <Button onClick={recoverGroupstudyTicketPoints}>모임 티켓 포인트 복구</Button>
    </>
  );
}
