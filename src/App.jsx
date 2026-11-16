import './App.css'

function App() {
  return (
    <main className="maintenance-page">
      <div className="maintenance-card">
        <div className="status-badge">CustomPole</div>
        <div className="maintenance-icon" aria-hidden="true">
          <span className="gear gear-one" />
          <span className="gear gear-two" />
          <span className="gear gear-three" />
        </div>

        <p className="eyebrow">Website status</p>
        <h1>Under Maintenance</h1>
        <p className="message">
          We are currently upgrading our platform to serve you better. Please check
          back soon.
        </p>

        <div className="info-row">
          <div>
            <span className="label">Estimated time</span>
            <strong>2–4 hours</strong>
          </div>
          <div>
            <span className="label">Next update</span>
            <strong>We’ll be back soon</strong>
          </div>
        </div>
      </div>
    </main>
  )
}

export default App
