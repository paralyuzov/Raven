import axios from "../services/api";
import { defineStore } from "pinia";

export const useMessageStore = defineStore("messageStore",{
    state : () => ({
        messages:[],
        error:null,
        loading:false
    }),
    actions:{
        async fetchMessages(user,recipient) {
            this.loading = true;
            try {
                const response = await axios(`/messages/${user}/${recipient}`);
                this.messages = response.data;
                this.loading = false;
            } catch (error) {
                this.error = error;
                this.loading = false;
            }
        }
    }
})