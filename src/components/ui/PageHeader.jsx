function PageHeader({ badge, title, description, action }) {
  return (
    <div className="flex flex-col xl:flex-row xl:items-center xl:justify-between gap-5 mb-8">
      <div>
        {badge && <p className="text-blue-400 font-bold mb-2">{badge}</p>}

        <h1 className="text-3xl sm:text-4xl font-black text-white">
          {title}
        </h1>

        {description && (
          <p className="text-slate-400 mt-2">
            {description}
          </p>
        )}
      </div>

      {action && action}
    </div>
  );
}

export default PageHeader;