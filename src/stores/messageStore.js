import axios from "../services/api";
import { defineStore } from "pinia";

export const useMessageStore = defineStore("messageStore", {
    state: () => ({
        messages: [],
        error: null,
        loading: false
    }),
    actions: {
        async fetchMessages(user, recipient) {
            this.loading = true;
            try {
                const response = await axios(`/messages/${user}/${recipient}`);
                this.messages = response.data;
                this.loading = false;
            } catch (error) {
                this.error = error;
                this.loading = false;
            }
        },
        async uploadMedia(mediaFile) {
            this.loading = true;
            this.error = null;

            try {
                const formData = new FormData();
                formData.append('media', mediaFile);

                const response = await axios.post('/media/upload-media', formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data'
                    }
                });

                this.loading = false;
                return response.data;
            } catch (error) {
                this.error = error.response?.data?.message || "Failed to upload media";
                this.loading = false;
                throw error;
            }
        }
    }
});