/* src/app/screen/home/hero */

export default function Hero() {
  return (
    <section>
      <div
        className="mx-auto mt-4 h-100"
        style={{
          backgroundImage: 'url("/images/hero-bg.jfif")',
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="w-full h-full bg-black/60">
          <div className="w-full h-full max-w-6xl flex items-center justify-center">
            <h1 className="text-5xl font-bold text-white text-left px-2">
              E-RESIDENT APPLICATION PORTAL
            </h1>
          </div>
        </div>
      </div>
    </section>
  );
}
