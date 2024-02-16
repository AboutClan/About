import { useRouter } from "next/router";
import { useSetRecoilState } from "recoil";
import styled from "styled-components";
import { IFooterOptions, ModalLayout } from "../../components/modals/Modals";
import { prevPageUrlState } from "../../recoils/urlRecoils";
import { ModalSubtitle } from "../../styles/layout/modal";
import { IModal } from "../../types/reactTypes";

function FAQPopUp({ setIsModal }: IModal) {
  const router = useRouter();

  const setPrevPageUrl = useSetRecoilState(prevPageUrlState);

  const onSubmit = () => {
    setPrevPageUrl("/home");
    router.push(`/faq`);
  };

  const footerOptions: IFooterOptions = {
    main: {
      text: "보러가기",
      func: onSubmit,
    },
    sub: {},
    isFull: true,
  };

  return (
    <ModalLayout
      title="뉴비 가이드"
      footerOptions={footerOptions}
      setIsModal={setIsModal}
    >
      <ModalSubtitle>
        아직도 이걸 모른다고?! 아직도 이걸 모르는 당신은 뉴비! 궁금한 거 있으면
        보고 가~
      </ModalSubtitle>
      <Wrapper>
        <Center>
          <LeftWrapper>
            <LeftThunder />
          </LeftWrapper>
          <GuideBook />
          <RightWrapper>
            <RightThunder />
          </RightWrapper>
        </Center>
      </Wrapper>
    </ModalLayout>
  );
}

const Wrapper = styled.div`
  padding: var(--gap-3);
  background-color: rgba(255, 204, 34, 0.1);
  flex: 1;
  display: flex;
  align-items: center;

  justify-content: center;
`;

const Center = styled.div`
  position: relative;
  display: flex;
  width: 110px;
  height: 100%;
  justify-content: center;
  align-items: center;
`;

const LeftWrapper = styled.div`
  left: 0;
  position: absolute;
`;

const RightWrapper = styled.div`
  position: absolute;
  right: 0;
  top: 0;
`;

export const GuideBook = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="46"
    height="58"
    viewBox="0 0 46 58"
    fill="none"
  >
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M42 1.2771C40.4807 1.2771 5.04736 1.2771 5.04736 1.2771L1.1333 4.12402L0.799561 8.18408L1.1333 52.3315L3.02271 56.3745L5.49878 56.9426H44L45.1729 55.0227L44.7041 12L43.2063 11.2048V2C43.2063 2 43.5193 1.2771 42 1.2771Z"
      fill="white"
    />
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M26.9309 6V19.2183L31.8 16.3347L36.5896 19.2183V6.38452L26.9309 6Z"
      fill="#FFCC22"
    />
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M36.5896 6.38452V11.2217H43.4155L43.0349 2.78076L41.5427 0.893799L5.04736 1.2771L1.1333 4.12402V7.49585L2.75244 10L6.40698 11.2217H26.9309V6.05774L36.5896 6.38452Z"
      fill="#F2F2F2"
    />
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M1.1333 9.24756L0.799561 52L2.79736 56L6 56.9426H11.1724V11.2217H6.40698L3.64697 10.4L1.1333 9.24756Z"
      fill="#D8D8D8"
    />
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M44 10.1V2.6C44 1.2 42.8 0 41.4 0H6C4.4 0 2.9 0.6 1.7 1.8C0.7 2.8 0.1 4.3 0 5.8V6V52C0 55.3 2.7 58 6 58H43.4C44.8 58 46 56.8 46 55.4V12.6C46 11.4 45.1 10.3 44 10.1ZM6 2H41.4C41.7 2 42 2.3 42 2.6V10H37.7V7H39C39.6 7 40 6.6 40 6C40 5.4 39.6 5 39 5H23C22.4 5 22 5.4 22 6C22 6.6 22.4 7 23 7H25.8V10H6.2C5 10 3.9 9.5 3.1 8.7C2.6 8.2 2.3 7.6 2.1 7H16.4C17 7 17.4 6.6 17.4 6C17.4 5.4 17 5 16.4 5H2.1C2.3 4.3 2.6 3.7 3.1 3.2C3.9 2.4 4.9 2 6 2ZM35.8 7H27.8V17.6L31.3 15.5C31.6 15.3 32 15.3 32.3 15.5L35.8 17.6V7ZM2 52V10.4C3.2 11.4 4.7 12 6.2 12H10V56H6C3.8 56 2 54.2 2 52ZM43.4 56C43.7 56 44 55.7 44 55.4V12.6C44 12.3 43.7 12 43.4 12H43H37.8V19.3C37.8 19.7 37.6 20 37.3 20.2C37.1 20.3 37 20.3 36.8 20.3C36.6 20.3 36.5 20.3 36.3 20.2L31.8 17.5L27.3 20.2C27 20.4 26.6 20.4 26.3 20.2C26 20 25.8 19.7 25.8 19.3V12H12V56H43.4Z"
      fill="#343943"
    />
    <path
      d="M39 50H31.1C30.5 50 30.1 50.4 30.1 51C30.1 51.6 30.5 52 31.1 52H39C39.6 52 40 51.6 40 51C40 50.4 39.6 50 39 50Z"
      fill="#343943"
    />
  </svg>
);

