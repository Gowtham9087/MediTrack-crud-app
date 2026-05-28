function Button({
  children,
  onClick,
  type = "button",
  className = "",
  icon: Icon,
}) {
  return (
    <button
      type={type}
      onClick={onClick}
      className={`flex items-center justify-center gap-2 px-5 py-3 rounded-2xl font-semibold transition-all duration-300 hover:scale-[1.02] active:scale-95 ${className}`}
    >
      {Icon && <Icon size={18} />}
      {children}
    </button>
  );
}

export default Button;