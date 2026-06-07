const FounderSection = () => {
  return (
    <section
      id="fundadores"
      className="
        px-6 py-28
        bg-[#050b14]
        border-y border-slate-800/70
      "
    >
      <div className="max-w-6xl mx-auto grid lg:grid-cols-2 gap-14 items-center">
        {/* Imagen */}
        <div
          className="
            relative overflow-hidden rounded-3xl
            border border-cyan-500/20
            shadow-[0_0_45px_rgba(34,211,238,0.18)]
          "
        >
          <img
            src="/lacobra-founders.jpeg"
            alt="Fundadores de GYM LACOBRA"
            className="
              w-full h-[520px]
              object-cover
              object-center
              hover:scale-105
              transition-transform duration-700
            "
          />

          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />

          <div className="absolute bottom-6 left-6 right-6">
            <p className="text-cyan-400 text-xs font-black tracking-[0.35em] uppercase mb-2">
              GYM LACOBRA
            </p>
            <h3 className="text-white text-2xl font-black">
              Disciplina, fuerza y visión
            </h3>
          </div>
        </div>

        {/* Texto */}
        <div>
          <p className="text-cyan-400 text-sm font-black tracking-[0.35em] uppercase mb-5">
            Detrás del proyecto
          </p>

          <h2 className="text-4xl md:text-5xl font-black text-white leading-tight mb-6">
            La fuerza detrás de{" "}
            <span className="text-cyan-400">GYM LACOBRA</span>
          </h2>

          <p className="text-slate-300 text-lg leading-8 mb-6">
            GYM LACOBRA nace de una visión clara: crear un espacio donde el
            entrenamiento no sea solo una rutina, sino una mentalidad. Detrás
            del proyecto hay personas comprometidas con el alto rendimiento, la
            disciplina y la transformación física.
          </p>

          <p className="text-slate-400 leading-7 mb-8">
            Nuestro objetivo es combinar tecnología, acompañamiento y cultura
            fitness para que cada persona entrene con propósito, mida su progreso
            y encuentre una comunidad que la impulse a mejorar.
          </p>

          <div className="grid sm:grid-cols-3 gap-4">
            <div className="rounded-2xl bg-slate-900/80 border border-slate-800 p-5">
              <p className="text-cyan-400 text-2xl font-black">01</p>
              <p className="text-white font-bold mt-2">Mentalidad</p>
            </div>

            <div className="rounded-2xl bg-slate-900/80 border border-slate-800 p-5">
              <p className="text-cyan-400 text-2xl font-black">02</p>
              <p className="text-white font-bold mt-2">Disciplina</p>
            </div>

            <div className="rounded-2xl bg-slate-900/80 border border-slate-800 p-5">
              <p className="text-cyan-400 text-2xl font-black">03</p>
              <p className="text-white font-bold mt-2">Resultados</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FounderSection;