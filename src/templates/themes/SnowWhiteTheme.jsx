import { createElement, useState, useRef, useEffect } from "react";
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

export default function SnowWhiteTheme({ data }) {
  const info = { ...defaultData, ...data };

  const [isMuted, setIsMuted] = useState(false);
  const [videoEnded, setVideoEnded] = useState(false);
  const [confirmed, setConfirmed] = useState(false);
  const [guestName, setGuestName] = useState("");
  const [activePanel, setActivePanel] = useState("home");
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

  const copyPixKey = async () => {
    await navigator.clipboard.writeText(info.pixKey);
    alert("Chave Pix copiada!");
  };

  return (
    <div className="relative h-dvh w-full max-w-md mx-auto overflow-hidden bg-blue-950 font-sans text-blue-900">
      {/* INTRO EM VÍDEO FULLSCREEN */}
      <section className="absolute inset-0 overflow-hidden bg-blue-950">
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

      </section>

      <AnimatePresence>
        {videoEnded && (
          <motion.main
            id="convite"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="absolute inset-0 z-10 flex flex-col justify-end bg-blue-950/35 px-4 pb-5 pt-16"
          >
            <motion.div
              layout
              className="rounded-3xl border border-amber-100/50 bg-amber-50/70 p-4 shadow-2xl shadow-blue-950/40 backdrop-blur-md"
            >
              <AnimatePresence mode="wait">
                <motion.div
                  key={activePanel}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.2 }}
                >
                  {activePanel === "home" && (
                    <div className="py-2 w-[90%] text-center">
                      <h1 className="text-3xl font-bold leading-tight text-gray-900">
                        {info.childName} está fazendo {info.age} ano{info.age === 1 ? "" : "s"}!
                      </h1>
                      <p className="mt-4 text-base italic leading-relaxed text-blue-900">"{info.message}"</p>
                    </div>
                  )}

                  {activePanel === "date" && (
                    <div className="space-y-3 text-blue-950">
                      <div className="flex items-center gap-3 rounded-2xl bg-white/70 p-3">
                        <Calendar className="text-blue-900" size={22} />
                        <div><p className="text-xs font-bold uppercase text-blue-700">Data</p><p className="font-bold">{info.dayOfWeek}, {info.formattedDate}</p></div>
                      </div>
                      <div className="flex items-center gap-3 rounded-2xl bg-white/70 p-3">
                        <Clock className="text-red-600" size={22} />
                        <div><p className="text-xs font-bold uppercase text-blue-700">Horário</p><p className="font-bold">{info.time}</p></div>
                      </div>
                    </div>
                  )}

                  {activePanel === "location" && (
                    <div className="flex items-start gap-3 rounded-2xl bg-white/70 p-3 text-blue-950">
                      <MapPin className="mt-1 text-amber-600" size={22} />
                      <div><p className="text-xs font-bold uppercase text-blue-700">Endereço</p><p className="font-bold">{info.locationName}</p><p className="text-sm text-blue-800/80">{info.address}</p><a href={info.googleMapsUrl} target="_blank" rel="noopener noreferrer" className="mt-1 inline-flex items-center gap-1 text-sm font-bold text-red-600"><Navigation size={14} /> Ver no mapa</a></div>
                    </div>
                  )}

                  {activePanel === "gifts" && (
                    <div className="text-blue-950">
                      <h3 className="flex items-center gap-2 text-lg font-bold"><Gift size={21} className="text-red-600" /> Dicas de presente</h3>
                      <ul className="mt-3 space-y-2 text-sm">{info.suggestedGifts.map((gift, index) => <li key={index} className="flex gap-2"><span className="text-red-600">♥</span>{gift}</li>)}</ul>
                      {info.giftListUrl && <a href={info.giftListUrl} target="_blank" rel="noopener noreferrer" className="mt-4 flex items-center justify-center gap-2 rounded-xl bg-blue-900 px-4 py-3 text-sm font-bold text-amber-50">Ver lista completa <ExternalLink size={14} /></a>}
                      {info.pixKey && <button onClick={copyPixKey} className="mt-2 w-full rounded-xl border-2 border-amber-400 px-4 py-3 text-sm font-bold text-blue-900">Copiar chave Pix</button>}
                    </div>
                  )}

                  {activePanel === "confirm" && (
                    <div className="rounded-2xl bg-blue-900 p-4 text-amber-50">
                      <h3 className="flex items-center justify-center gap-2 text-center text-lg font-bold"><Sparkles size={18} className="text-amber-400" /> Confirme sua presença</h3>
                      {confirmed ? <div className="mt-4 flex flex-col items-center gap-2 text-center"><CheckCircle2 size={38} className="text-amber-400" /><p className="font-semibold">Presença confirmada, {guestName}!</p></div> : <form onSubmit={handleConfirm} className="mt-4 flex flex-col gap-3"><input type="text" value={guestName} onChange={(event) => setGuestName(event.target.value)} placeholder="Seu nome" required className="w-full rounded-xl border border-amber-200/30 bg-amber-50/10 px-4 py-3 text-amber-50 placeholder-amber-200/60 outline-none focus:border-amber-400" /><button type="submit" className="w-full rounded-xl bg-red-600 px-4 py-3 font-bold text-amber-50">Confirmar presença</button></form>}
                    </div>
                  )}
                </motion.div>
              </AnimatePresence>

              <nav className="mt-4 grid grid-cols-5 gap-2 border-t border-blue-900/10 pt-3" aria-label="Informações do convite">
                {[{ id: "home", label: "Início", icon: Sparkles }, { id: "date", label: "Quando", icon: Calendar }, { id: "location", label: "Onde", icon: MapPin }, { id: "gifts", label: "Presentes", icon: Gift }, { id: "confirm", label: "Confirmar", icon: CheckCircle2 }].map((item, index) => (
                  <button key={`${item.id}-${index}`} onClick={() => setActivePanel(item.id)} className={`flex min-w-0 flex-col items-center gap-1 rounded-xl px-1 py-2 text-[10px] font-bold ${activePanel === item.id ? "bg-white text-blue-900" : "text-blue-800"}`}>
                    {createElement(item.icon, { size: 18 })}
                    <span className="truncate">{item.label}</span>
                  </button>
                ))}
              </nav>
            </motion.div>

          </motion.main>
        )}
      </AnimatePresence>
    </div>
  );
}
