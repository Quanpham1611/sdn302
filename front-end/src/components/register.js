// src/components/RegisterForm.js
import React, { useState } from "react";
import { register } from "../services/authService"; // Giả sử bạn đã lưu API ở đây
import { useNavigate } from "react-router-dom"; // Import useNavigate

const RegisterForm = ({ onSwitchToLogin }) => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [error, setError] = useState("");

    const navigate = useNavigate(); // Khởi tạo useNavigate

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (password !== confirmPassword) {
            setError("Mật khẩu không khớp. Vui lòng kiểm tra lại.");
            return;
        }

        try {
            await register(username, password);
            setError("");

            // Thêm thông báo thành công vào trạng thái điều hướng
            setTimeout(() => {
                navigate("/login", { state: { message: "Tạo tài khoản thành công! Bạn có thể đăng nhập." } });
            }, 1000);
        } catch (err) {
            console.error("Lỗi khi đăng ký:", err.response ? err.response.data : err.message); // Log lỗi nếu có
            setError("Đăng ký không thành công. Vui lòng thử lại.");
        }
    };

    return (
        <div style={styles.container}>
            <h2 style={styles.title}>Đăng Ký</h2>
            <form onSubmit={handleSubmit} style={styles.form}>
                <div style={styles.inputGroup}>
                    <label style={styles.label}>Tên đăng nhập</label>
                    <input
                        type="text"
                        name="username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                        style={styles.input}
                    />
                </div>
                <div style={styles.inputGroup}>
                    <label style={styles.label}>Mật khẩu</label>
                    <input
                        type="password"
                        name="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        style={styles.input}
                    />
                </div>
                <div style={styles.inputGroup}>
                    <label style={styles.label}>Nhập lại mật khẩu</label>
                    <input
                        type="password"
                        name="confirmPassword"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        required
                        style={styles.input}
                    />
                </div>
                {error && <p style={styles.error}>{error}</p>}
                <button type="submit" style={styles.button}>Đăng ký</button>
            </form>
            <p style={styles.text}>
                Bạn đã có tài khoản?{" "}
                <button onClick={onSwitchToLogin} style={styles.switchButton}>
                    Đăng nhập
                </button>
            </p>
        </div>
    );
};

// Định nghĩa styles
const styles = {
    container: {
        width: '300px',
        margin: '50px auto',
        padding: '20px',
        border: '1px solid #ccc',
        borderRadius: '8px',
        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
        textAlign: 'left',
        backgroundColor: '#f9f9f9'
    },
    title: {
        textAlign: 'center',
        color: '#333',
    },
    form: {
        display: 'flex',
        flexDirection: 'column',
    },
    inputGroup: {
        marginBottom: '15px',
    },
    label: {
        marginBottom: '5px',
        fontWeight: 'bold',
    },
    input: {
        padding: '10px',
        border: '1px solid #ccc',
        borderRadius: '4px',
        width: '100%',
        boxSizing: 'border-box',
    },
    button: {
        padding: '10px',
        border: 'none',
        borderRadius: '4px',
        backgroundColor: '#28a745',
        color: 'white',
        cursor: 'pointer',
        transition: 'background-color 0.3s ease',
    },
    error: {
        color: 'red',
        margin: '10px 0',
    },
    text: {
        textAlign: 'center',
        marginTop: '10px',
    },
    switchButton: {
        color: 'blue',
        textDecoration: 'underline',
        background: 'none',
        border: 'none',
        cursor: 'pointer',
    },
};

export default RegisterForm;
