export interface WritingFormProps {
  title: string;
  text: string;
  images: Blob;
  type: "gather" | "group";
  typeId: string;
  isAnonymous: string;
  subCategory: string;
  date: string;
}
