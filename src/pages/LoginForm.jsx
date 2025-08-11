import { useGoogleLogin } from '@react-oauth/google';
import { useContext, useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import '../components/css/LoginForm.css';
import { AuthContext } from '../context/AuthContext';
import { googleAuth, login as loginService, testGoogleOAuth } from '../services/auth';

const LoginForm = () => {
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [remember, setRemember] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // Google OAuth test fonksiyonu
  useEffect(() => {
    const testGoogleAuth = async () => {
      try {
        await testGoogleOAuth();
        console.log('✅ Google OAuth backend test successful');
      } catch (error) {
        console.error('❌ Google OAuth backend test failed:', error);
        toast.error('Google OAuth backend bağlantısında sorun var!');
      }
    };

    testGoogleAuth();
  }, []);

  const googleLogin = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      try {
        // console.log'ları güvenlik nedeniyle kaldırdım.
        const data = await googleAuth(tokenResponse.access_token);
        if (data && data.token) {
          let userEmail = data.email;

          if (!userEmail) {
            try {
              const googleUserInfo = await fetch('https://www.googleapis.com/oauth2/v2/userinfo', {
                headers: {
                  'Authorization': `Bearer ${tokenResponse.access_token}`
                }
              });
              const userInfo = await googleUserInfo.json();
              userEmail = userInfo.email;
            } catch (error) {
              console.error('❌ Google API\'den email alınamadı:', error);
              userEmail = 'unknown@google.com'; // Fallback email
            }
          }

          const user = {
            email: userEmail,
            roleId: data.roleId || 2,
            role: data.roleId === 1 ? "admin" : "user",
            memberId: data.memberId
          };

          login(user, data.token);

          if (data.isNewUser) {
            toast.success('Google hesabınızla başarıyla kayıt oldunuz!');
          } else {
            toast.success('Google ile giriş başarılı!');
          }

          setTimeout(() => {
            if (data.roleId === 1) {
              navigate('/admin');
            } else {
              navigate('/workspace');
            }
          }, 1000);
        } else {
          console.error('❌ No token in response:', data);
          toast.error(data.message || 'Google ile giriş başarısız!');
        }
      } catch (error) {
        console.error('❌ Google login error:', error);
        let errorMessage = 'Google ile giriş sırasında hata oluştu!';

        if (error.message.includes('endpoint bulunamadı')) {
          errorMessage = 'Google OAuth endpoint bulunamadı. Backend kontrol edin.';
        } else if (error.message.includes('sunucu hatası')) {
          errorMessage = 'Backend sunucu hatası. Google OAuth konfigürasyonunu kontrol edin.';
        } else if (error.message.includes('Geçersiz token')) {
          errorMessage = 'Geçersiz Google token. Tekrar deneyin.';
        } else if (error.response?.data?.message) {
          errorMessage = error.response.data.message;
        } else if (error.message) {
          errorMessage = error.message;
        }

        toast.error(errorMessage);
      }
    },
    onError: (error) => {
      console.error('❌ Google OAuth error:', error);
      toast.error('Google ile giriş başarısız! Lütfen tekrar deneyin.');
    }
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Şifre, loginService fonksiyonunda backend'e gönderilir ve orada hash'lenir.
      const data = await loginService(email, password);
      if (data && data.token) {
        const user = {
          email,
          roleId: data.roleId,
          role: data.roleId === 1 ? "admin" : "user",
          memberId: data.memberId
        };
        login(user, data.token);
        toast.success('Hoş geldiniz!');
        setTimeout(() => {
          if (data.roleId === 1) {
            navigate('/admin');
          } else {
            navigate('/workspace');
          }
        }, 1000);
      } else {
        toast.error('Giriş başarısız!');
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Giriş başarısız!');
    }
  };

  return (
    <div className="login-bg">
      <div className="container">
        <div className="row justify-content-center align-items-center" style={{ minHeight: "100vh" }}>
          <div className="col-12 col-sm-10 col-md-8 col-lg-6 col-xl-4">
            <ToastContainer
              position="top-right"
              autoClose={2000}
              hideProgressBar={false}
              newestOnTop
              closeOnClick
              rtl={false}
              pauseOnFocusLoss
              draggable
              pauseOnHover
            />

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
                  />
                  <button
                    type="button"
                    className="password-toggle-btn"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <span className="password-toggle-icon">🙈</span> // Kapalı göz
                    ) : (
                      <span className="password-toggle-icon">🐵</span> // Açık göz
                    )}
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

              <div className="login-or">Veya şununla devam edin:</div>

              <button className="google-btn" type="button" onClick={() => googleLogin()}>
                <span className="google-icon">
                  <svg width="20" height="20" viewBox="0 0 48 48"><g><path fill="#4285F4" d="M43.6 20.5h-1.9V20H24v8h11.3c-1.6 4.3-5.7 7-11.3 7-6.6 0-12-5.4-12-12s5.4-12 12-12c2.7 0 5.2.9 7.2 2.4l6.1-6.1C34.5 5.1 29.5 3 24 3 12.4 3 3 12.4 3 24s9.4 21 21 21c10.5 0 20-7.5 20-21 0-1.4-.1-2.7-.4-3.5z" /><path fill="#34A853" d="M6.3 14.7l6.6 4.8C14.5 16.1 18.8 13 24 13c2.7 0 5.2.9 7.2 2.4l6.1-6.1C34.5 5.1 29.5 3 24 3 16.1 3 9.1 7.8 6.3 14.7z" /><path fill="#FBBC05" d="M24 45c5.4 0 10.4-1.8 14.3-4.9l-6.6-5.4C29.5 36.9 26.9 38 24 38c-5.5 0-10.1-3.5-11.7-8.3l-6.5 5C9.1 40.2 16.1 45 24 45z" /><path fill="#EA4335" d="M43.6 20.5h-1.9V20H24v8h11.3c-0.7 2-2.1 3.7-3.9 4.9l6.6 5.4C41.9 39.1 45 32.5 45 24c0-1.4-.1-2.7-.4-3.5z" /></g></svg>
                </span>
                Google
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;
