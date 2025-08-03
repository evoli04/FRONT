// LoginForm.jsx (sadece değişen kısım)
<div className="login-container">
  <h2 className="login-title">GİRİŞ YAP</h2>

  <form onSubmit={handleSubmit} className="login-form w-100">
    <div className="mb-3">
      <input
        type="email"
        placeholder="E-posta Adresiniz"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
        className="login-input"
      />
    </div>

    <div className="mb-3 position-relative">
      <input
        type={showPassword ? "text" : "password"}
        placeholder="Şifreniz"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
        className="login-input"
        style={{ paddingRight: '40px' }}
      />
      <button
        type="button"
        className="password-toggle-btn"
        onClick={() => setShowPassword(!showPassword)}
        aria-label={showPassword ? "Şifreyi gizle" : "Şifreyi göster"}
      >
        <span className="password-toggle-icon">
          {showPassword ? "🙈" : "🐵"}
        </span>
      </button>
    </div>

    <div className="login-remember mb-3 w-100">
      <input
        type="checkbox"
        id="remember"
        checked={remember}
        onChange={() => setRemember(!remember)}
      />
      <label htmlFor="remember">Bu cihazda oturumumu açık tut</label>
    </div>

    <button type="submit" className="login-btn">
      GİRİŞ YAP
    </button>
  </form>

  <div className="login-links">
    <Link to="/forgot-password" className="login-link">Şifremi Unuttum</Link>
    <span className="login-link-separator">|</span>
    <Link to="/register" className="login-link">Kayıt ol</Link>
  </div>

  <div className="login-divider">
    <span className="login-divider-line"></span>
    <span className="login-divider-text">Veya şununla devam edin:</span>
    <span className="login-divider-line"></span>
  </div>

  <button className="google-btn" type="button" onClick={() => googleLogin()}>
    <span className="google-icon">
      <svg width="20" height="20" viewBox="0 0 48 48"><g><path fill="#4285F4" d="M43.6 20.5h-1.9V20H24v8h11.3c-1.6 4.3-5.7 7-11.3 7-6.6 0-12-5.4-12-12s5.4-12 12-12c2.7 0 5.2.9 7.2 2.4l6.1-6.1C34.5 5.1 29.5 3 24 3 12.4 3 3 12.4 3 24s9.4 21 21 21c10.5 0 20-7.5 20-21 0-1.4-.1-2.7-.4-3.5z" /><path fill="#34A853" d="M6.3 14.7l6.6 4.8C14.5 16.1 18.8 13 24 13c2.7 0 5.2.9 7.2 2.4l6.1-6.1C34.5 5.1 29.5 3 24 3 16.1 3 9.1 7.8 6.3 14.7z" /><path fill="#FBBC05" d="M24 45c5.4 0 10.4-1.8 14.3-4.9l-6.6-5.4C29.5 36.9 26.9 38 24 38c-5.5 0-10.1-3.5-11.7-8.3l-6.5 5C9.1 40.2 16.1 45 24 45z" /><path fill="#EA4335" d="M43.6 20.5h-1.9V20H24v8h11.3c-0.7 2-2.1 3.7-3.9 4.9l6.6 5.4C41.9 39.1 45 32.5 45 24c0-1.4-.1-2.7-.4-3.5z" /></g></svg>
    </span>
    Google ile Giriş Yap
  </button>
</div>