export const LeftThunder = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="12"
    height="16"
    viewBox="0 0 12 16"
    fill="none"
  >
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M6.7435 1.34491H1.46291L4.75009 5.99997H1.46291L10.3754 15.0065L7.81266 8.29525H9.45156L6.7435 1.34491Z"
      fill="#FFCC22"
    />
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M1.28129 5.58355C1.13202 5.58324 0.99725 5.67284 0.939782 5.8106C0.882437 5.94845 0.913764 6.10727 1.01916 6.21302L10.2822 15.4835C10.4075 15.6077 10.6031 15.626 10.7492 15.5271C10.8953 15.4282 10.951 15.2398 10.8822 15.0774L8.20553 8.80108H9.69707C9.82035 8.80072 9.93531 8.73885 10.0035 8.63616C10.0717 8.53348 10.0842 8.40352 10.0367 8.28974L7.07948 1.22705C7.02227 1.08991 6.88842 1.00043 6.73983 1H1.37174C1.23156 1.00017 1.10358 1.07971 1.04136 1.20532C0.979139 1.33093 0.993423 1.48095 1.07823 1.59256L4.12408 5.58355H1.28129ZM7.30654 8.57033L9.45156 13.6006L2.17289 6.32009H4.87909C5.01926 6.31992 5.14725 6.24038 5.20947 6.11477C5.27169 5.98916 5.2574 5.83915 5.1726 5.72753L2.11751 1.73654H6.49431L9.14143 8.0553H7.6462C7.52193 8.05514 7.40592 8.1175 7.33751 8.22124C7.26909 8.32497 7.25745 8.45617 7.30654 8.57033Z"
      fill="#343943"
    />
    <path
      d="M0.939782 5.8106L0.801288 5.75299L0.801344 5.75285L0.939782 5.8106ZM1.28129 5.58355L1.28129 5.73355L1.28097 5.73355L1.28129 5.58355ZM1.01916 6.21302L0.913051 6.31905L0.912915 6.31891L1.01916 6.21302ZM10.2822 15.4835L10.1766 15.59L10.1761 15.5895L10.2822 15.4835ZM10.7492 15.5271L10.8333 15.6513L10.8333 15.6513L10.7492 15.5271ZM10.8822 15.0774L11.0202 15.0185L11.0203 15.0189L10.8822 15.0774ZM8.20553 8.80108L8.06755 8.85992L7.97848 8.65108H8.20553V8.80108ZM9.69707 8.80108L9.69751 8.95108H9.69707V8.80108ZM10.0367 8.28974L10.1751 8.23181L10.1752 8.23199L10.0367 8.28974ZM7.07948 1.22705L6.94112 1.28499L6.94105 1.2848L7.07948 1.22705ZM6.73983 1L6.73983 0.849999L6.74026 0.850001L6.73983 1ZM1.37174 1L1.37156 0.85H1.37174V1ZM1.07823 1.59256L0.958988 1.68356L0.958796 1.68331L1.07823 1.59256ZM4.12408 5.58355L4.24332 5.49254L4.42725 5.73355H4.12408V5.58355ZM9.45156 13.6006L9.58954 13.5418L9.34548 13.7067L9.45156 13.6006ZM7.30654 8.57033L7.44434 8.51108L7.44452 8.51149L7.30654 8.57033ZM2.17289 6.32009L2.06681 6.42614L1.81082 6.17009H2.17289V6.32009ZM4.87909 6.32009L4.87927 6.47009H4.87909V6.32009ZM5.20947 6.11477L5.07505 6.04819L5.07505 6.04819L5.20947 6.11477ZM5.1726 5.72753L5.2917 5.63636L5.29203 5.63678L5.1726 5.72753ZM2.11751 1.73654L1.9984 1.82772L1.81378 1.58654H2.11751V1.73654ZM6.49431 1.73654V1.58654H6.5941L6.63266 1.67858L6.49431 1.73654ZM9.14143 8.0553L9.27978 7.99734L9.3669 8.2053H9.14143V8.0553ZM7.6462 8.0553L7.6462 8.2053L7.646 8.2053L7.6462 8.0553ZM7.33751 8.22124L7.46273 8.30382L7.46273 8.30382L7.33751 8.22124ZM0.801344 5.75285C0.882161 5.55912 1.07169 5.43311 1.2816 5.43355L1.28097 5.73355C1.19235 5.73336 1.11234 5.78656 1.07822 5.86835L0.801344 5.75285ZM0.912915 6.31891C0.764699 6.1702 0.720643 5.94685 0.801288 5.75299L1.07828 5.86822C1.04423 5.95006 1.06283 6.04435 1.1254 6.10714L0.912915 6.31891ZM10.1761 15.5895L0.913051 6.31905L1.12527 6.107L10.3884 15.3775L10.1761 15.5895ZM10.8333 15.6513C10.6278 15.7904 10.3527 15.7647 10.1766 15.59L10.3879 15.377C10.4622 15.4507 10.5784 15.4616 10.6651 15.4029L10.8333 15.6513ZM11.0203 15.0189C11.117 15.2473 11.0387 15.5123 10.8333 15.6513L10.6651 15.4029C10.7518 15.3442 10.7849 15.2323 10.7441 15.1359L11.0203 15.0189ZM8.3435 8.74223L11.0202 15.0185L10.7442 15.1362L8.06755 8.85992L8.3435 8.74223ZM9.69707 8.95108H8.20553V8.65108H9.69707V8.95108ZM10.1285 8.71916C10.0325 8.86357 9.87087 8.95057 9.69751 8.95108L9.69663 8.65108C9.76983 8.65086 9.83808 8.61413 9.87858 8.55317L10.1285 8.71916ZM10.1752 8.23199C10.2419 8.39199 10.2244 8.57475 10.1285 8.71916L9.87858 8.55317C9.91908 8.4922 9.92647 8.41504 9.89829 8.34749L10.1752 8.23199ZM7.21784 1.16912L10.1751 8.23181L9.89837 8.34768L6.94112 1.28499L7.21784 1.16912ZM6.74026 0.850001C6.94923 0.85061 7.13747 0.976443 7.21792 1.16931L6.94105 1.2848C6.90708 1.20338 6.82761 1.15026 6.73939 1.15L6.74026 0.850001ZM1.37174 0.85H6.73983V1.15H1.37174V0.85ZM0.906944 1.13874C0.994441 0.962099 1.17443 0.850242 1.37156 0.85L1.37192 1.15C1.2887 1.1501 1.21271 1.19733 1.17577 1.2719L0.906944 1.13874ZM0.958796 1.68331C0.839534 1.52635 0.819446 1.31539 0.906944 1.13874L1.17577 1.2719C1.13883 1.34648 1.14731 1.43554 1.19766 1.50181L0.958796 1.68331ZM4.00484 5.67455L0.958989 1.68356L1.19747 1.50155L4.24332 5.49254L4.00484 5.67455ZM1.28129 5.43355H4.12408V5.73355H1.28129V5.43355ZM9.31358 13.6594L7.16856 8.62917L7.44452 8.51149L9.58954 13.5418L9.31358 13.6594ZM2.27897 6.21404L9.55764 13.4946L9.34548 13.7067L2.06681 6.42614L2.27897 6.21404ZM4.87909 6.47009H2.17289V6.17009H4.87909V6.47009ZM5.34388 6.18135C5.25638 6.35799 5.0764 6.46985 4.87927 6.47009L4.8789 6.17009C4.96213 6.16999 5.03811 6.12276 5.07505 6.04819L5.34388 6.18135ZM5.29203 5.63678C5.41129 5.79374 5.43138 6.0047 5.34388 6.18135L5.07505 6.04819C5.11199 5.97361 5.10351 5.88455 5.05316 5.81828L5.29203 5.63678ZM2.23662 1.64537L5.2917 5.63636L5.05349 5.81871L1.9984 1.82772L2.23662 1.64537ZM6.49431 1.88654H2.11751V1.58654H6.49431V1.88654ZM9.00308 8.11326L6.35596 1.7945L6.63266 1.67858L9.27978 7.99734L9.00308 8.11326ZM7.6462 7.9053H9.14143V8.2053H7.6462V7.9053ZM7.21229 8.13866C7.3085 7.99277 7.47164 7.90507 7.6464 7.9053L7.646 8.2053C7.57222 8.20521 7.50334 8.24223 7.46273 8.30382L7.21229 8.13866ZM7.16874 8.62958C7.09971 8.46904 7.11608 8.28454 7.21229 8.13865L7.46273 8.30382C7.42211 8.36541 7.4152 8.4433 7.44434 8.51108L7.16874 8.62958Z"
      fill="#343943"
    />
  </svg>
);

