import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Volume2,
  VolumeX,
  RotateCcw,
  MapPin,
  Gift,
  CheckCircle2,
  Calendar,
  Clock,
  Sparkles,
  Share2,
  ExternalLink,
  Navigation,
} from "lucide-react";
import snowWhiteVideo from "../../assets/0915.mp4";

const defaultData = {
  childName: "Agatha",
  age: 1,
  date: "2026-12-10",
  formattedDate: "10 de Dezembro de 2026",
  dayOfWeek: "Sábado",
  time: "18:00",
  locationName: "Castelo Encantado Festas",
  address: "Rua das Maçãs, 777 - Jardim das Fadas, Rio de Janeiro - RJ",
  googleMapsUrl: "https://maps.google.com",
  videoUrl: snowWhiteVideo,
  giftListUrl: "https://minhalistadepresentes.com.br",
  suggestedGifts: [
    "Roupas e Vestidinhos (Tamanho 4)",
    "Calçados (Tamanho 25/26)",
    "Jogos Educativos e Quebra-cabeças",
    "Bonecas e Acessórios",
  ],
  pixKey: "123.456.789-00",
  message: "Espelho, espelho meu... Existe festa mais divertida que a minha?",
};

function SectionCard({ children, className = "", delay = 0 }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.6, delay, ease: "easeOut" }}
      className={`relative rounded-3xl border-2 border-amber-400/40 bg-amber-50 p-5 shadow-lg shadow-blue-950/10 ${className}`}
    >
      {children}
    </motion.div>
  );
}

