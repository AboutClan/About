import Slide from "@/components/layouts/PageSlide";
import EventHeader from "@/features/event/screens/EventHeader";
import EventMission from "@/features/event/screens/EventMission";
import EventPoint from "@/features/event/screens/EventPoint";
import EventStore from "@/features/event/screens/EventStore";
import HomeWinRecordSection from "@/features/home/screens/HomeWinRecordSection";

export default function Index() {
  return (
    <>
      <EventHeader />
      <Slide>
        <EventMission />
        <EventStore />
        <EventPoint />

        <HomeWinRecordSection />
      </Slide>
    </>
  );
}
