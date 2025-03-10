import { useForm } from "react-hook-form";
import { LoginCredentials } from "./model";
import { Form, FormGroup } from "react-bootstrap";
import { useState } from "react";
import axios from "axios";
import { CircularProgress } from "@mui/material";
import styles from "./LoginScreen.module.scss";

const API_URL = process.env.REACT_APP_API_URL;

const LoginScreen = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginCredentials>();
  const [errorMessage, setErrorMessage] = useState<string>();
  const [loading, setLoading] = useState(false);

  const loginUser = async (credentials: LoginCredentials) => {
    try {
      setLoading(true);
      const { data } = await axios.post(`${API_URL}/api/login`, credentials);
      localStorage.setItem("token", data.token);
      window.location.href = "/";
    } catch (error) {
      if (axios.isAxiosError(error))
        setErrorMessage(
          error.response?.data?.message ?? "Something went wrong"
        );
      else setErrorMessage("Unexpected error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Form onSubmit={handleSubmit(loginUser)} className={styles.loginForm}>
        {loading && (
          <div className={styles.loginLoaderWrapper}>
            <CircularProgress />
          </div>
        )}

        <FormGroup className="mb-4">
          <Form.Label className="fw-bold">Username</Form.Label>
          <Form.Control
            type="text"
            {...register("username", {
              required: "This field is required",
            })}
            placeholder="Enter username"
          />
          <Form.Text className="text-danger">
            {errors.username?.message}
          </Form.Text>
        </FormGroup>

        <FormGroup className="mb-4">
          <Form.Label className="fw-bold">Password</Form.Label>
          <Form.Control
            type="password"
            {...register("password", {
              required: "This field is required",
            })}
            placeholder="Enter password"
          />
          <Form.Text className="text-danger">
            {errors.password?.message}
          </Form.Text>
        </FormGroup>

        <div className="d-flex justify-content-center">
          <button className="btn btn-primary mt-1" style={{ width: "120px" }}>
            Log in
          </button>
        </div>
      </Form>
    </>
  );
};

export default LoginScreen;
