import { useState, useEffect } from "react";
import { Player } from "@lottiefiles/react-lottie-player";
import Animated from "../assets/Animated.json";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import { EyeIcon, EyeOffIcon } from "lucide-react";
import dataImages from "../assets/images";
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
  const [showPassword, setShowPassword] = useState(false); // 👈 qo‘shildi

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 2000);
    return () => clearTimeout(timer);
  }, []);

  const validatePassword = (val) => {
    if (!val) return "Password is required";
    if (val.length < 3) return "At least 3 characters";
    return "";
  };

  const validatePhone = (val) => {
    if (!val || val.length < 9) return "Invalid phone number";
    return "";
  };

  const handleContinue = async () => {
    const phoneErr = validatePhone(phone);
    const passwordErr = validatePassword(password);
    setPhoneError(phoneErr);
    setPasswordError(passwordErr);
    setTouched({ password: true, phone: true });

    if (phoneErr || passwordErr) return;

    try {
      const response = await fetch("http://167.86.121.42:8080/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone, password }),
      });

      const result = await response.json();

      if (result.success) {
        setSuccessMessage("Login successful ✅");
        setErrorMessage("");
        localStorage.setItem("token", result.data);
        localStorage.setItem("role", result.role);
      } else {
        setErrorMessage(result.message || "Login failed ❌");
        setSuccessMessage("");
      }
    } catch (error) {
      setErrorMessage("Server bilan ulanishda xatolik ❌");
      setSuccessMessage("");
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
      <div className="bg-[#fff] min-h-screen mx-auto px-32 py-10 rounded-xl flex items-center justify-center">
        <div className="relative py-4 flex md:flex-row items-center justify-between gap-10 w-full">
          {/* Animation */}
          <div>
            <Player
              autoplay
              loop
              src={Animated}
              style={{ height: "550px", width: "550px" }}
            />
          </div>

          {/* Login form */}
          <div className="border-l-2 justify-center 2xl:w-[800px] h-[450px]">
            <div className="w-full p-1 rounded-xl h-full">
              <div className="bg-white rounded-xl p-10 w-full h-full flex flex-col justify-center">
                <div className="w-full flex justify-start">
                  <img src={logo} alt="Logo" className="w-[200px] h-[60px]" />
                </div>
                <h2 className="text-3xl font-semibold text-center my-4">
                  Login
                </h2>
                <label>Phone Number</label>
                <PhoneInput
                  value={phone}
                  onChange={(val) => {
                    setPhone(val);
                    setPhoneError(validatePhone(val));
                    setTouched((prev) => ({ ...prev, phone: true }));
                  }}
                  onFocus={() => {
                    if (!phone) {
                      setPhone("+998");
                    }
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
                <label className="mt-10">Your Password</label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"} // 👈 toggle type
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
                  {/* Eye icon */}
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
                  <p className="text-[#F97316] text-sm mb-1">{passwordError}</p>
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
                  onClick={handleContinue}
                  className="w-full mt-5 text-white py-2.5 rounded-lg font-semibold transition cursor-pointer
                  bg-gradient-to-r btn-gradient"
                >
                  Continue
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
