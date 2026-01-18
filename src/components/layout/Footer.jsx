/* eslint-disable @next/next/no-img-element */
export default function Footer() {
  return (
    <footer className="text-gray-600 py-6 mt-12 gap-8 px-2">
      <div className="max-w-6xl mx-auto text-center justify-between items-center gap-8 grid grid-cols-1 md:grid-cols-4">
        <div className="w-full">
          <img
            className="w-60"
            src="https://e-apply.vrdgov.org/wp-content/uploads/2023/06/mofa1411.png"
            alt="default-logo"
          />
        </div>
        <div className="w-full text-left">
          <p>
            This website allows you to apply for e-Residency and other forms.
          </p>
        </div>
        <div className="flex flex-col text-left w-full">
          <p>Useful links:</p>
          <a href="https://verdisgov.org/" className="text-blue-700">
            {" "}
            National Website{" "}
          </a>
          <a href="https://mofa.vrdgov.org/" className="text-blue-700">
            Ministry of Foreign Affairs
          </a>
        </div>
        <div className="w-full">
          <img
            className="w-60"
            src="https://e-apply.vrdgov.org/wp-content/uploads/New-Project-2025-11-03T150656.969-scaled.png"
            alt="New Project - 2025-11-03T150656.969"
          ></img>
        </div>
      </div>
    </footer>
  );
}
