import styled from "styled-components";

function RegisterCost({ isSecond }: { isSecond?: boolean }) {
  return (
    <Layout>
      <div>
        <span>가입비</span>
        <span>{isSecond ? "+0원" : "+2000원"}</span>
      </div>
      <div>
        <span>보증금</span>
        <span>{isSecond ? "+0원" : "+3000원"}</span>
      </div>

      <div>
        <span>총 금액</span>
        <span>= {isSecond ? "0원" : "5000원"}</span>
      </div>
    </Layout>
  );
}

const Layout = styled.div`
  display: flex;
  flex-direction: column;
  background-color: white;

  border-radius: var(--rounded-lg);
  border: var(--border-main);
  width: 160px;
  height: 140px;
  justify-content: space-around;

  > div {
    padding: 8px 14px;
    display: flex;
    justify-content: space-between;

    > span:last-child {
      font-weight: 600;
    }
  }
  > div:last-child {
    padding-top: 14px;
    border-top: 1px solid var(--gray-400);
  }
`;

export default RegisterCost;
