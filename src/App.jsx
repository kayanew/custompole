import './App.css'

function App() {
  return (
    <div className="launch-page" id="home">
      <header className="site-header">
        <a className="brand" href="#home" aria-label="CustomPole home">
          <span className="brand-mark" aria-hidden="true">
            C<span>.</span>
          </span>
          <span>CustomPole</span>
        </a>

        <div className="header-status">
          <span className="status-dot" aria-hidden="true" />
          Website under construction
        </div>
      </header>

      <main className="launch-content">
        <div className="artwork" aria-hidden="true">
          <span className="artwork-label artwork-label-left">A NEW CHAPTER</span>
          <span className="artwork-label artwork-label-right">IN THE WORKS</span>
          <div className="artwork-ring artwork-ring-outer" />
          <div className="artwork-ring artwork-ring-inner" />
          <div className="artwork-core">
            <span className="core-bracket">&lt;</span>
            <span className="core-slash">/</span>
            <span className="core-bracket">&gt;</span>
          </div>
          <span className="artwork-star artwork-star-one">✳</span>
          <span className="artwork-star artwork-star-two">✳</span>
          <span className="artwork-orbit-dot" />
        </div>

        <p className="eyebrow">
          <span />
          Something new is taking shape
        </p>
        <h1>
          A better experience
          <br />
          is <em>on the way.</em>
        </h1>
        <p className="intro">
          We’re rebuilding the CustomPole website with care. Our new home will be
          ready soon—thanks for your patience while we put the finishing touches
          in place.
        </p>

        <div className="progress-card" id="status">
          <div className="progress-icon" aria-hidden="true">
            <span />
            <span />
            <span />
          </div>
          <div className="progress-copy">
            <strong>Work in progress</strong>
            <span>We’re making things better behind the scenes.</span>
          </div>
          <span className="progress-indicator" aria-hidden="true">
            <span />
            <span />
            <span />
          </span>
        </div>
      </main>

      <footer className="site-footer">
        <span>© CustomPole</span>
        <span className="footer-note">Thanks for bearing with us.</span>
      </footer>
    </div>
  )
}

export default App
