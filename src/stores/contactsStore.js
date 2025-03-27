import axios from "../services/api";
import { defineStore } from "pinia";

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
               const response =  await axios.get("/users");
               this.contacts = response.data;
            } catch (error) {
                console.log(error);
            }
        }
    }
})