// src/components/LoginForm.js
import React, { useState } from "react";
import { login } from "../services/authService"; // Giả sử bạn đã lưu API ở đây
import { useNavigate } from "react-router-dom"; // Import useNavigate
import { useLocation } from "react-router-dom"; // Import useLocation

const LoginForm = ({ onSwitchToRegister }) => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const location = useLocation();
    const message = location.state?.message; // Lấy thông báo từ state

    
    const navigate = useNavigate(); // Khởi tạo useNavigate

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const { accessToken, userId } = await login(username, password); // Gọi API và nhận giá trị trả về
            localStorage.setItem('token', accessToken); // Lưu token vào Local Storage
            localStorage.setItem('userId', userId); // Lưu userId vào Local Storage
            navigate("/"); // Thay đổi đường dẫn nếu cần
        } catch (err) {
            setError("Đăng nhập không thành công. Vui lòng thử lại.");
        }
    };

    return (
        <div style={styles.container}>
            <h2 style={styles.title}>Đăng Nhập</h2>
            {message && <p style={styles.successMessage}>{message}</p>} {/* Hiển thị thông báo nếu có */}
            <form onSubmit={handleSubmit} style={styles.form}>
                <div style={styles.inputGroup}>
                    <label style={styles.label}>Tên đăng nhập</label>
                    <input
                        type="text"
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
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        style={styles.input}
                    />
                </div>
                {error && <p style={styles.error}>{error}</p>}
                <button type="submit" style={styles.button}>Đăng nhập</button>
            </form>
            <p style={styles.text}>
                Bạn chưa có tài khoản?{" "}
                <button onClick={onSwitchToRegister} style={styles.switchButton}>
                    Đăng ký
                </button>
            </p>
        </div>
    );
};

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

export default LoginForm;
