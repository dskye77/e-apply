const cards = [
  {
    title: "e-Resident Basic",
    desc: `Begin the process for your e-Resident application.`,
    desc2: `If you are paying in crypto, please click the crypto application button. If you are paying in normal currency, just click ‘apply’.`,
    button: "Apply (crypto)",
    link: "/e-resident-basic-application-duplicate-147",
  },
  {
    title: "e-Resident Plus",
    desc: `Begin the process for your e-Resident application. `,
    desc2: `If you are paying in crypto, please click the crypto application button. 
If you are paying in normal currency, just click ‘apply’.`,
    button: "Apply (crypto)",
    link: "/e-resident-plus-application-duplicate-36",
  },
  {
    title: "About e-Residency",
    desc: "Learn about e-Residency",
    desc2: ``,
    button: "Read more",
    link: "https://verdisgov.org/services/e-residency/",
  },
  {
    title: "Considerations",
    desc: "Considerations to know about when applying for e-Residency.",
    desc2: ``,
    button: "Read more",
    link: "#considerations",
  },
];

export default function Cards() {
  return (
    <section>
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-6 justify-between my-36 px-2">
        {cards.map(({ title, desc, desc2, button, link }, i) => (
          <Card key={i} title={title} desc={desc} desc2={desc2} button={button} link={link} />
        ))}
      </div>
    </section>
  );
}

const Card = ({ title, desc, desc2, button, link }) => {
  return (
    <div
      className="px-2 p-12 w-full h-120 rounded-lg flex flex-col justify-between items-center"
      style={{ boxShadow: "#000000 0px 0px 10px 0px" }}
    >
      <div>
        <h2 className="text-3xl text-center font-medium mb-16">{title}</h2>
        <p className="mb-4 text-center">{desc}</p>
        <p className="mb-4 text-center">{desc2}</p>
      </div>
      <a href={link} rel="noopener noreferrer">
        <button className="px-4 py-2 bg-black text-white rounded hover:bg-gray-600 cursor-pointer transition">
          {button}
        </button>
      </a>
    </div>
  );
};
