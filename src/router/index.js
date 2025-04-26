import { createRouter, createWebHistory } from "vue-router";
import RegistrationPage from "../views/RegistrationPage.vue";
import LoginPage from "../views/LoginPage.vue";
import ChatPage from "../views/ChatPage.vue";

const routes = [
  { path: "/", component: RegistrationPage },
  { path: "/login", component: LoginPage },
  { path: "/messages",name:"messages", component: ChatPage },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