export const RightThunder = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="16"
    height="22"
    viewBox="0 0 16 22"
    fill="none"
  >
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M6.74658 1.48291H14.1394L9.53735 8H14.1394L1.66187 20.6091L5.24976 11.2134H2.95531L6.74658 1.48291Z"
      fill="#FFCC22"
    />
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M14.3937 7.41697C14.6026 7.41653 14.7913 7.54198 14.8718 7.73484C14.9521 7.92783 14.9082 8.15018 14.7606 8.29823L1.79233 21.2769C1.61699 21.4508 1.34312 21.4764 1.13862 21.3379C0.934118 21.1995 0.856108 20.9357 0.952412 20.7083L4.69973 11.9215H2.61157C2.43898 11.921 2.27803 11.8344 2.18254 11.6906C2.08704 11.5469 2.0696 11.3649 2.13605 11.2056L6.2762 1.31788C6.35629 1.12588 6.54368 1.00061 6.75172 1H14.267C14.4633 1.00024 14.6425 1.1116 14.7296 1.28745C14.8167 1.46331 14.7967 1.67332 14.678 1.82958L10.4138 7.41697H14.3937ZM5.95832 11.5985L2.95529 18.6408L13.1454 8.44813H9.35675C9.16051 8.44789 8.98132 8.33653 8.89422 8.16067C8.80711 7.98482 8.82711 7.7748 8.94584 7.61855L13.223 2.03116H7.09544L3.38946 10.8774H5.4828C5.65677 10.8772 5.81918 10.9645 5.91496 11.1097C6.01074 11.255 6.02704 11.4386 5.95832 11.5985Z"
      fill="#343943"
    />
    <path
      d="M14.8718 7.73484L15.0103 7.67723L15.0102 7.67709L14.8718 7.73484ZM14.3937 7.41697L14.3937 7.56697L14.394 7.56697L14.3937 7.41697ZM14.7606 8.29823L14.8668 8.40426L14.8669 8.40412L14.7606 8.29823ZM1.79233 21.2769L1.89796 21.3834L1.89844 21.3829L1.79233 21.2769ZM1.13862 21.3379L1.05454 21.4621L1.05454 21.4621L1.13862 21.3379ZM0.952412 20.7083L0.814436 20.6495L0.814288 20.6498L0.952412 20.7083ZM4.69973 11.9215L4.83771 11.9803L4.92678 11.7715H4.69973V11.9215ZM2.61157 11.9215L2.61113 12.0715H2.61157V11.9215ZM2.13605 11.2056L1.99769 11.1477L1.99761 11.1479L2.13605 11.2056ZM6.2762 1.31788L6.41456 1.37581L6.41463 1.37563L6.2762 1.31788ZM6.75172 1L6.75172 0.849999L6.75128 0.850001L6.75172 1ZM14.267 1L14.2672 0.85H14.267V1ZM14.7296 1.28745L14.864 1.22087L14.864 1.22087L14.7296 1.28745ZM14.678 1.82958L14.7972 1.92058L14.7974 1.92033L14.678 1.82958ZM10.4138 7.41697L10.2945 7.32596L10.1106 7.56697H10.4138V7.41697ZM2.95529 18.6408L2.81731 18.582L3.06137 18.7469L2.95529 18.6408ZM5.95832 11.5985L5.82052 11.5392L5.82034 11.5396L5.95832 11.5985ZM13.1454 8.44813L13.2515 8.55418L13.5075 8.29813H13.1454V8.44813ZM9.35675 8.44813L9.35657 8.59813H9.35675V8.44813ZM8.89422 8.16067L8.7598 8.22725L8.7598 8.22725L8.89422 8.16067ZM8.94584 7.61855L8.82673 7.52737L8.82641 7.5278L8.94584 7.61855ZM13.223 2.03116L13.3421 2.12234L13.5267 1.88116H13.223V2.03116ZM7.09544 2.03116V1.88116H6.99565L6.95709 1.9732L7.09544 2.03116ZM3.38946 10.8774L3.25111 10.8195L3.16399 11.0274H3.38946V10.8774ZM5.4828 10.8774L5.4828 11.0274L5.48299 11.0274L5.4828 10.8774ZM5.91496 11.1097L6.04018 11.0272L6.04018 11.0271L5.91496 11.1097ZM15.0102 7.67709C14.9064 7.42825 14.663 7.26641 14.3934 7.26697L14.394 7.56697C14.5423 7.56666 14.6762 7.6557 14.7333 7.79259L15.0102 7.67709ZM14.8669 8.40412C15.0573 8.2131 15.1139 7.92623 15.0103 7.67723L14.7333 7.79246C14.7903 7.92944 14.7591 8.08726 14.6544 8.19235L14.8669 8.40412ZM1.89844 21.3829L14.8668 8.40426L14.6545 8.19221L1.68622 21.1709L1.89844 21.3829ZM1.05454 21.4621C1.31839 21.6407 1.67173 21.6078 1.89796 21.3834L1.6867 21.1704C1.56225 21.2938 1.36786 21.312 1.22271 21.2137L1.05454 21.4621ZM0.814288 20.6498C0.690036 20.9432 0.790684 21.2835 1.05454 21.4621L1.22271 21.2137C1.07755 21.1154 1.02218 20.9282 1.09054 20.7668L0.814288 20.6498ZM4.56176 11.8627L0.814436 20.6495L1.09039 20.7672L4.83771 11.9803L4.56176 11.8627ZM2.61157 12.0715H4.69973V11.7715H2.61157V12.0715ZM2.05759 11.7736C2.1808 11.9591 2.38846 12.0709 2.61113 12.0715L2.61201 11.7715C2.48951 11.7712 2.37527 11.7097 2.30748 11.6076L2.05759 11.7736ZM1.99761 11.1479C1.91188 11.3534 1.93438 11.5881 2.05759 11.7736L2.30748 11.6076C2.2397 11.5056 2.22732 11.3764 2.27449 11.2634L1.99761 11.1479ZM6.13783 1.25994L1.99769 11.1477L2.27441 11.2636L6.41456 1.37581L6.13783 1.25994ZM6.75128 0.850001C6.48287 0.850784 6.24109 1.01241 6.13776 1.26013L6.41463 1.37563C6.47148 1.23935 6.60449 1.15043 6.75215 1.15L6.75128 0.850001ZM14.267 0.85H6.75172V1.15H14.267V0.85ZM14.864 1.22087C14.7516 0.993984 14.5204 0.85031 14.2672 0.85L14.2669 1.15C14.4061 1.15017 14.5333 1.22921 14.5952 1.35403L14.864 1.22087ZM14.7974 1.92033C14.9506 1.71873 14.9764 1.44776 14.864 1.22087L14.5952 1.35403C14.657 1.47885 14.6428 1.62792 14.5585 1.73883L14.7974 1.92033ZM10.533 7.50797L14.7972 1.92058L14.5587 1.73858L10.2945 7.32596L10.533 7.50797ZM14.3937 7.26697H10.4138V7.56697H14.3937V7.26697ZM3.09327 18.6997L6.0963 11.6573L5.82034 11.5396L2.81731 18.582L3.09327 18.6997ZM13.0393 8.34207L2.84921 18.5348L3.06137 18.7469L13.2515 8.55418L13.0393 8.34207ZM9.35675 8.59813H13.1454V8.29813H9.35675V8.59813ZM8.7598 8.22725C8.87219 8.45414 9.10337 8.59782 9.35657 8.59813L9.35694 8.29813C9.21764 8.29796 9.09046 8.21892 9.02863 8.0941L8.7598 8.22725ZM8.82641 7.5278C8.67322 7.7294 8.64742 8.00036 8.7598 8.22725L9.02863 8.0941C8.96681 7.96927 8.981 7.82021 9.06527 7.7093L8.82641 7.5278ZM13.1038 1.93998L8.82673 7.52737L9.06495 7.70972L13.3421 2.12234L13.1038 1.93998ZM7.09544 2.18116H13.223V1.88116H7.09544V2.18116ZM3.52781 10.9354L7.23379 2.08912L6.95709 1.9732L3.25111 10.8195L3.52781 10.9354ZM5.4828 10.7274H3.38946V11.0274H5.4828V10.7274ZM6.04018 11.0271C5.91661 10.8398 5.70706 10.7271 5.4826 10.7274L5.48299 11.0274C5.60648 11.0273 5.72176 11.0892 5.78974 11.1923L6.04018 11.0271ZM6.09612 11.6577C6.18478 11.4515 6.16376 11.2145 6.04018 11.0272L5.78974 11.1923C5.85773 11.2954 5.86929 11.4258 5.82052 11.5392L6.09612 11.6577Z"
      fill="#343943"
    />
  </svg>
);

export default FAQPopUp;
