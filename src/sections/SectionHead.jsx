export default function SectionHead({ title, children, center = false }) {
  return (
    <div className={`section-head sr${center ? " center" : ""}`}>
      <h2>{title}</h2>
      {children && <p className="section-lede">{children}</p>}
    </div>
  );
}
