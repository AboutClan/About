function LocationRegisterPopUp() {
  // const toast = useToast();
  // const [placeInfo, setPlaceInfo] = useState<NaverLocationProps>({
  //   title: "",
  //   address: "",
  // });

  // const queryClient = useQueryClient();
  // const { mutate } = useUserInfoFieldMutation("locationDetail", {
  //   onSuccess() {
  //     toast("success", "등록되었습니다");
  //     queryClient.invalidateQueries([USER_INFO]);
  //     setIsModal(false);
  //   },
  //   onError() {
  //     setIsModal(false);
  //   },
  // });

  // const footerOptions: IFooterOptions = {
  //   main: {
  //     text: "활동 장소 입력",
  //     func: () => {
  //       const { title: placeName, y, x } = placeInfo;
  //       if (!placeName || !y || !x) {
  //         toast("error", "누락된 항목이 있습니다.");
  //         return;
  //       }

  //       mutate({
  //         text: placeName,
  //         lat: +y,
  //         lon: +x,
  //       });
  //     },
  //   },
  // };

  // return (
  //   <ModalLayout title="활동 장소 등록" footerOptions={footerOptions} setIsModal={setIsModal}>
  //     <Box mb={3} fontSize="15px" textAlign="start">
  //       주로 활동하는 대략적인 장소를 입력해 주세요! 이후에도 변경이 가능합니다.
  //     </Box>
  //     <Box h="228px">
  //       <SearchLocation placeInfo={placeInfo} setPlaceInfo={setPlaceInfo} isSmall={true} />
  //     </Box>
  //   </ModalLayout>
  // );
  return null;
}

export default LocationRegisterPopUp;
