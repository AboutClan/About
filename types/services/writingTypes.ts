export interface WritingFormProps {
  title: string;
  text: string;
  images: Blob;
  type: "gather" | "group";
  typeId: string;
  isAnonymous: boolean;
  subCategory: string;
}
