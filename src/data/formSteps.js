// data/formSteps.js
export const formSteps = [
  {
    step: 1,
    fields: [
      {
        label: "First Name",
        name: "firstName",
        placeholder: "Enter Your First Name",
        required: true,
      },
      {
        label: "Middle Name",
        name: "middleName",
        placeholder: "Enter Your Middle Name",
      },
      {
        label: "Last Name",
        name: "lastName",
        placeholder: "Enter Your Last Name",
        required: true,
      },
      {
        label: "Surname at birth / previous surnames",
        name: "previousSurname",
      },
      { label: "Occupation", name: "occupation", required: true },
      { label: "Date of Birth", name: "dob", type: "date", required: true },
      {
        label: "Place of Birth",
        name: "placeOfBirth",
        placeholder: "e.g. Apatin, Serbia",
        required: true,
      },
      {
        label: "Country / region of birth",
        name: "country",
        type: "select",
        required: true,
        options: [
          { value: "serbia", label: "Serbia" },
          { value: "nigeria", label: "Nigeria" },
          { value: "usa", label: "USA" },
        ],
      },
    ],
  },
  {
    step: 2,
    fields: [
      { label: "Email", name: "email", type: "email", required: true },
      { label: "Phone Number", name: "phone", type: "tel", required: true },
    ],
  },
  // Add more steps as needed
];
