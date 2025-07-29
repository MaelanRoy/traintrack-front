import { useRef } from "react";

export interface CounterProps {
  value: number | string;
  onDecrease: () => void;
  onIncrease: () => void;
  className?: string;
  unit?: string;
}

const Counter = ({
  value,
  onDecrease,
  onIncrease,
  className = "text-2xl font-semibold min-w-[3rem] text-center",
  unit,
}: CounterProps) => {
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const accelerationRef = useRef<number>(0);

  // Fonction générique pour maintenir l'appui avec accélération
  const handleLongPress = (action: () => void, onMouseDown: boolean = true) => {
    if (onMouseDown) {
      // Exécuter immédiatement une fois
      action();
      accelerationRef.current = 0;

      // Commencer l'incrémentation après 500ms
      timeoutRef.current = setTimeout(() => {
        const accelerate = () => {
          action();
          accelerationRef.current += 1;

          // Calculer l'intervalle selon l'accélération (plus c'est appuyé, plus c'est rapide)
          let interval = 200; // Démarrage à 200ms
          if (accelerationRef.current > 10)
            interval = 50; // Après 10 cycles: 50ms (très rapide)
          else if (accelerationRef.current > 5)
            interval = 100; // Après 5 cycles: 100ms (rapide)
          else if (accelerationRef.current > 2) interval = 150; // Après 2 cycles: 150ms (moyen)

          // Relancer avec le nouvel intervalle
          if (intervalRef.current) {
            clearInterval(intervalRef.current);
          }
          intervalRef.current = setInterval(accelerate, interval);
        };

        accelerate(); // Démarrer l'accélération
      }, 500);
    } else {
      // Arrêter l'incrémentation et reset l'accélération
      accelerationRef.current = 0;
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    }
  };

  return (
    <div className="flex items-center gap-3">
      <button
        onMouseDown={() => handleLongPress(onDecrease)}
        onMouseUp={() => handleLongPress(() => {}, false)}
        onMouseLeave={() => handleLongPress(() => {}, false)}
        className="w-10 h-10 rounded-2xl bg-primary hover:bg-primary-hover transition-colors duration-200 flex items-center justify-center text-xl font-bold cursor-pointer select-none"
      >
        -
      </button>

      <span className={className}>{value}</span>

      {unit && <span className="text-2xl font-semibold">{unit}</span>}

      <button
        onMouseDown={() => handleLongPress(onIncrease)}
        onMouseUp={() => handleLongPress(() => {}, false)}
        onMouseLeave={() => handleLongPress(() => {}, false)}
        className="w-10 h-10 rounded-2xl bg-primary hover:bg-primary-hover transition-colors duration-200 flex items-center justify-center text-xl font-bold cursor-pointer select-none"
      >
        +
      </button>
    </div>
  );
};

export default Counter;
