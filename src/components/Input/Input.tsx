import type { InputProps } from "./interfaces";

const Input = ({
  type,
  text,
  name,
  placeholder,
  handleOnChange,
  value,
  multiple,
}: InputProps) => {
  return (
    <div className="flex flex-col mb-4">
      <label className="mb-1 font-bold sm:text-xl" htmlFor={name}>
        {text}:
      </label>
      <input
        className="p-2 border border-[#777] rounded-sm placeholder-[#7b7b7b] text-sm sm:text-md"
        type={type}
        name={name}
        id={name}
        placeholder={placeholder}
        onChange={handleOnChange}
        value={value}
        {...(multiple ? { multiple } : "")}
      />
    </div>
  );
};

export default Input;
