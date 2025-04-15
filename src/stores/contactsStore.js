import axios from "../services/api";
import { defineStore } from "pinia";
import { useAuthStore } from "./authStore";

export const useContactsStore = defineStore("contactsStore", {
    state: () => ({
        contacts: [],
        loading: false,
        error: null,
        pendingRequests: [],
        requestUsernames: []
    }),
    
    getters: {
        allFriendRequests() {
            const authStore = useAuthStore();
            return [...new Set([
                ...authStore.user?.friendRequests || [], 
                ...this.pendingRequests.map(req => req.id)
            ])];
        }
    },

    actions: {
        async getContacts() {
            this.loading = true;
            this.error = null;
            try {
                const response = await axios.get("users/friends");
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
                
                this.pendingRequests = this.pendingRequests.filter(req => req.id !== friendId);
                authStore.user.friendRequests = authStore.user.friendRequests.filter(id => id !== friendId);
                
                await this.getContacts();
                await this.fetchRequestUsernames();
            } catch (error) {
                this.error = error.response?.data?.message || "Failed to accept friend request.";
                throw error;
            } finally {
                this.loading = false;
            }
        },
        async sendFriendRequest(friendId) {
            this.loading = true;
            this.error = null;
            try {
                const response = await axios.post(`users/friend-request/${friendId}`);
                return response.data;
            } catch (error) {
                this.error = error.response?.data?.message || "Failed to send friend request.";
                throw error;
            } finally {
                this.loading = false;
            }
        },
        async declineFriendRequest(friendId) {
            this.loading = true;
            this.error = null;
            try {
                await axios.post(`users/decline-request/${friendId}`);  
                const authStore = useAuthStore();
                this.pendingRequests = this.pendingRequests.filter(req => req.id !== friendId);
                authStore.user.friendRequests = authStore.user.friendRequests.filter(id => id !== friendId);
                await this.getContacts();
                await this.fetchRequestUsernames();
            } catch (error) {
                this.error = error.response?.data?.message || "Failed to decline friend request.";
                throw error;
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
        },
        async fetchRequestUsernames() {
            if (!this.allFriendRequests.length) return;
            
            try {
                const usernames = await Promise.all(
                    this.allFriendRequests.map(requestId => 
                        this.fetchUsernameById(requestId)
                    )
                );
                this.requestUsernames = usernames.filter(Boolean);
            } catch (error) {
                console.error('Error fetching usernames:', error);
            }
        },

        addPendingRequest(request) {
            if (!this.pendingRequests.find(req => req.id === request.id)) {
                this.pendingRequests.push(request);
                this.fetchRequestUsernames();
            }
        }
    }
});