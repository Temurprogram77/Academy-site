import { useState, useEffect } from "react";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const LoginPage = () => {
  const [loading, setLoading] = useState(true);
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [phoneError, setPhoneError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [touched, setTouched] = useState({ phone: false, password: false });
  const [errorMessage, setErrorMessage] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 2000);
    return () => clearTimeout(timer);
  }, []);

  const validatePhone = (value) => {
    if (!value || value.length < 12) {
      return "Telefon raqam to‘liq kiritilishi kerak";
    }
    return "";
  };

  const validatePassword = (value) => {
    if (!value || value.length < 4) {
      return "Parol 4 ta belgidan kam bo‘lmasligi kerak";
    }
    return "";
  };

  const handleContinue = async () => {
    try {
      const res = await axios.post(
        `http://167.86.121.42:8080/auth/login?phone=${phone}&password=${password}`
      );

      console.log(res.data); // bu yerda backendning to‘liq javobini ko‘rish mumkin

      if (res.data.success) {
        const role = res.data.message;
        if (role === "ADMIN") navigate("/admin-dashboard");
        else if (role === "TEACHER") navigate("/teacher-dashboard");
        else if (role === "USER") navigate("/user-dashboard");
        else if (role === "PARENTS") navigate("/parents-dashboard");
        else setErrorMessage("⚠️ Noma'lum rol qaytdi.");
      } else {
        setErrorMessage("❌ Login ma'lumotlari noto‘g‘ri.");
      }
    } catch (err) {
      console.error(err);
      setErrorMessage("❌ Serverga ulanishda xatolik.");
    }
  };

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-[#208a00]"></div>
      </div>
    );
  }

  return (
    <div className="bg-[#F3F4F6]">
      <div className="select-none h-screen flex items-center justify-center sm:mx-auto mx-4">
        <div className="bg-[#fff] w-full max-w-sm p-1 rounded-xl">
          <div className="bg-transparent rounded-xl p-6 w-full flex flex-col">
            <h2 className="text-2xl font-semibold text-center mb-4">Login</h2>

            {errorMessage && (
              <p className="text-red-600 text-center mb-3">{errorMessage}</p>
            )}

            {/* Phone */}
            <PhoneInput
              value={phone}
              onChange={(val) => {
                setPhone(val);
                setPhoneError(validatePhone(val));
                setTouched((prev) => ({ ...prev, phone: true }));
              }}
              onFocus={() => {
                if (!phone) setPhone("+998");
              }}
              placeholder="+998 99-999-99-99"
              inputProps={{
                name: "phone",
                required: true,
                className: `border-1 outline-none w-full px-4 py-3 my-2 rounded-lg ${
                  phoneError && touched.phone
                    ? "border-red-600"
                    : "border-[#D1D5DB] focus:ring-[#208a00]"
                }`,
              }}
            />
            {phoneError && touched.phone && (
              <p className="text-red-600 text-[12px]">{phoneError}</p>
            )}

            {/* Password */}
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => {
                const val = e.target.value;
                setPassword(val);
                setPasswordError(validatePassword(val));
                setTouched((prev) => ({ ...prev, password: true }));
              }}
              className={`border-1 outline-none px-4 py-3 my-2 rounded-lg ${
                passwordError && touched.password
                  ? "border-red-600"
                  : "border-[#D1D5DB]"
              }`}
            />
            {passwordError && touched.password && (
              <p className="text-red-600 text-[12px] mb-1">{passwordError}</p>
            )}

            {/* Button */}
            <button
              onClick={handleContinue}
              className="w-full mt-5 bg-[#208a00] hover:bg-green-700 text-white py-2 rounded-lg font-semibold transition"
            >
              Continue
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
