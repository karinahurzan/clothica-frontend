import { cn } from "@/lib/utils";
import { MdPhotoSizeSelectActual } from "react-icons/md";

export default function Placeholder({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "flex items-center justify-center w-full bg-neutral-darkest-10",
        className
      )}
      style={{ aspectRatio: "4/3" }}
    >
      <MdPhotoSizeSelectActual size={60} className="text-neutral-darkest-15" />
    </div>
  );
}
