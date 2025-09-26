import { useState, useEffect } from "react";
import { Player } from "@lottiefiles/react-lottie-player";
import Animated from "../assets/Animated.json";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import { EyeIcon, EyeOffIcon } from "lucide-react";
import dataImages from "../assets/images";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const { logo } = dataImages;

const LoginPage = () => {
  const [loading, setLoading] = useState(true);
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [phoneError, setPhoneError] = useState("");
  const [touched, setTouched] = useState({ password: false, phone: false });
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("role");

    if (token && role) {
      if (role === "ADMIN") navigate("/admin-dashboard");
      else if (role === "TEACHER") navigate("/teacher-dashboard");
      else if (role === "STUDENT") navigate("/user-dashboard");
      else if (role === "PARENT") navigate("/user-dashboard");
    } else {
      setLoading(false); // login sahifasi ko‘rinsin
    }
  }, [navigate]);

  const validatePassword = (val) => {
    if (!val) return "Password is required";
    if (val.length < 3) return "At least 3 characters";
    return "";
  };

  const validatePhone = (val) => {
    if (!val || val.length < 12) return "Invalid phone number";
    return "";
  };

  const handleContinue = async () => {
    try {
      const res = await axios.post(
        `https://nazorat.sferaacademy.uz/api/auth/login?phone=${phone}&password=${password}`
      );

      if (res.data.success) {
        setSuccessMessage("✅ Login muvaffaqiyatli!");
        localStorage.setItem("token", res.data.data);
        localStorage.setItem("role", res.data.message);

        const role = res.data.message;

        setTimeout(() => {
          // biroz kutib, keyin yo‘naltirish
          if (role === "ADMIN") navigate("/admin-dashboard");
          else if (role === "TEACHER") navigate("/teacher-dashboard");
          else if (role === "STUDENT") navigate("/user-dashboard");
          else if (role === "PARENT") navigate("/user-dashboard");
        }, 500); // 0.5s kutish
      } else {
        setErrorMessage("Telefon nomer yoki password noto‘g‘ri.");
      }
    } catch (err) {
      console.error(err);
      setErrorMessage("❌ Serverga ulanishda xatolik.");
    }
  };

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center bg-[#F3F4F6]">
        <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-[#208a00]"></div>
      </div>
    );
  }

  return (
    <div className="bg-[#F3F4F6] min-h-screen flex items-center w-full">
      <div className="bg-[#fff] lg:w-auto w-full min-h-screen mx-auto lg:px-32 px-0 py-10 rounded-xl flex items-center justify-center">
        <div className="relative md:py-4 py-0 flex md:flex-row items-center justify-between gap-10">
          {/* Animation */}
          <div className="hidden lg:flex justify-center items-center">
            <Player
              autoplay
              loop
              src={Animated}
              style={{
                width: window.innerWidth >= 1280 ? "550px" : "400px", // xl: 1280px dan katta
                height: window.innerWidth >= 1280 ? "550px" : "400px",
              }}
            />
          </div>

          <div className="lg:border-l-2 justify-center 2xl:w-[800px] h-[450px]">
            <div className="w-full p-1 rounded-xl h-full">
              <div className="bg-white rounded-xl lg:p-10 p-5 w-full h-full flex flex-col justify-center">
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    handleContinue();
                  }}
                >
                  <div className="w-full flex justify-center">
                    <img src={logo} alt="Logo" className="w-[500px]" />
                  </div>
                  <h2 className="text-3xl font-semibold text-center my-4">
                    Login
                  </h2>

                  {/* Phone input */}
                  <label>Phone Number</label>
                  <PhoneInput
                    country={"uz"}
                    value={phone}
                    onChange={(val) => {
                      setPhone(val);
                      setPhoneError(validatePhone(val));
                      setTouched((prev) => ({ ...prev, phone: true }));
                    }}
                    placeholder="+998 99-999-99-99"
                    inputProps={{
                      name: "phone",
                      required: true,
                      className: `border-2 outline-none w-full px-5 py-3.5 my-2 rounded-lg ${
                        phoneError && touched.phone
                          ? "border-[#F97316]"
                          : "border-[#D1D5DB] focus:ring-[#208a00]"
                      }`,
                    }}
                  />
                  {phoneError && touched.phone && (
                    <p className="text-[#F97316] text-sm">{phoneError}</p>
                  )}

                  {/* Password */}
                  <label className="mt-4">Your Password</label>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      placeholder="Password"
                      value={password}
                      onChange={(e) => {
                        const val = e.target.value;
                        setPassword(val);
                        setPasswordError(validatePassword(val));
                        setTouched((prev) => ({ ...prev, password: true }));
                      }}
                      className={`border-2 outline-none px-5 py-3.5 my-2 rounded-lg w-full ${
                        passwordError && touched.password
                          ? "border-[#F97316]"
                          : "border-[#D1D5DB] focus:ring-[#208a00]"
                      }`}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500"
                    >
                      {showPassword ? (
                        <EyeOffIcon className="w-5 h-5" />
                      ) : (
                        <EyeIcon className="w-5 h-5" />
                      )}
                    </button>
                  </div>
                  {passwordError && touched.password && (
                    <p className="text-[#F97316] text-sm mb-1">
                      {passwordError}
                    </p>
                  )}

                  {/* API response messages */}
                  {errorMessage && (
                    <p className="text-red-500 text-center mt-2">
                      {errorMessage}
                    </p>
                  )}
                  {successMessage && (
                    <p className="text-green-600 text-center mt-2">
                      {successMessage}
                    </p>
                  )}

                  {/* Button */}
                  <button
                    type="submit"
                    className="w-full mt-5 text-white py-2.5 rounded-lg font-semibold transition cursor-pointer bg-gradient-to-r btn-gradient"
                  >
                    Continue
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
