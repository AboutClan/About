import styled from "styled-components";

export const Textarea = styled.textarea`
  flex: 1;
  background-color: var(--gray-200);
  border-radius: var(--rounded-lg);
  padding: var(--gap-3);
  &:focus {
    outline: none;
  }
`;

export const InputSm = styled.input`
  flex: 1;
  width: 100%;
  background-color: var(--gray-200);
  border-radius: var(--rounded-lg);
  padding: var(--gap-3);
  text-align: start;
  &:focus {
    outline: none;
  }
`;

export const InputLg = styled.input`
  height: 48px;
  width: 100%;
  border: var(--border);
  border-radius: var(--rounded-lg);
  padding: var(--gap-3);
  &:focus {
    outline-color: var(--gray-900);
  }
  ::placeholder {
    color: var(--gray-500);
  }
`;
