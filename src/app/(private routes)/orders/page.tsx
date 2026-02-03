import ContainerLayout from "@/components/layout/ContainerLayout";

export default function Page() {
  return (
    <ContainerLayout>
      <h1 className="text-4xl xl:text-5xl mb-6">Мої замовлення</h1>
      <p className="text-neutral-darkest-60">
        Поки що у вас немає активних замовлень.
      </p>
    </ContainerLayout>
  );
}
