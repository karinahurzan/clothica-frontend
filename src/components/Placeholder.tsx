import { MdPhotoSizeSelectActual } from "react-icons/md";

export default function Placeholder() {
  return (
    <div
      className="flex items-center justify-center w-full bg-neutral-darkest-10"
      style={{ aspectRatio: "4/3" }}
    >
      <MdPhotoSizeSelectActual size={60} className="text-neutral-darkest-15" />
    </div>
  );
}
