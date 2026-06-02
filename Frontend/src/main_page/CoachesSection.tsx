const CoachesSection = () => {
  return (
    <section
      id="coaches"
      className="
        px-6 py-28
        bg-gradient-to-b from-[#050b14] via-[#07111f] to-[#050b14]
        border-y border-slate-800/70
      "
    >
      <div className="max-w-6xl mx-auto">
        {/* Encabezado */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <p className="text-cyan-400 text-sm font-black tracking-[0.35em] uppercase mb-5">
            Nuestro equipo
          </p>

          <h2 className="text-4xl md:text-5xl font-black text-white leading-tight mb-6">
            Coaches preparados para llevarte al{" "}
            <span className="text-cyan-400">siguiente nivel</span>
          </h2>

          <p className="text-slate-300 text-lg leading-8">
            En GYM LACOBRA no entrenás solo. Nuestro equipo combina experiencia,
            disciplina y seguimiento personalizado para ayudarte a construir
            fuerza, mejorar tu rendimiento y mantenerte constante.
          </p>
        </div>

        {/* Imagen principal */}
        <div
          className="
            relative overflow-hidden rounded-3xl
            border border-cyan-500/20
            shadow-[0_0_55px_rgba(34,211,238,0.22)]
            mb-12
          "
        >
          <img
            src="/lacobra-coaches.jpeg"
            alt="Coaches de GYM LACOBRA"
            className="
              w-full h-[500px]
            object-contain object-center
              hover:scale-105
              transition-transform duration-700
            "
          />

          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent" />

          <div className="absolute bottom-8 left-8 right-8 max-w-2xl">
            <p className="text-cyan-400 text-xs font-black tracking-[0.35em] uppercase mb-3">
              Alto rendimiento
            </p>

            <h3 className="text-3xl md:text-4xl font-black text-white mb-4">
              Unite al mejor gimnasio de Costa Rica
            </h3>

            <p className="text-slate-300 leading-7">
              Entrenadores comprometidos con tu proceso, tu técnica y tus
              resultados. Acá cada rutina tiene intención y cada avance cuenta.
            </p>
          </div>
        </div>

        {/* Tarjetas inferiores */}
        <div className="grid md:grid-cols-3 gap-6">
          <div className="rounded-2xl bg-slate-900/80 border border-slate-800 p-6 hover:border-cyan-500/40 transition-all duration-300">
            <p className="text-cyan-400 text-3xl font-black mb-3">01</p>
            <h3 className="text-white text-xl font-black mb-3">
              Acompañamiento real
            </h3>
            <p className="text-slate-400 leading-7">
              Coaches atentos a tu progreso, técnica y evolución dentro del
              gimnasio.
            </p>
          </div>

          <div className="rounded-2xl bg-slate-900/80 border border-slate-800 p-6 hover:border-cyan-500/40 transition-all duration-300">
            <p className="text-cyan-400 text-3xl font-black mb-3">02</p>
            <h3 className="text-white text-xl font-black mb-3">
              Rutinas con propósito
            </h3>
            <p className="text-slate-400 leading-7">
              Planes diseñados para entrenar con dirección, intensidad y
              objetivos claros.
            </p>
          </div>

          <div className="rounded-2xl bg-slate-900/80 border border-slate-800 p-6 hover:border-cyan-500/40 transition-all duration-300">
            <p className="text-cyan-400 text-3xl font-black mb-3">03</p>
            <h3 className="text-white text-xl font-black mb-3">
              Cultura de disciplina
            </h3>
            <p className="text-slate-400 leading-7">
              Un ambiente pensado para exigirte, motivarte y ayudarte a crear
              constancia.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CoachesSection;