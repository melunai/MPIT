import { useEffect, useMemo, useRef, useState } from "react";
import Modal from "./Modal";

type Props = {
  open: boolean;
  basePrice: number;
  onClose: () => void;
  onConfirm: (price: number) => void;
};

export default function CustomPriceModal({ open, basePrice, onClose, onConfirm }: Props) {
  const [value, setValue] = useState<number>(basePrice);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (open) {
      setValue(basePrice);
      setTimeout(() => inputRef.current?.focus(), 0);
    }
  }, [open, basePrice]);

  const error = useMemo(() => {
    if (Number.isNaN(value) || value <= 0) return "Укажите положительное число.";
    if (value % 5 !== 0) return "Цена должна быть кратна 5 ₽.";
    return "";
  }, [value]);

  const submit = () => {
    if (!error) onConfirm(value);
  };

  return (
    <Modal open={open} onClose={onClose} ariaLabel="Своя цена">
      <div className="p-4">
        <div className="text-lg font-semibold mb-3">Своя цена</div>

        <label className="block text-sm text-neutral-600 mb-1">Введите сумму (₽)</label>
        <input
          ref={inputRef}
          type="number"
          inputMode="numeric"
          step={5}
          min={5}
          className="w-full border rounded-xl px-3 py-2 mb-2"
          value={Number.isNaN(value) ? "" : value}
          onChange={(e) => setValue(e.target.value === "" ? NaN : Number(e.target.value))}
          onKeyDown={(e) => e.key === "Enter" && submit()}
        />

        {error ? (
          <div className="text-xs text-red-600 mb-3">{error}</div>
        ) : (
          <div className="text-xs text-neutral-500 mb-3">
            Будет предложено: <span className="font-semibold">{value} ₽</span>
          </div>
        )}

        <div className="grid grid-cols-2 gap-2">
          <button className="btn-ghost" onClick={onClose}>Отмена</button>
          <button className="btn-drivee disabled:opacity-60" disabled={!!error} onClick={submit}>
            Предложить
          </button>
        </div>
      </div>
    </Modal>
  );
}
