export interface SelectProps {
  text: string;
  name: string;
  options: string[];
  handleOnChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  value: string;
}
