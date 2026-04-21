

const HomePanel = ({ title, children, className = "" }) => {
  return (
    <article className={`home-panel ${className}`.trim()}>
      <header className="home-panel__head">
        <h2 className="home-panel__title">{title}</h2>
      </header>
      <div className="home-panel__body">{children}</div>
    </article>
  );
};

export default HomePanel;
