function SectionHeader({ title, subtitle, id, action }) {
  const layoutClasses = action
    ? 'd-flex justify-content-between align-items-end flex-wrap'
    : '';

  return (
    <header className={`section-header ${layoutClasses}`.trim()}>
      <div>
        <h2 id={id}>{title}</h2>
        {subtitle && <p>{subtitle}</p>}
      </div>
      {action}
    </header>
  );
}

export default SectionHeader;
