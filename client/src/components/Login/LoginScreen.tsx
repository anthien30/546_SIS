import { useForm } from "react-hook-form";
import { LoginCredentials } from "./model";
import { Form, FormGroup } from "react-bootstrap";
import { useState } from "react";
import axios from "axios";

const API_URL = process.env.REACT_APP_API_URL;

const LoginScreen = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginCredentials>();
  const [errorMessage, setErrorMessage] = useState<string>();

  const handleLogin = async ({ username, password }: LoginCredentials) => {
    try {
      const response = await axios.post(`${API_URL}/login`, {
        username,
        password,
      });

      const data = response.data;
      localStorage.setItem("token", data.token);

      window.location.href = "/";
    } catch (error) {
      if (axios.isAxiosError(error)) {
        setErrorMessage(
          error.response?.data?.message ?? "Something went wrong"
        );
      } else {
        setErrorMessage("Unexpected error");
      }
    }
  };

  return (
    <>
      <Form
        onSubmit={handleSubmit(handleLogin)}
        style={{
          width: "500px",
          borderRadius: "10px",
          border: "1px solid lightgray",
          padding: "2rem",
        }}
      >
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