export default function SnowWhiteTheme({ data }) {
  const info = { ...defaultData, ...data };

  const [isMuted, setIsMuted] = useState(false);
  const [videoEnded, setVideoEnded] = useState(false);
  const [confirmed, setConfirmed] = useState(false);
  const [guestName, setGuestName] = useState("");
  const [giftsOpen, setGiftsOpen] = useState(false);
  const videoRef = useRef(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video || !info.videoUrl) return;

    // tenta tocar com som; se o navegador bloquear, destrava assim que o usuário tocar na tela
    video.muted = false;
    video.play().catch(() => {
      const unlockAudio = () => {
        video.muted = false;
        setIsMuted(false);
        video.play().catch(() => {});
      };
      document.addEventListener("pointerdown", unlockAudio, { once: true });
      document.addEventListener("touchstart", unlockAudio, { once: true });
    });
  }, [info.videoUrl]);

  const handleVideoEnded = () => {
    setVideoEnded(true);
  };

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !videoRef.current.muted;
    }
    setIsMuted((prev) => !prev);
  };

  const handleReplay = () => {
    const video = videoRef.current;
    if (!video) return;
    setVideoEnded(false);
    video.currentTime = 0;
    video.muted = false;
    video.play().catch(() => {});
  };

  const handleConfirm = (e) => {
    e.preventDefault();
    if (!guestName.trim()) return;
    setConfirmed(true);
  };

  const handleShare = async () => {
    const shareData = {
      title: `Aniversário da ${info.childName}`,
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

  const copyPixKey = async () => {
    await navigator.clipboard.writeText(info.pixKey);
    alert("Chave Pix copiada!");
  };

  return (
    <div className="relative min-h-screen w-full max-w-md mx-auto overflow-x-hidden bg-amber-50 font-sans text-blue-900">
      {/* INTRO EM VÍDEO FULLSCREEN */}
      <section className="relative h-dvh w-full overflow-hidden bg-blue-950">
        {info.videoUrl && (
          <video
            ref={videoRef}
            src={info.videoUrl}
            onEnded={handleVideoEnded}
            playsInline
            autoPlay
            muted={isMuted}
            className="absolute inset-0 h-full w-full object-cover"
          />
        )}

        {/* botão de som, visível enquanto o vídeo ainda está tocando */}
        {info.videoUrl && !videoEnded && (
          <button
            onClick={toggleMute}
            className="absolute right-4 top-4 z-20 flex h-11 w-11 items-center justify-center rounded-full bg-blue-950/60 text-amber-50 backdrop-blur"
            aria-label={isMuted ? "Ativar som" : "Silenciar"}
          >
            {isMuted ? <VolumeX size={20} /> : <Volume2 size={20} />}
          </button>
        )}

        {/* botão de replay do vídeo */}
        {info.videoUrl && (
          <button
            onClick={handleReplay}
            className="absolute bottom-4 right-4 z-20 flex h-11 w-11 items-center justify-center rounded-full bg-blue-950/60 text-amber-50 backdrop-blur"
            aria-label="Assistir novamente"
          >
            <RotateCcw size={20} />
          </button>
        )}

        {/* overlay que surge sobre o último frame do vídeo e permanece, sem escurecer o frame */}
        <AnimatePresence>
          {videoEnded && (
            <>
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="absolute inset-x-0 top-0 z-10 flex justify-center px-6 pt-8"
              >
                <h1
                  style={{
                    fontFamily: "'Fredoka', sans-serif",
                    fontWeight: 700,
                    WebkitTextStroke: "2.5px #dc2626",
                    textShadow: "0 3px 6px rgba(0,0,0,0.5)",
                  }}
                  className="text-center text-4xl leading-tight text-amber-50"
                >
                  {info.childName} está fazendo {info.age} ano{info.age === 1 ? "" : "s"}!
                </h1>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.15 }}
                className="absolute inset-x-0 bottom-8 z-10 flex justify-center px-6"
              >
                <motion.a
                  href="#detalhes"
                  whileTap={{ scale: 0.95 }}
                  className="relative flex h-24 w-24 items-center justify-center"
                  aria-label="Ver mais"
                >
                  {/* folha */}
                  <span className="absolute -top-1 left-1/2 h-4 w-6 -translate-x-2 rotate-[-30deg] rounded-full bg-emerald-500" />
                  {/* cabinho */}
                  <span className="absolute -top-2 left-1/2 h-4 w-1.5 -translate-x-1/2 rounded-full bg-amber-800" />
                  {/* corpo da maçã */}
                  <span className="absolute inset-x-0 bottom-0 top-2 rounded-[50%_50%_46%_46%/60%_60%_40%_40%] bg-red-600 shadow-lg shadow-red-900/50" />
                  <span className="relative z-10 px-2 text-center text-sm font-bold leading-tight text-amber-50">
                    Ver mais
                  </span>
                </motion.a>
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </section>

      {/* MENSAGEM */}
      <section id="detalhes" className="relative z-10 -mt-8 px-5">
        <SectionCard>
          <p className="text-center text-base italic leading-relaxed text-blue-900">
            "{info.message}"
          </p>
        </SectionCard>
      </section>

      {/* DATA, HORA E LOCAL */}
      <section className="mt-6 space-y-4 px-5">
        <SectionCard delay={0.1} className="flex items-center gap-4">
          <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-blue-900 text-amber-50">
            <Calendar size={24} />
          </span>
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-blue-700">
              {info.dayOfWeek}
            </p>
            <p className="text-lg font-bold text-blue-950">
              {info.formattedDate}
            </p>
          </div>
        </SectionCard>

        <SectionCard delay={0.2} className="flex items-center gap-4">
          <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-red-600 text-amber-50">
            <Clock size={24} />
          </span>
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-blue-700">
              Horário
            </p>
            <p className="text-lg font-bold text-blue-950">{info.time}</p>
          </div>
        </SectionCard>

        <SectionCard delay={0.3} className="flex items-start gap-4">
          <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-amber-400 text-blue-950">
            <MapPin size={24} />
          </span>
          <div className="flex-1">
            <p className="text-xs font-semibold uppercase tracking-wide text-blue-700">
              Local
            </p>
            <p className="text-lg font-bold text-blue-950">
              {info.locationName}
            </p>
            <p className="mt-1 text-sm text-blue-800/80">{info.address}</p>
            <a
              href={info.googleMapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-2 inline-flex items-center gap-1 text-sm font-semibold text-red-600 underline underline-offset-2"
            >
              <Navigation size={14} />
              Ver no mapa
            </a>
          </div>
        </SectionCard>
      </section>

      {/* LISTA DE PRESENTES */}
      <section className="mt-6 px-5">
        <SectionCard delay={0.1}>
          <button
            onClick={() => setGiftsOpen((prev) => !prev)}
            className="flex w-full items-center justify-between gap-3"
          >
            <span className="flex items-center gap-3 text-lg font-bold text-blue-950">
              <Gift size={22} className="text-red-600" />
              Lista de presentes
            </span>
            <motion.span
              animate={{ rotate: giftsOpen ? 180 : 0 }}
              className="text-blue-700"
            >
              ▾
            </motion.span>
          </button>

          <AnimatePresence>
            {giftsOpen && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="overflow-hidden"
              >
                <ul className="mt-4 space-y-2">
                  {info.suggestedGifts.map((gift, i) => (
                    <li
                      key={i}
                      className="flex items-center gap-2 text-sm text-blue-900"
                    >
                      <span className="text-amber-500">🍎</span>
                      {gift}
                    </li>
                  ))}
                </ul>

                {info.giftListUrl && (
                  <a
                    href={info.giftListUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-4 flex items-center justify-center gap-2 rounded-xl bg-blue-900 px-4 py-3 text-sm font-bold text-amber-50"
                  >
                    Ver lista completa
                    <ExternalLink size={14} />
                  </a>
                )}

                {info.pixKey && (
                  <button
                    onClick={copyPixKey}
                    className="mt-2 w-full rounded-xl border-2 border-amber-400 px-4 py-3 text-sm font-bold text-blue-900"
                  >
                    Copiar chave Pix
                  </button>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </SectionCard>
      </section>

      {/* CONFIRMAÇÃO DE PRESENÇA */}
      <section className="mt-6 px-5">
        <SectionCard delay={0.1} className="bg-blue-900 text-amber-50">
          <h3 className="flex items-center justify-center gap-2 text-center text-lg font-bold">
            <Sparkles size={18} className="text-amber-400" />
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
                <CheckCircle2 size={40} className="text-amber-400" />
                <p className="font-semibold">
                  Presença confirmada, {guestName}! Até o baile encantado 🏰
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
                  className="w-full rounded-xl border border-amber-200/30 bg-amber-50/10 px-4 py-3 text-amber-50 placeholder-amber-200/60 outline-none focus:border-amber-400"
                />
                <motion.button
                  whileTap={{ scale: 0.96 }}
                  type="submit"
                  className="w-full rounded-xl bg-red-600 px-4 py-3 font-bold text-amber-50 shadow-md shadow-red-900/30 transition-colors hover:bg-red-700"
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
          className="flex items-center gap-2 rounded-full border-2 border-blue-900 bg-amber-50 px-5 py-3 font-semibold text-blue-900 shadow-sm"
        >
          <Share2 size={18} />
          Compartilhar
        </motion.button>
      </section>

      <footer className="pb-8 text-center text-xs text-blue-800/60">
        Feito com 💙 no ConviteJá
      </footer>
    </div>
  );
}
