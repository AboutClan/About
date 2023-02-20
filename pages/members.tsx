import {
  fa0,
  faArrowLeft,
  faBell,
  faFilter,
  faSearch,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { useState } from "react";
import styled from "styled-components";
import CategoryFilter from "../components/Members/CategoryFilter";

import UserBlock from "../components/Members/UserBlock";
import { animate, motion } from "framer-motion";
import { transition } from "@chakra-ui/react";
import Link from "next/link";
import { useSetRecoilState } from "recoil";
import { useEffect } from "react";
import { isShowMemberInfoState } from "../recoil/membersAtoms";

const Layout = styled.div`
  display: flex;
  flex-direction: column;
`;

const Header = styled.header`
  padding: 0 15px;
  height: 45px;
  display: grid;
  align-items: center;
  grid-template-columns: 1fr 1fr 1fr;
  > span {
    font-size: 1.4em;
    text-align: center;
  }
`;

const Navigation = styled.nav`
  margin-bottom: 3vh;
`;
const NavigationHeader = styled.header`
  color: rgb(0, 0, 0, 0.7);
  height: 45px;
  display: flex;
  justify-content: space-between;
  padding: 12px;
  background-color: rgb(0, 0, 0, 0.2);
`;

const Filter = styled.div`
  display: flex;
  align-items: center;
  > span {
    margin-left: 10px;
  }
`;

const Search = styled.div`
  display: flex;
  align-items: center;
  > span {
    margin-right: 10px;
  }
`;

const FilterNav = styled(motion.nav)`
  background-color: rgb(0, 0, 0, 0.1);
`;

const TitleHeader = styled.header`
  display: flex;
  justify-content: space-between;
  padding: 12px;
  > span {
    font-size: 1.4em;
  }
`;

const UserRankBtn = styled.button`
  width: 40px;
  height: 30px;
`;

const MembersMain = styled.main`
  padding: 10px;
  display: grid;
  gap: 10px;
  grid-template-columns: repeat(auto-fit, 80px);
  grid-auto-rows: 80px;
`;

const SearchInput = styled(motion.input)`
  width: 100px;
  transform-origin: right center;
  margin-right: 8px;
`;

export interface ICategory {
  name: string;
  isSortUp?: boolean;
}

function Members() {
  const router = useRouter();
  const [isNavOpend, setIsNavOpened] = useState(false);
  const [category, setCategory] = useState<ICategory>({ name: "가입일" });
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [userList, setUserList] = useState(userArr);
  const onFilterClicked = () => {
    setIsNavOpened((isOpen) => !isOpen);
  };

  const sortedKeys = Object.keys(userList[0]);

  const Cat = "age";

  useEffect(() => {
    const sortedCategory = userList.sort((a, b) => {
      if (a[Cat] > b[Cat]) return 1;
      else if (a[Cat] < b[Cat]) return -1;
      else return 0;
    });
    setUserList(sortedCategory);
  }, [category]);

  return (
    <Layout>
      <Header>
        <Link href={`/about`}>
          <FontAwesomeIcon icon={faArrowLeft} />
        </Link>
        <span>Members</span>
      </Header>
      <Navigation>
        <NavigationHeader>
          <Filter onClick={onFilterClicked}>
            <FontAwesomeIcon icon={faFilter} />
            <span>filter</span>
          </Filter>
          <Search>
            <SearchInput
              placeholder="Search"
              animate={{ scaleX: isSearchOpen ? 1 : 0 }}
              transition={{ type: "linear" }}
            />

            <div onClick={() => setIsSearchOpen((isOpen) => !isOpen)}>
              <FontAwesomeIcon icon={faSearch} />
            </div>
          </Search>
        </NavigationHeader>

        <FilterNav
          animate={{
            scaleY: isNavOpend ? 1 : 0,
            y: isNavOpend ? 0 : -40,
            height: isNavOpend ? 80 : 0,
          }}
          transition={{ type: "linear" }}
        >
          <CategoryFilter category={category} setCategory={setCategory} />
        </FilterNav>
      </Navigation>
      <TitleHeader>
        <span>스터디원 리스트</span>
        <UserRankBtn>
          <FontAwesomeIcon icon={faBell} />
        </UserRankBtn>
      </TitleHeader>

      <MembersMain>
        {userList.map((user, idx) => (
          <UserBlock key={idx} userInfo={user} category={category} />
        ))}
      </MembersMain>
    </Layout>
  );
}
export default Members;

const userArr = [
  {
    name: "이승주",
    id: "1",
    age: 27,
    mbti: "ENTP",
    가입일: "1021-02-03",
    role: "회장",
  },
  {
    name: "이승주",
    id: "1",
    age: 23,
    mbti: "ENTP",
    가입일: "2021-02-08",
    role: "회장",
  },
  {
    name: "이승주",
    id: "1",
    age: 25,
    mbti: "ENTP",
    가입일: "2021-02-09",
    role: "회장",
  },
  {
    name: "이승주",
    id: "1",
    age: 27,
    mbti: "ENTP",
    가입일: "2021-02-08",
    role: "회장",
  },
  {
    name: "이승주",
    id: "1",
    age: 22,
    mbti: "ENTP",
    가입일: "2021-02-08",
    role: "회장",
  },
  {
    name: "이승주",
    id: "1",
    age: 30,
    mbti: "ENTP",
    가입일: "2021-02-08",
    role: "회장",
  },
  {
    name: "이승주",
    id: "1",
    age: 27,
    mbti: "ENTP",
    가입일: "2021-02-08",
    role: "회장",
  },
  {
    name: "이승주",
    id: "1",
    age: 27,
    mbti: "ENTP",
    가입일: "2021-02-08",
    role: "회장",
  },
  {
    name: "이승주",
    id: "1",
    age: 27,
    mbti: "ENTP",
    가입일: "2021-02-08",
    role: "회장",
  },
  {
    name: "이승주",
    id: "1",
    age: 27,
    mbti: "ENTP",
    가입일: "2021-02-08",
    role: "회장",
  },
  {
    name: "이승주",
    id: "1",
    age: 27,
    mbti: "ENTP",
    가입일: "2021-02-08",
    role: "회장",
  },
  {
    name: "이승주",
    id: "1",
    age: 27,
    mbti: "ENTP",
    가입일: "2021-02-08",
    role: "회장",
  },
  {
    name: "이승주",
    id: "1",
    age: 27,
    mbti: "ENTP",
    가입일: "2021-02-08",
    role: "회장",
  },
  {
    name: "이승주",
    id: "1",
    age: 27,
    mbti: "ENTP",
    가입일: "2021-02-08",
    role: "회장",
  },
  {
    name: "이승주",
    id: "1",
    age: 27,
    mbti: "ENTP",
    가입일: "2021-02-08",
    role: "회장",
  },
  {
    name: "이승주",
    id: "1",
    age: 27,
    mbti: "ENTP",
    가입일: "2021-02-08",
    role: "회장",
  },
  {
    name: "이승주",
    id: "1",
    age: 27,
    mbti: "ENTP",
    가입일: "2021-02-08",
    role: "회장",
  },
  {
    name: "이승주",
    id: "1",
    age: 27,
    mbti: "ENTP",
    가입일: "2021-02-08",
    role: "회장",
  },
  {
    name: "이승주",
    id: "1",
    age: 27,
    mbti: "ENTP",
    가입일: "2021-02-08",
    role: "회장",
  },
  {
    name: "이승주",
    id: "1",
    age: 27,
    mbti: "ENTP",
    가입일: "2021-02-08",
    role: "회장",
  },
  {
    name: "이승주",
    id: "1",
    age: 27,
    mbti: "ENTP",
    가입일: "2021-02-08",
    role: "회장",
  },
  {
    name: "이승주",
    id: "1",
    age: 27,
    mbti: "ENTP",
    가입일: "2021-02-08",
    role: "회장",
  },
  {
    name: "이승주",
    id: "1",
    age: 27,
    mbti: "ENTP",
    가입일: "2021-02-08",
    role: "회장",
  },
  {
    name: "이승주",
    id: "1",
    age: 27,
    mbti: "ENTP",
    가입일: "2021-02-08",
    role: "회장",
  },
  {
    name: "이승주",
    id: "1",
    age: 27,
    mbti: "ENTP",
    가입일: "2021-02-08",
    role: "회장",
  },
  {
    name: "이승주",
    id: "1",
    age: 27,
    mbti: "ENTP",
    가입일: "2021-02-08",
    role: "회장",
  },
  {
    name: "이승주",
    id: "1",
    age: 27,
    mbti: "ENTP",
    가입일: "2021-02-08",
    role: "회장",
  },
  {
    name: "이승주",
    id: "1",
    age: 27,
    mbti: "ENTP",
    가입일: "2021-02-08",
    role: "회장",
  },
  {
    name: "이승주",
    id: "1",
    age: 27,
    mbti: "ENTP",
    가입일: "2021-02-08",
    role: "회장",
  },
  {
    name: "이승주",
    id: "1",
    age: 27,
    mbti: "ENTP",
    가입일: "2021-02-08",
    role: "회장",
  },
  {
    name: "이승주",
    id: "1",
    age: 27,
    mbti: "ENTP",
    가입일: "2021-02-08",
    role: "회장",
  },
  {
    name: "이승주",
    id: "1",
    age: 27,
    mbti: "ENTP",
    가입일: "2021-02-08",
    role: "회장",
  },
  {
    name: "이승주",
    id: "1",
    age: 27,
    mbti: "ENTP",
    가입일: "2021-02-08",
    role: "회장",
  },
  {
    name: "이승주",
    id: "1",
    age: 27,
    mbti: "ENTP",
    가입일: "2021-02-08",
    role: "회장",
  },
  {
    name: "이승주",
    id: "1",
    age: 27,
    mbti: "ENTP",
    가입일: "2021-02-08",
    role: "회장",
  },
  {
    name: "이승주",
    id: "1",
    age: 27,
    mbti: "ENTP",
    가입일: "2021-02-08",
    role: "회장",
  },
  {
    name: "이승주",
    id: "1",
    age: 27,
    mbti: "ENTP",
    가입일: "2021-02-08",
    role: "회장",
  },
  {
    name: "이승주",
    id: "1",
    age: 27,
    mbti: "ENTP",
    가입일: "2021-02-08",
    role: "회장",
  },
  {
    name: "이승주",
    id: "1",
    age: 27,
    mbti: "ENTP",
    가입일: "2021-02-08",
    role: "회장",
  },
  {
    name: "이승주",
    id: "1",
    age: 27,
    mbti: "ENTP",
    가입일: "2021-02-08",
    role: "회장",
  },
  {
    name: "이승주",
    id: "1",
    age: 27,
    mbti: "ENTP",
    가입일: "2021-02-08",
    role: "회장",
  },
  {
    name: "이승주",
    id: "1",
    age: 27,
    mbti: "ENTP",
    가입일: "2021-02-08",
    role: "회장",
  },
  {
    name: "이승주",
    id: "1",
    age: 27,
    mbti: "ENTP",
    가입일: "2021-02-08",
    role: "회장",
  },
  {
    name: "이승주",
    id: "1",
    age: 27,
    mbti: "ENTP",
    가입일: "2021-02-08",
    role: "회장",
  },
  {
    name: "이승주",
    id: "1",
    age: 27,
    mbti: "ENTP",
    가입일: "2021-02-08",
    role: "회장",
  },
  {
    name: "이승주",
    id: "1",
    age: 27,
    mbti: "ENTP",
    가입일: "2021-02-08",
    role: "회장",
  },
  {
    name: "이승주",
    id: "1",
    age: 27,
    mbti: "ENTP",
    가입일: "2021-02-08",
    role: "회장",
  },
  {
    name: "이승주",
    id: "1",
    age: 27,
    mbti: "ENTP",
    가입일: "2021-02-08",
    role: "회장",
  },
  {
    name: "이승주",
    id: "1",
    age: 27,
    mbti: "ENTP",
    가입일: "2021-02-08",
    role: "회장",
  },
  {
    name: "이승주",
    id: "1",
    age: 27,
    mbti: "ENTP",
    가입일: "2021-02-08",
    role: "회장",
  },
  {
    name: "이승주",
    id: "1",
    age: 27,
    mbti: "ENTP",
    가입일: "2021-02-08",
    role: "회장",
  },
];
