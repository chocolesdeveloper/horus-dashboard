import Image from "next/image";

export function NotAFile({ description }: { description: string }) {
  return (
    <div className="container flex h-[700px] w-full flex-col items-center justify-center overflow-auto border-secondary bg-white p-5 text-center">
      <Image
        src="/no-found.gif"
        alt="gato preto animado"
        width={300}
        height={300}
        className="object-cover"
      />

      <h3 className="text-xl lg:text-3xl">
        Parece que o <span className="font-bold">Mike</span> não achou nada
        aqui...
      </h3>

      <p className="text-sm lg:font-light">{description}</p>
    </div>
  );
}
