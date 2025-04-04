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
        async sendFriendReuest(friendId) {
            this.loading = true;
            this.error = null;
            try {
                await axios.post(`users/friend-request/${friendId}`)
            } catch (error) {
                this.error = error.response?.data?.message || "Failed to send friend request."
            } finally {
                this.loading = false;
            }

        },
        async fetchUsernameById(userId) {
            this.loading = true;
            this.error = null;
            try {
              const response = await axios.get(`users/user/${userId}`);
              return response.data;
            } catch (error) {
              console.log(error);
              return null;
            }
          },
          async findUsers(query) {
            this.loading = true;
            this.error = null;
          
            try {
              const trimmedQuery = query?.trim();
              if (!trimmedQuery) {
                this.error = "Search query is empty.";
                return [];
              }
          
              const response = await axios.get(`users/search?query=${trimmedQuery}`);
              return response.data || [];
            } catch (error) {
              this.error = error.response?.data?.message || "Failed to search users.";
              console.error(error);
              return [];
            } finally {
              this.loading = false;
            }
          }
    }
})