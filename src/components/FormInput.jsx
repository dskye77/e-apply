import { useRef } from "react";

export default function FormInput({
  label,
  type = "text",
  name,
  value,
  onChange,
  placeholder,
  required = false,
  options = [],
}) {
  const fileRef = useRef(null);

  const baseClass =
    "w-full px-3.5 py-2.5 text-base border border-gray-400 rounded-md " +
    "focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-200 " +
    "bg-white text-gray-900 placeholder-gray-500";

  function renderInput() {
    if (type === "select") {
      return (
        <select
          name={name}
          value={value}
          onChange={onChange}
          required={required}
          className={baseClass}
        >
          <option value="" disabled>
            {placeholder || "— Select —"}
          </option>
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      );
    }

    if (type === "radio-group") {
      return (
        <div className="flex flex-col gap-2 mt-2">
          {options.map((opt) => (
            <label
              key={opt.value}
              className="flex items-center gap-2 cursor-pointer"
            >
              <input
                type="radio"
                name={name}
                value={opt.value}
                checked={value === opt.value}
                onChange={onChange}
                required={required}
                className="w-3 h-3 text-blue-600 border-gray-300 focus:ring-blue-500"
              />
              <span className="text-base text-gray-900">{opt.label}</span>
            </label>
          ))}
        </div>
      );
    }

    if (type === "date") {
      return (
        <input
          type="date"
          name={name}
          value={value}
          onChange={onChange}
          required={required}
          className={baseClass}
        />
      );
    }

    if (type === "file") {
      return (
        <div>
          <input
            ref={fileRef}
            type="file"
            name={name}
            onChange={onChange}
            required={required}
            className="hidden"
          />

          <button
            type="button"
            onClick={() => fileRef.current?.click()}
            className="w-40 border border-dashed border-blue-500 rounded-lg py-8 text-center
                       text-blue-600 hover:bg-blue-50 transition"
          >
            {value?.name || "Choose File"}
          </button>
        </div>
      );
    }

    if (type === "textarea") {
      return (
        <textarea
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          required={required}
          rows={5}
          className={baseClass}
        />
      );
    }
    if (type === "checkbox") {
      return (
        <label className="flex items-center gap-3 cursor-pointer">
          <input
            type="checkbox"
            name={name}
            checked={!!value}
            onChange={(e) =>
              onChange({
                target: { name, value: e.target.checked },
              })
            }
            required={required}
            className="w-4 h-4 text-blue-600 border-gray-400 rounded focus:ring-blue-500"
          />
          <span className="text-base text-gray-900">{placeholder}</span>
        </label>
      );
    }
    if (type === "text") {
      return (
        <div className="text-gray-800 leading-relaxed">
          <p className="whitespace-pre-line">{placeholder}</p>
        </div>
      );
    }

    // default input
    return (
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        className={baseClass}
      />
    );
  }

  return (
    <div className="mb-6 w-full">
      <label className="block mb-1.5 text-base font-semibold text-gray-900">
        {label}
        {required && <span className="text-red-600 ml-1 font-bold">*</span>}
      </label>

      {renderInput()}
    </div>
  );
}
