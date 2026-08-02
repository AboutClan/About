import Header from "../../components/layouts/Header";
import InfoModalButton from "../../components/modalButtons/InfoModalButton";

function StudyPageHeader() {
  return (
    <Header title="스터디" isBack={false}>
      <InfoModalButton type="study" />
    </Header>
  );
}

export function LocationIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
      <path
        d="M12 1.5C16.9629 1.5 21 5.46722 21 10.3779C21 13.4321 19.2117 16.4464 17.3164 18.6406C16.3573 19.751 15.3393 20.6888 14.4414 21.3555C13.9931 21.6883 13.5618 21.9632 13.1729 22.1582C12.8084 22.341 12.392 22.5 12 22.5C11.608 22.5 11.1917 22.341 10.8271 22.1582C10.4382 21.9632 10.0069 21.6883 9.55859 21.3555C8.66066 20.6888 7.64269 19.751 6.68359 18.6406C4.78828 16.4464 3 13.4321 3 10.3779C3.00001 5.46723 7.03708 1.50002 12 1.5ZM12 6.87793C10.2958 6.87797 8.91406 8.25395 8.91406 9.95117C8.91412 11.6483 10.2959 13.0244 12 13.0244C13.7042 13.0244 15.0859 11.6484 15.0859 9.95117C15.0859 8.25392 13.7042 6.87793 12 6.87793Z"
        fill="var(--color-gray)"
      />
    </svg>
  );
}

export default StudyPageHeader;
