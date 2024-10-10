import { Loader } from "lucide-react";

export default function Loading() {
  return (
    <div className="-mt-24 flex h-screen items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <Loader className="size-6 animate-spin" />
        <p>Carregando home...</p>
      </div>
    </div>
  );
}
