import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Calendar,
  Clock,
  MapPin,
  Music,
  Volume2,
  VolumeX,
  CheckCircle,
  Heart,
  Share2,
  Sparkles,
} from "lucide-react";

const defaultData = {
  childName: "Arthur",
  age: 5,
  date: "2026-10-24",
  formattedDate: "24 de Outubro de 2026",
  dayOfWeek: "Sábado",
  time: "16:00",
  locationName: "Valle dos Dinossauros Kids",
  address: "Av. das Américas, 1234 - Barra da Tijuca, Rio de Janeiro - RJ",
  googleMapsUrl: "https://maps.google.com",
  message:
    "Junte-se a nós nessa expedição jurássica para comemorar os 5 anos do Arthur!",
  musicUrl: "/sounds/dino-theme.mp3",
  photoUrl:
    "https://images.unsplash.com/photo-1543852786-1cf6624b9987?auto=format&fit=crop&q=80&w=600",
};

// Pegadas flutuantes decorativas usadas no fundo animado
function FloatingFootprints() {
  const footprints = Array.from({ length: 6 });
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      {footprints.map((_, i) => (
        <motion.span
          key={i}
          className="absolute text-emerald-800/10 select-none"
          style={{
            left: `${(i * 17) % 100}%`,
            top: `${(i * 23) % 100}%`,
            fontSize: `${20 + (i % 3) * 10}px`,
          }}
          initial={{ opacity: 0, y: 0 }}
          animate={{ opacity: [0.15, 0.35, 0.15], y: [-10, 10, -10] }}
          transition={{
            duration: 5 + i,
            repeat: Infinity,
            ease: "easeInOut",
            delay: i * 0.4,
          }}
        >
          🦖
        </motion.span>
      ))}
    </div>
  );
}

function SectionCard({ children, className = "", delay = 0 }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.6, delay, ease: "easeOut" }}
      className={`relative rounded-3xl border-2 border-amber-800/20 bg-amber-50/90 p-5 shadow-lg shadow-emerald-950/10 ${className}`}
    >
      {children}
    </motion.div>
  );
}

