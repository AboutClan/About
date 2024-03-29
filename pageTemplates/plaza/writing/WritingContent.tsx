import { motion } from "framer-motion";
import { FieldValues, UseFormRegister } from "react-hook-form";
import styled from "styled-components";
function WritingContent({
  register,
  isVote,
}: {
  register: UseFormRegister<FieldValues>;
  isVote: boolean;
}) {
  return (
    <>
      <Layout
        animate={{ opacity: 1 }}
        initial={{ opacity: 0 }}
        transition={{ duration: 0.3 }}
        layout
      >
        <Content
          {...register("content")}
          placeholder="내용을 입력하세요."
          isVote={isVote}
        />
      </Layout>
    </>
  );
}

const Layout = styled(motion.div)`
  margin-top: 12px;
  font-size: 14px;
  font-weight: 600;
  color: var(--gray-1);
  padding-bottom: 12px;
  border-bottom: 2px solid var(--gray-6);
`;

const Content = styled.textarea<{ isVote: boolean }>`
  width: 100%;
  height: ${(props) => (props.isVote ? "68px" : "380px")};
  padding: 2px;
  color: var(--gray-2);
  background-color: var(--gray-8);

  ::placeholder {
    font-size: 15px;
    transition: none;
    color: var(--gray-4);
  }
`;

export default WritingContent;
