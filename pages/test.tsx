import { Button, Flex, Input } from "@chakra-ui/react";
import axios from "axios";
import { useState } from "react";

import { SERVER_URI } from "../constants/system";
import {
  useCouponBulkRegisterMutation,
  useCouponIssueByPartnerMutation,
  useCouponRegisterMutation,
} from "../hooks/coupon/mutations";
import {
  useCouponByNameQuery,
  useCouponListQuery,
  useCouponMineQuery,
  useCouponQuery,
} from "../hooks/coupon/queries";

// 솜씨당 발급 쿠폰 코드 (일괄 등록 대상)
const SOMSSIDANG_COUPON_CODES = [
  "ZOO3-21UU-K5PJ-9Z9Q",
  "YIFY-1AU2-3F4F-55C4",
  "JW9E-F6J3-0SYD-M6W7",
  "GWNG-YLW4-3G6S-G497",
  "CUOJ-CTR3-2IT4-5X7U",
  "8753-KLQ1-V75X-P7S5",
  "9X6V-XD47-ORL2-SQ7L",
  "Y9Z9-9MG8-8312-1041",
  "2772-C645-QJBQ-67YH",
  "D4NE-TZG3-3JR1-14K4",
  "F208-EKL7-OFZ2-554Q",
  "9B07-6F24-B6P0-1X27",
  "219U-VN0N-4CY1-907Y",
  "6M23-DWJ2-6616-XZO5",
  "7G54-F350-7O5D-P2N0",
  "8NDQ-NU7H-3GK9-2070",
  "DNV8-K3S6-PS43-J8JU",
  "6W74-X6XF-KEFL-OE1N",
  "06SO-2341-6962-82D2",
  "ST2H-N0PS-RB82-1QWE",
  "MOWK-0VRO-39AD-301A",
  "65U6-O674-317M-786K",
  "354F-5F57-ADXC-128Z",
  "5G04-85N0-C424-Z7YF",
  "3D71-658Q-L00L-WIAJ",
  "96X1-U3LC-MYE2-556R",
  "59I4-TE8N-A17K-IX3A",
  "QU2J-8823-95Q8-5IU6",
  "7U8D-1I86-5Q1P-ZZ5X",
  "EF9P-Y82T-AO69-FQ8U",
  "7603-2587-30TF-Z0Y9",
  "ZW79-W131-3LE9-TXOM",
  "89UH-4283-O25U-J3BG",
  "0KO1-QO7K-MKZI-EUT6",
  "0NK6-C77T-0XSK-1QQ6",
  "3SP3-PP91-4H56-2F12",
  "19TR-CO3S-0Q93-P71V",
  "KE4H-RU9Y-JL0V-0WHN",
  "Z694-MBQ6-E039-I83Y",
  "6J7Q-8X3D-9Q22-CV59",
  "XO2U-05AU-AFZ7-YBX2",
  "PW4B-UL66-0IU5-7PS8",
  "3PMW-6C5M-SB97-7F0P",
  "XQLX-4SMB-OKM0-Y21E",
  "N47H-LEQ9-K9CW-RY3N",
  "E5PE-OAJS-1QW8-E6P5",
  "XTGH-F1DX-5N96-6ST3",
  "0MC9-QGP0-E4Z1-FZ82",
  "7WRX-X766-P3E9-3CK1",
  "J6WW-H867-0WS3-510Z",
  "0FY0-198K-HL09-GAP7",
  "I1JD-F027-C654-G7FQ",
  "0D46-0L5B-J7KA-ZC1Z",
  "0QE3-S0SD-0UG0-KD92",
  "YAD6-9YHY-4AJT-TA5M",
  "OSP4-225N-RH10-V2AT",
  "O8TX-P8O5-N08E-44H8",
  "EEQS-X543-RIZC-IY7F",
  "53CL-FKNW-31D9-4L6F",
  "9100-01F9-1GF8-U9W2",
  "K7V2-1FKH-NYZ0-935Q",
  "2357-J0L5-5TDD-259C",
  "U1KH-42XN-ZZ7E-9CA6",
  "5DBP-G78A-60PT-68B4",
  "5B3M-590A-OI1P-1VO3",
  "5726-JTX0-X3K6-99WC",
  "L4E9-O9R4-H5KT-50A9",
  "N60E-IBSH-R764-V642",
  "0093-ITJ2-E017-5B3I",
  "3CK8-GSH6-KWR7-Y9TH",
  "W2V4-QU8Y-2497-2A6B",
  "7P49-6JA3-8MBQ-5485",
  "DVA2-1700-GD35-Q3L5",
  "4ZI3-AOVU-57XB-Q2R2",
  "YA1N-3ZG8-551P-D97S",
  "Q63M-5M59-DZ11-RVCO",
  "TTM1-CQ0W-Q16Z-922E",
  "F5YD-IM05-TJDA-9FZ3",
  "Y6W5-806Z-R5Z7-A0B6",
  "G222-3P2M-B38X-272C",
  "E963-H0ML-J5KG-JEI8",
  "17Y7-C1VY-1939-8Y05",
  "HQ3R-92Y2-VRA0-24X4",
  "61F2-81CV-19I7-7CPI",
  "T950-ZMN1-FOUJ-V60S",
  "NM5F-V97B-3EN4-Z9I2",
  "4ZLG-9G53-2IN2-765B",
  "883X-H2CP-8GCM-6LBD",
  "76E0-V430-5BSX-KMT1",
  "ID23-R84P-616G-557V",
  "SW13-KP38-1ZJ2-C14C",
  "X5TK-N96P-8M45-0W56",
  "74P2-0Q6P-L4V0-JP2Y",
  "D1EW-E38A-4DWP-NQ4O",
  "2KT7-F032-FP5N-38E3",
  "05E6-78Y4-882D-3XQ8",
  "BS12-75D4-4A34-33M6",
  "DFJK-LT43-E578-W8NK",
  "L29J-K817-B104-BYE5",
  "O6YG-6O36-S4J3-6X74",
];
const COUPON_CODES = [
  "5169-10001-D81F4873",
  "5169-10002-D251B5DF",
  "5169-10003-3BA7BBDB",
  "5169-10004-953102E0",
  "5169-10005-B5969160",
  "5169-10006-A41E7141",
  "5169-10007-44B90E62",
  "5169-10008-94D02416",
  "5169-10009-5E4D5454",
  "5169-10010-F2B7AE86",
  "5169-10011-06EBB28A",
  "5169-10012-A0D652ED",
  "5169-10013-D587DF56",
  "5169-10014-47FE4451",
  "5169-10015-F59D149A",
  "5169-10016-19CD1BBD",
  "5169-10017-4753763E",
  "5169-10018-F96CFC50",
  "5169-10019-437E23B1",
  "5169-10020-C32C3C63",
  "5169-10021-7C033E52",
  "5169-10022-570DA3D8",
  "5169-10023-EC80F922",
  "5169-10024-A8DF1D6F",
  "5169-10025-9A5BA0A4",
  "5169-10026-CBD4D55F",
  "5169-10027-710E20AF",
  "5169-10028-1B15C830",
  "5169-10029-FB57EF2C",
  "5169-10030-59D5A013",
  "5169-10031-4BF9D5DC",
  "5169-10032-C3A2905C",
  "5169-10033-9A5305B7",
  "5169-10034-A3E889FF",
  "5169-10035-D9046B4F",
  "5169-10036-18AB7D3A",
  "5169-10037-765A6B0F",
  "5169-10038-FEADE366",
  "5169-10039-829E1F54",
  "5169-10040-DBF5424F",
  "5169-10041-C0D7B1EA",
  "5169-10042-2DC8CB0E",
  "5169-10043-9A81B364",
  "5169-10044-7F8F66ED",
  "5169-10045-71D915F5",
  "5169-10046-C737F1AA",
  "5169-10047-D1FA939C",
  "5169-10048-C4CE93BA",
  "5169-10049-BEAD573C",
  "5169-10050-B45DBB57",
  "5169-10051-D2F6B4CA",
  "5169-10052-343E7550",
  "5169-10053-6DAD321E",
  "5169-10054-FA36AC7E",
  "5169-10055-B3AE72A2",
  "5169-10056-701E7EEE",
  "5169-10057-881BD94E",
  "5169-10058-57098F85",
  "5169-10059-83077BE7",
  "5169-10060-A4682BBB",
  "5169-10061-50DC4CC8",
  "5169-10062-69D12DF5",
  "5169-10063-0BCB2B93",
  "5169-10064-385B30C1",
  "5169-10065-53C6ACB9",
  "5169-10066-0FEE8EF8",
  "5169-10067-C31FF9ED",
  "5169-10068-1D66228B",
  "5169-10069-1E7F7367",
  "5169-10070-94BEDDB0",
  "5169-10071-A0FB31B1",
  "5169-10072-80ED6CA4",
  "5169-10073-3D71CD04",
  "5169-10074-C25645C1",
  "5169-10075-4230F1A4",
  "5169-10076-7A4BC451",
  "5169-10077-AFE8EB87",
  "5169-10078-B36C8A43",
  "5169-10079-0258C5D6",
  "5169-10080-9EA883A9",
  "5169-10081-3742FF30",
  "5169-10082-A8EE69C8",
  "5169-10083-306532B1",
  "5169-10084-AD3A066B",
  "5169-10085-50F7A3D8",
  "5169-10086-1EB10F70",
  "5169-10087-02ECC352",
  "5169-10088-E484BE4D",
  "5169-10089-01616CE5",
  "5169-10090-0725F4D5",
  "5169-10091-A6D99CEA",
  "5169-10092-EA5E38C9",
  "5169-10093-834B0F86",
  "5169-10094-F97A7C04",
  "5169-10095-D5391E64",
  "5169-10096-99C2EEFD",
  "5169-10097-B8925ABC",
  "5169-10098-4EEC7C58",
  "5169-10099-AE144F12",
  "5169-10100-51676E99",
  "5169-10101-2B9A19E4",
  "5169-10102-89E6A2D3",
  "5169-10103-09366942",
  "5169-10104-1260AD0D",
  "5169-10105-C0567DEC",
  "5169-10106-B8386B8A",
  "5169-10107-D969EBC9",
  "5169-10108-94F16498",
  "5169-10109-B8AF7419",
  "5169-10110-7F2C0EA5",
  "5169-10111-C51E305D",
  "5169-10112-9AC7A00E",
  "5169-10113-0C3F39A5",
  "5169-10114-F1FC3F15",
  "5169-10115-51C8E079",
  "5169-10116-54604908",
  "5169-10117-B5602F66",
  "5169-10118-E0075B93",
  "5169-10119-FECC1A48",
  "5169-10120-CA0BA12D",
  "5169-10121-3EC614E4",
  "5169-10122-504DF561",
  "5169-10123-A5D23C7B",
  "5169-10124-7A95D3AD",
  "5169-10125-2696DB17",
  "5169-10126-81ED1E73",
  "5169-10127-8D6374E9",
  "5169-10128-9D939844",
  "5169-10129-22DB33EA",
  "5169-10130-F54B74B5",
  "5169-10131-5A0C68D5",
  "5169-10132-F743EAE5",
  "5169-10133-6DFB70C9",
  "5169-10134-7EE17A6F",
  "5169-10135-5AFD5036",
  "5169-10136-0DCAB5E1",
  "5169-10137-0C843795",
  "5169-10138-868D24A5",
  "5169-10139-DE376B2B",
  "5169-10140-730961C5",
  "5169-10141-AC17F49D",
  "5169-10142-B0F0BCA8",
  "5169-10143-029A590A",
  "5169-10144-9465D53F",
  "5169-10145-853CD628",
  "5169-10146-54A9C9FA",
  "5169-10147-378DBE3B",
  "5169-10148-BB14C4FB",
  "5169-10149-3B8F2CA1",
  "5169-10150-6202C95F",
  "5169-10151-28E0B63F",
  "5169-10152-4BD48A81",
  "5169-10153-AA6E3E22",
  "5169-10154-0DE7D017",
  "5169-10155-E54C5B7E",
  "5169-10156-D38C913A",
  "5169-10157-7D67E94D",
  "5169-10158-FF459977",
  "5169-10159-9D156C5E",
  "5169-10160-69C81EDE",
  "5169-10161-5FAC79BB",
  "5169-10162-91245F71",
  "5169-10163-2E5C2187",
  "5169-10164-29C38782",
  "5169-10165-78C00892",
  "5169-10166-57AE4197",
  "5169-10167-52E9FD7D",
  "5169-10168-0ED77A31",
  "5169-10169-69463F2E",
  "5169-10170-DC78DD71",
  "5169-10171-6E137A10",
  "5169-10172-B361F0F6",
  "5169-10173-0CB371AC",
  "5169-10174-96855F24",
  "5169-10175-E6D280BA",
  "5169-10176-4A7ED9A4",
  "5169-10177-BE0608D7",
  "5169-10178-7FE72EBD",
  "5169-10179-F8164890",
  "5169-10180-ADB7A021",
  "5169-10181-094CF195",
  "5169-10182-5B8EFC8F",
  "5169-10183-B8692183",
  "5169-10184-D9E92B24",
  "5169-10185-55835933",
  "5169-10186-559C392B",
  "5169-10187-29F60AC1",
  "5169-10188-2A46A111",
  "5169-10189-F29895DA",
  "5169-10190-DA6C7BCE",
  "5169-10191-A4C67E10",
  "5169-10192-368A87FD",
  "5169-10193-7DBC2B07",
  "5169-10194-E53D6E2A",
  "5169-10195-7D887650",
  "5169-10196-42C0C1C8",
  "5169-10197-12481BD8",
  "5169-10198-7CA5A1FC",
  "5169-10199-F39E6E8D",
  "5169-10200-747A0F0F",
  "5169-10201-30C30F25",
  "5169-10202-24846F91",
  "5169-10203-D6DC31F8",
  "5169-10204-89DAA6C6",
  "5169-10205-6BF6493B",
  "5169-10206-429EFD57",
  "5169-10207-2A74CE9E",
  "5169-10208-83254AC5",
  "5169-10209-249BB2A1",
  "5169-10210-5225E1AB",
  "5169-10211-4EDD40E8",
  "5169-10212-394564F1",
  "5169-10213-FB8D7670",
  "5169-10214-F0BF1C9D",
  "5169-10215-431C9BA3",
  "5169-10216-072DA001",
  "5169-10217-9AE699CE",
  "5169-10218-387DFE8C",
  "5169-10219-DE020DC3",
  "5169-10220-08A676E1",
  "5169-10221-5E565C17",
  "5169-10222-67C9CB11",
  "5169-10223-C112F3F7",
  "5169-10224-D7901E66",
  "5169-10225-7F64B063",
  "5169-10226-87FD47EC",
  "5169-10227-05AE0185",
  "5169-10228-F04A1513",
  "5169-10229-4444E7FC",
  "5169-10230-CC7BF338",
  "5169-10231-96E5E993",
  "5169-10232-64063A27",
  "5169-10233-A3F8D701",
  "5169-10234-7D93B21F",
  "5169-10235-E331D902",
  "5169-10236-082B6EC3",
  "5169-10237-24BD2569",
  "5169-10238-1F39793C",
  "5169-10239-6CB9D915",
  "5169-10240-CA0DD60B",
  "5169-10241-4BD3D9A6",
  "5169-10242-19D96EAE",
  "5169-10243-967403AB",
  "5169-10244-6F26C598",
  "5169-10245-48AFFC9F",
  "5169-10246-B85CA277",
  "5169-10247-612F332F",
  "5169-10248-6D8CF37C",
  "5169-10249-66A768A2",
  "5169-10250-D7F7603D",
  "5169-10251-863176D8",
  "5169-10252-3083CA8D",
  "5169-10253-F194B5D1",
  "5169-10254-C6A61F70",
  "5169-10255-E457DF5F",
  "5169-10256-D853DA3B",
  "5169-10257-7AE40038",
  "5169-10258-A67D42C1",
  "5169-10259-1869A16C",
  "5169-10260-1819DE84",
  "5169-10261-5F0EBE79",
  "5169-10262-78775757",
  "5169-10263-24B01CEE",
  "5169-10264-EE4CE045",
  "5169-10265-0290863D",
  "5169-10266-1A5C3498",
  "5169-10267-B255CDA2",
  "5169-10268-D18B7BEF",
  "5169-10269-5EE77025",
  "5169-10270-33AB80CB",
  "5169-10271-8D9A0AF1",
  "5169-10272-6CC638B5",
  "5169-10273-1A2A54CD",
  "5169-10274-5B8B351C",
  "5169-10275-C6A8CE2C",
  "5169-10276-D9B8FDC3",
  "5169-10277-31E62A26",
  "5169-10278-B3DD1CCB",
  "5169-10279-51744D41",
  "5169-10280-2582ED3C",
  "5169-10281-D5692DE1",
  "5169-10282-99114664",
  "5169-10283-635D7BA5",
  "5169-10284-BC5DF6DF",
  "5169-10285-D6244887",
  "5169-10286-AF264C81",
  "5169-10287-A2F1CEBB",
  "5169-10288-AD9B283F",
  "5169-10289-F1BBF3C0",
  "5169-10290-340CBCC7",
  "5169-10291-34488C78",
  "5169-10292-0ABE731C",
  "5169-10293-855B5F99",
  "5169-10294-FA3C6270",
  "5169-10295-70370122",
  "5169-10296-2995EE8D",
  "5169-10297-6ED8565A",
  "5169-10298-91FCDC70",
  "5169-10299-8573970F",
  "5169-10300-DF877B0E",
];
export default function ExamplePage() {
  const [partnerId, setPartnerId] = useState("");
  const [couponCode, setCouponCode] = useState("");
  const [couponName, setCouponName] = useState("");
  const [quantity, setQuantity] = useState("10");
  const [couponId, setCouponId] = useState("");

  const getSchedule = async () => {
    console.log(3);
    const res = await axios.post(`${SERVER_URI}/admin/user/reconcile/points`);
    console.log(52, res.data);
  };

  const recoverGroupstudyTicketPoints = async () => {
    console.log(23);
    // const res = await axios.post(`${SERVER_URI}/admin/user/run/monthly-ticket-attend`);
    // console.log(51, res.data);
  };

  const { mutate: registerCoupon } = useCouponRegisterMutation({
    onSuccess: (data) => {
      console.log("coupon registered", data);
      setCouponId(data.couponId);
    },
  });

  const { mutate: issueCouponByPartner, data: issuedByPartner } = useCouponIssueByPartnerMutation({
    onSuccess: (data) => console.log("coupon issued by partner", data),
  });

  const { mutate: registerCouponBulk, data: bulkResult } = useCouponBulkRegisterMutation({
    onSuccess: (data) => console.log("coupons bulk registered", data),
  });

  const registerSomssidangCoupons = () =>
    registerCouponBulk({
      partnerId: "turucar",
      codes: COUPON_CODES,
    });

  const { data: couponList, refetch: refetchCouponList } = useCouponListQuery({
    enabled: false,
  });
  const { data: coupon, refetch: refetchCoupon } = useCouponQuery(couponId, { enabled: false });
  const { data: couponByName, refetch: refetchCouponByName } = useCouponByNameQuery(couponName, {
    enabled: false,
  });
  const { data: myCoupon, refetch: refetchMyCoupon } = useCouponMineQuery(couponId, {
    enabled: false,
  });

  return (
    <>
      <Button>모달 열기</Button>
      <Button onClick={getSchedule}>스케줄 조회</Button>
      <Button onClick={recoverGroupstudyTicketPoints}>모임 티켓 포인트 복구</Button>

      <Flex direction="column" gap={2} mt={6} p={4} border="1px solid #eee">
        <Flex gap={2}>
          <Input
            placeholder="partnerId"
            value={partnerId}
            onChange={(e) => setPartnerId(e.target.value)}
          />
          <Input
            placeholder="code"
            value={couponCode}
            onChange={(e) => setCouponCode(e.target.value)}
          />
          <Input
            placeholder="name (optional)"
            value={couponName}
            onChange={(e) => setCouponName(e.target.value)}
          />
          <Input
            placeholder="quantity"
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
          />
          <Button
            onClick={() =>
              registerCoupon({
                partnerId,
                code: couponCode,
                quantity: Number(quantity),
                name: couponName || undefined,
              })
            }
          >
            쿠폰 등록
          </Button>
        </Flex>

        <Flex gap={2}>
          <Button onClick={registerSomssidangCoupons}>솜씨당 쿠폰 54개 일괄 등록</Button>
        </Flex>

        <Flex gap={2}>
          <Input
            placeholder="couponId"
            value={couponId}
            onChange={(e) => setCouponId(e.target.value)}
          />
          <Button onClick={() => issueCouponByPartner({ partnerId: "somssidang" })}>
            쿠폰 발급받기
          </Button>
          <Button onClick={() => refetchCoupon()}>쿠폰 단건 조회</Button>
          <Button onClick={() => refetchMyCoupon()}>내 발급 조회</Button>
        </Flex>

        <Flex gap={2}>
          <Button onClick={() => refetchCouponList()}>전체 쿠폰 조회</Button>
          <Button onClick={() => refetchCouponByName()}>name으로 조회</Button>
        </Flex>

        <pre>
          {JSON.stringify(
            { couponList, coupon, couponByName, myCoupon, bulkResult, issuedByPartner },
            null,
            2,
          )}
        </pre>
      </Flex>
    </>
  );
}
