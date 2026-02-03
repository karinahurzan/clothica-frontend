import Image from "next/image";
import ContainerLayout from "@/components/layout/ContainerLayout";

export default function Characteristics() {
  const characteristics = [
    {
      icon: "/images/characteristics/Heading-0-x1.png",
      title: "Якість та натуральність",
      description:
        "тільки приємні до тіла тканини, які зберігають форму навіть після десятків прань",
    },
    {
      icon: "/images/characteristics/Heading-1-x1.png",
      title: "Універсальний дизайн",
      description:
        "базові кольори та лаконічний стиль, що легко комбінуються між собою.",
    },
    {
      icon: "/images/characteristics/Heading-2-x1.png",
      title: "Комфорт на кожен день",
      description:
        "одяг, який не обмежує рухів і підходить для будь-якої ситуації.",
    },
  ];

  return (
    <ContainerLayout>
      <h2 className="text-4xl mb-10 xl:text-5xl">
        Обери свій унікальний стиль сьогодні
      </h2>

      <ul className="flex flex-col md:flex-row gap-8">
        {characteristics.map((advantage, index) => (
          <li key={index} className="flex flex-col gap-3">
            <Image
              width={56}
              height={56}
              src={advantage.icon}
              alt={advantage.title}
            />
            <h3 className="text-2xl">{advantage.title}</h3>
            <p className="">{advantage.description}</p>
          </li>
        ))}
      </ul>
    </ContainerLayout>
  );
}
