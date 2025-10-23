import type { SelectProps } from "./interfaces";

const Select = ({
  text,
  name,
  options,
  handleOnChange,
  value,
}: SelectProps) => {
  return (
    <div className="flex flex-col mb-4">
      <label className="mb-1 font-bold text-xl" htmlFor={name}>
        {text}:
      </label>
      <select
        className="p-2 border border-[#777] rounded-sm placeholder-[#7b7b7b] text-md"
        name={name}
        id={name}
        onChange={handleOnChange}
        value={value || ""}
      >
        <option>Selecione uma opção</option>
        {options.map((option) => (
          <option value={option} key={option}>
            {option}
          </option>
        ))}
      </select>
    </div>
  );
};

export default Select;
