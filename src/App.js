import React, { useState, useRef, useEffect } from "react";

function Cammi() {
  const [camActive, setCamActive] = useState(false);
  const [mensajes, setMensajes] = useState([]);
  const [currentText, setCurrentText] = useState("");
  const videoRef = useRef(null);

  const listaMensajes = [
    "ALERTA: Cámara activada...",
    "Procesando datos del usuario...",
    "Porfavor, sonría",
    "Registro completado. Monitorizando...",
    "Gracias ¡Que tenga un buen día!",
  ];

  useEffect(() => {
    let timeouts = [];

    const escribirMensajes = async () => {
      for (let msg of listaMensajes) {
        for (let i = 0; i < msg.length; i++) {
          await new Promise((res) => {
            const t = setTimeout(() => {
              setCurrentText((prev) => prev + msg[i]);
              res();
            }, 50);
            timeouts.push(t);
          });
        }
        setMensajes((prev) => [...prev, msg]);
        setCurrentText("");
        await new Promise((res) => {
          const t = setTimeout(res, 500); // espera antes del siguiente mensaje
          timeouts.push(t);
        });
      }
    };

    const activarCamara = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: true,
        });
        if (videoRef.current) videoRef.current.srcObject = stream;
        setCamActive(true);
        escribirMensajes();
      } catch (error) {
        console.error("Error al acceder a la cámara:", error);
        setMensajes((prev) => [...prev, "ERROR: No se pudo activar la cámara"]);
      }
    };

    const timer = setTimeout(activarCamara, 1000);
    timeouts.push(timer);

    return () => timeouts.forEach((t) => clearTimeout(t)); // Limpieza de todos los timers
  }, []);

  return (
    <div
      style={{
        backgroundColor: "#0b0b0b",
        color: "#33ff33",
        fontFamily: "'Courier New', Courier, monospace",
        minHeight: "100vh",
        padding: "30px",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      <h1
        style={{
          fontSize: "32px",
          color: "#ff4444",
          textShadow: "1px 1px 3px #000",
          marginBottom: "30px",
        }}
      >
        SISTEMA DE MONITOREO
      </h1>

      {camActive && (
        <>
          <video
            ref={videoRef}
            autoPlay
            style={{
              width: "500px",
              height: "375px",
              border: "4px solid #33ff33",
              borderRadius: "6px",
              filter: "contrast(1.2) brightness(0.8)",
              boxShadow: "0 0 20px #33ff33",
              backgroundColor: "#000",
            }}
          />

          <div
            style={{
              marginTop: "30px",
              width: "520px",
              backgroundColor: "rgba(0,0,0,0.85)",
              padding: "20px",
              border: "2px dashed #33ff33",
              borderRadius: "6px",
              boxShadow: "0 0 15px #222",
              minHeight: "150px",
              overflow: "hidden",
            }}
          >
            {mensajes.map((msg, index) => (
              <p key={index} style={{ margin: "8px 0" }}>
                {msg}
              </p>
            ))}
            <p>
              {currentText}
              <span style={{ animation: "blink 1s infinite" }}>|</span>
            </p>
          </div>
        </>
      )}

      <style>
        {`
          @keyframes blink {
            0%, 50%, 100% { opacity: 1; }
            25%, 75% { opacity: 0; }
          }
        `}
      </style>
    </div>
  );
}

export default Cammi;
