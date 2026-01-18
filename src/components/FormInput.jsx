// components/FormInput.jsx
export default function FormInput({
  label,
  type = "text",
  name,
  value,
  onChange,
  placeholder,
  required = false,
  options = [], // for select or radio
}) {
  return (
    <div className={`mb-6 w-full`}>
      <label className="block mb-1.5 text-base font-semibold text-gray-900">
        {label}
        {required && <span className="text-red-600 ml-1 font-bold">*</span>}
      </label>

      {type === "select" ? (
        <select
          name={name}
          value={value}
          onChange={onChange}
          required={required}
          className="w-full px-3.5 py-2.5 text-base border border-gray-400 rounded-md 
                     focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-200 
                     bg-white text-gray-900 placeholder-gray-500 appearance-none"
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
      ) : type === "radio-group" ? (
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
      ) : type === "date" ? (
        <input
          type="date"
          name={name}
          value={value}
          onChange={onChange}
          required={required}
          className="w-full px-3.5 py-2.5 text-base border border-gray-400 rounded-md 
                     focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-200 
                     bg-white text-gray-900"
        />
      ) : (
        <input
          type={type}
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          required={required}
          className="w-full px-3.5 py-2.5 text-base border border-gray-400 rounded-md 
                     focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-200 
                     bg-white text-gray-900 placeholder-gray-500"
        />
      )}
    </div>
  );
}
