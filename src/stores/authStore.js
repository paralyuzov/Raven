import axios from "../services/api";
import { defineStore } from "pinia";
import { useContactsStore } from "./contactsStore";

export const useAuthStore = defineStore("authStore", {
  state: () => ({
    user: null,
    loading: false,
    error: null,
  }),
  getters: {
    isLoggedIn: (state) => !!state.user,
  },
  actions: {
    async registerUser(userData) {
      this.loading = true;
      this.error = null;
      try {
        await axios.post("/auth/register", userData);
      } catch (error) {
        this.error = error.response?.data?.error || "Registration failed";
        throw this.error;
      } finally {
        this.loading = false;
      }
    },
    async loginUser(credentials) {
      this.loading = true;
      this.error = null;
      try {
        const response = await axios.post("/auth/login", credentials);
        this.user = response.data.user;
        return response.data;
      } catch (error) {
        this.error = error.response?.data?.error || "Login failed";
        throw this.error;
      } finally {
        this.loading = false;
      }
    },
    async logoutUser() {
      this.loading = true;
      try {
        await axios.post("/auth/logout");
        this.user = null;

        const contactStore = useContactsStore();
        contactStore.$reset();

        localStorage.removeItem("auth");

        return { success: true };
      } catch (error) {
        console.error("Logout failed:", error);
        this.user = null;
        return { success: false, error: error.message };
      } finally {
        this.loading = false;
      }
    },

    async uploadAvatar(avatarFile) {
      this.loading = true;
      this.error = null;

      try {
        const formData = new FormData();
        formData.append("avatar", avatarFile);

        const response = await axios.post("/users/upload-avatar", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });

        await this.fetchCurrentUser();

        return response.data;
      } catch (error) {
        this.error = error.response?.data?.error || "Failed to upload avatar";
        throw this.error;
      } finally {
        this.loading = false;
      }
    },
    async fetchCurrentUser() {
      this.loading = true;
      this.error = null;
      try {
        const response = await axios.get("/auth/me");
        this.user = response.data.user;
        return this.user;
      } catch (error) {
        this.error = error.response?.data?.error || "Failed to fetch user data";
        throw this.error;
      } finally {
        this.loading = false;
      }
    },
  },
  persist: {
    key: "auth",
    storage: localStorage,
    paths: ["user"],
  },
});
