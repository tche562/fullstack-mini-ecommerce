type SizeOption = {
  id: number;
  label?: string;
  long?: string;
};

type Props = {
  options: SizeOption[];
  selectedId: number | null;
  onSelect: (id: number) => void;
};

export default function SizeSelector({ options, selectedId, onSelect }: Props) {
  return (
    <div className="sizesRow" aria-label="Size options">
      {options.map((opt) => {
        const label = opt.label ?? opt.long ?? "";
        const isSelected = selectedId === opt.id;

        return (
          <button
            key={opt.id}
            type="button"
            className={`sizePill ${isSelected ? "sizePillSelected" : ""}`}
            aria-pressed={isSelected}
            onClick={() => {
              // Strategy: clicking the already-selected size keeps it selected (no toggle off)
              onSelect(opt.id);
            }}
          >
            {label}
          </button>
        );
      })}
    </div>
  );
}
