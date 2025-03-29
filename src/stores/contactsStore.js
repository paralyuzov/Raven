import axios from "../services/api";
import { defineStore } from "pinia";
import { useAuthStore } from "./authStore";

export const useContactsStore = defineStore("contactsStore",{
    state : () => ({
        contacts: [],
        loading:false,
        error:null

    }),
    actions: {
        async getContacts () {
            this.loading = true;
            this.error = null;
            try {
               const response =  await axios.get("users/friends");
               this.contacts = response.data.friends || [];
            } catch (error) {
                console.log(error);
            }
        },
        async acceptFriendRequest(friendId) {
            this.loading = true;
            this.error = null;
            try {
                console.log(friendId)
                await axios.post(`users/accept-request/${friendId}`);

                const authStore = useAuthStore();
                authStore.user.friendRequests = authStore.user.friendRequests.filter(id => id !== friendId);

                await this.getContacts();
            } catch (error) {
                this.error = error.response?.data?.message || "Failed to accept friend request.";
                console.error(error);
            } finally {
                this.loading = false;
            }
        },
        async fetchUsernameById(userId) {
            try {
              const response = await axios.get(`users/user/${userId}`);
              return response.data;
            } catch (error) {
              console.log(error);
              return null;
            }
          },
    }
})