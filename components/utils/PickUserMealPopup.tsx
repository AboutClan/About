import styled from "styled-components";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverHeader,
  PopoverBody,
  PopoverFooter,
  PopoverArrow,
  PopoverCloseButton,
  PopoverAnchor,
  Portal,
  Button,
} from "@chakra-ui/react";
import {
  faBan,
  faBurger,
  faCarrot,
  faChampagneGlasses,
  faPizzaSlice,
  faUtensils,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
function PickUserMealPopup() {
  return (
    <Layout>
      <Popover>
        <PopoverTrigger>
          <FontAwesomeIcon icon={faUtensils} color="var(--font-h2)" />
        </PopoverTrigger>
        <Portal>
          <PopoverContent width="238px">
            <PopoverArrow />
            <PopoverHeader
              fontSize="13px"
              fontWeight="600"
              color="var(--font-h1)"
            >
              밥 먹을래?
            </PopoverHeader>
            <PopoverCloseButton />
            <PopoverBody display="flex" flexWrap="wrap">
              <Button
                backgroundColor="var(--color-orange)"
                color="white"
                size="sm"
                mr="8px"
                mb="8px"
              >
                <FontAwesomeIcon icon={faBurger} />
                <span style={{ marginLeft: "6px" }}>점심</span>
              </Button>
              <Button
                backgroundColor="var(--color-orange)"
                color="white"
                size="sm"
                mr="8px"
                mb="8px"
              >
                <FontAwesomeIcon icon={faPizzaSlice} />
                <span style={{ marginLeft: "6px" }}>저녁</span>
              </Button>

              <Button
                backgroundColor="var(--color-orange)"
                color="white"
                size="sm"
                mr="8px"
                mb="8px"
              >
                <FontAwesomeIcon icon={faCarrot} />
                <span style={{ marginLeft: "6px" }}>고민</span>
              </Button>
              <Button
                backgroundColor="var(--color-orange)"
                color="white"
                size="sm"
                mr="8px"
                mb="8px"
              >
                <FontAwesomeIcon icon={faBan} />
                <span style={{ marginLeft: "6px" }}>안먹어</span>
              </Button>
              <Button
                backgroundColor="var(--color-orange)"
                color="white"
                size="sm"
                mr="8px"
                mb="8px"
              >
                <FontAwesomeIcon icon={faChampagneGlasses} />
                <span style={{ marginLeft: "6px" }}>뒤풀이</span>
              </Button>
            </PopoverBody>
          </PopoverContent>
        </Portal>
      </Popover>
    </Layout>
  );
}

const Layout = styled.div``;

export default PickUserMealPopup;
