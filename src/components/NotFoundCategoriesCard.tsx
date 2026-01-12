export default function NotFoundCategoriesCard() {
  return (
    <div className="bg-deco-light py-6 px-4 md:px-8 xl:px-22 gap-4 rounded-2xl flex flex-col justify-between items-center">
      <p className="font-semibold text-lg text-center">
        На жаль, на сервері виникла помилка під час завантаження категорій. Будь
        ласка, спробуйте пізніше
      </p>
    </div>
  );
}