export default function DinosaurTheme({ data }) {
  const info = { ...defaultData, ...data };

  const [isPlaying, setIsPlaying] = useState(false);
  const [confirmed, setConfirmed] = useState(false);
  const [guestName, setGuestName] = useState("");
  const audioRef = useRef(null);

  useEffect(() => {
    const audio = audioRef.current;
    return () => {
      if (audio) {
        audio.pause();
      }
    };
  }, []);

  const toggleMusic = () => {
    const audio = audioRef.current;
    if (!audio) return;
    if (isPlaying) {
      audio.pause();
    } else {
      audio.play().catch(() => {});
    }
    setIsPlaying(!isPlaying);
  };

  const handleConfirm = (e) => {
    e.preventDefault();
    if (!guestName.trim()) return;
    setConfirmed(true);
  };

  const handleShare = async () => {
    const shareData = {
      title: `Aniversário do ${info.childName}`,
      text: info.message,
      url: window.location.href,
    };
    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch {
        // usuário cancelou o compartilhamento
      }
    } else {
      await navigator.clipboard.writeText(window.location.href);
      alert("Link copiado para a área de transferência!");
    }
  };

  return (
    <div className="relative min-h-screen w-full max-w-md mx-auto overflow-x-hidden bg-amber-50 font-sans text-emerald-950">
      <audio ref={audioRef} src={info.musicUrl} loop />

      {/* Botão de música fixo */}
      <motion.button
        onClick={toggleMusic}
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 1, type: "spring" }}
        className="fixed top-4 right-4 z-50 flex h-11 w-11 items-center justify-center rounded-full bg-emerald-900 text-amber-100 shadow-lg shadow-emerald-950/30"
        aria-label={isPlaying ? "Pausar música" : "Tocar música"}
      >
        {isPlaying ? <Volume2 size={20} /> : <VolumeX size={20} />}
      </motion.button>

      {/* HERO */}
      <section className="relative flex flex-col items-center justify-center overflow-hidden bg-gradient-to-b from-emerald-900 via-emerald-800 to-emerald-900 px-6 pb-20 pt-14 text-center">
        <FloatingFootprints />

        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.7 }}
          className="relative z-10 flex flex-col items-center"
        >
          <motion.span
            animate={{ rotate: [0, -8, 8, 0] }}
            transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
            className="text-6xl drop-shadow-lg"
          >
            🦕
          </motion.span>

          <motion.h2
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mt-2 flex items-center gap-2 text-sm font-bold uppercase tracking-widest text-amber-300"
          >
            <Sparkles size={14} /> Uma expedição jurássica
          </motion.h2>

          <motion.h1
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.45 }}
            className="mt-3 text-4xl font-black leading-tight text-amber-50 drop-shadow-md"
          >
            {info.childName} está <br /> fazendo {info.age} anos!
          </motion.h1>

          {info.photoUrl && (
            <motion.div
              initial={{ opacity: 0, scale: 0.7 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.6, type: "spring" }}
              className="relative mt-6 h-44 w-44 overflow-hidden rounded-full border-4 border-amber-400 shadow-xl shadow-emerald-950/40"
            >
              <img
                src={info.photoUrl}
                alt={info.childName}
                className="h-full w-full object-cover"
              />
            </motion.div>
          )}
        </motion.div>

        <svg
          className="absolute -bottom-1 left-0 w-full text-amber-50"
          viewBox="0 0 1440 100"
          preserveAspectRatio="none"
        >
          <path
            fill="currentColor"
            d="M0,64 C240,100 480,0 720,32 C960,64 1200,100 1440,48 L1440,100 L0,100 Z"
          />
        </svg>
      </section>

      {/* MENSAGEM */}
      <section className="relative z-10 -mt-8 px-5">
        <SectionCard>
          <p className="text-center text-base leading-relaxed text-emerald-900">
            {info.message}
          </p>
        </SectionCard>
      </section>

      {/* DATA, HORA E LOCAL */}
      <section className="mt-6 space-y-4 px-5">
        <SectionCard delay={0.1} className="flex items-center gap-4">
          <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-emerald-600 text-amber-50">
            <Calendar size={24} />
          </span>
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-amber-800">
              {info.dayOfWeek}
            </p>
            <p className="text-lg font-bold text-emerald-950">
              {info.formattedDate}
            </p>
          </div>
        </SectionCard>

        <SectionCard delay={0.2} className="flex items-center gap-4">
          <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-orange-500 text-amber-50">
            <Clock size={24} />
          </span>
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-amber-800">
              Horário
            </p>
            <p className="text-lg font-bold text-emerald-950">{info.time}</p>
          </div>
        </SectionCard>

        <SectionCard delay={0.3} className="flex items-start gap-4">
          <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-amber-800 text-amber-50">
            <MapPin size={24} />
          </span>
          <div className="flex-1">
            <p className="text-xs font-semibold uppercase tracking-wide text-amber-800">
              Local
            </p>
            <p className="text-lg font-bold text-emerald-950">
              {info.locationName}
            </p>
            <p className="mt-1 text-sm text-emerald-800/80">{info.address}</p>
            <a
              href={info.googleMapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-2 inline-block text-sm font-semibold text-orange-600 underline underline-offset-2"
            >
              Ver no mapa
            </a>
          </div>
        </SectionCard>
      </section>

      {/* CONFIRMAÇÃO DE PRESENÇA */}
      <section className="mt-6 px-5">
        <SectionCard delay={0.1} className="bg-emerald-900 text-amber-50">
          <h3 className="flex items-center justify-center gap-2 text-center text-lg font-bold">
            <Heart size={18} className="text-orange-400" />
            Confirme sua presença
          </h3>

          <AnimatePresence mode="wait">
            {confirmed ? (
              <motion.div
                key="success"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                className="mt-4 flex flex-col items-center gap-2 text-center"
              >
                <CheckCircle size={40} className="text-emerald-400" />
                <p className="font-semibold">
                  Presença confirmada, {guestName}! Nos vemos na aventura 🦖
                </p>
              </motion.div>
            ) : (
              <motion.form
                key="form"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onSubmit={handleConfirm}
                className="mt-4 flex flex-col gap-3"
              >
                <input
                  type="text"
                  value={guestName}
                  onChange={(e) => setGuestName(e.target.value)}
                  placeholder="Seu nome"
                  required
                  className="w-full rounded-xl border border-amber-200/30 bg-amber-50/10 px-4 py-3 text-amber-50 placeholder-amber-200/60 outline-none focus:border-orange-400"
                />
                <motion.button
                  whileTap={{ scale: 0.96 }}
                  type="submit"
                  className="w-full rounded-xl bg-orange-500 px-4 py-3 font-bold text-amber-50 shadow-md shadow-orange-900/30 transition-colors hover:bg-orange-600"
                >
                  Confirmar presença
                </motion.button>
              </motion.form>
            )}
          </AnimatePresence>
        </SectionCard>
      </section>

      {/* AÇÕES FINAIS */}
      <section className="mt-6 flex justify-center gap-4 px-5 pb-12">
        <motion.button
          whileTap={{ scale: 0.94 }}
          onClick={handleShare}
          className="flex items-center gap-2 rounded-full border-2 border-emerald-700 bg-amber-50 px-5 py-3 font-semibold text-emerald-800 shadow-sm"
        >
          <Share2 size={18} />
          Compartilhar
        </motion.button>

        <motion.a
          whileTap={{ scale: 0.94 }}
          href={info.musicUrl}
          onClick={(e) => {
            e.preventDefault();
            toggleMusic();
          }}
          className="flex items-center gap-2 rounded-full border-2 border-amber-800 bg-amber-50 px-5 py-3 font-semibold text-amber-900 shadow-sm"
        >
          <Music size={18} />
          {isPlaying ? "Pausar" : "Tocar música"}
        </motion.a>
      </section>

      <footer className="pb-8 text-center text-xs text-emerald-800/60">
        Feito com 💚 no ConviteJá
      </footer>
    </div>
  );
}
