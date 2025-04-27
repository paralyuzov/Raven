<script setup>
import { ref, onMounted } from 'vue';
import { useAuthStore } from '../stores/authStore';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { faCamera, faCheck, faTimes } from '@fortawesome/free-solid-svg-icons';
import Avatar from '../components/ui/Avatar.vue';

const authStore = useAuthStore();
const isUploading = ref(false);
const avatarPreview = ref(null);
const notification = ref({ show: false, message: '', type: 'success' });

const userProfile = ref({
  firstName: '',
  lastName: '',
  nickname: '',
  email: '',
  avatar: ''
});

const fileInputRef = ref(null);

onMounted(() => {
  if (authStore.user) {
    userProfile.value = {
      firstName: authStore.user.firstName || '',
      lastName: authStore.user.lastName || '',
      nickname: authStore.user.nickname || '',
      email: authStore.user.email || '',
      avatar: authStore.user.avatar || ''
    };
  }
});

const handleAvatarChange = (event) => {
  const file = event.target.files[0];
  if (!file) return;
  
  if (!file.type.match('image.*')) {
    showNotification('Please select an image file', 'error');
    return;
  }
  
  if (file.size > 5 * 1024 * 1024) { 
    showNotification('Image must be smaller than 5MB', 'error');
    return;
  }
  
  const reader = new FileReader();
  reader.onload = (e) => {
    avatarPreview.value = e.target.result;
  };
  reader.readAsDataURL(file);
};

const uploadAvatar = async () => {
  try {
    isUploading.value = true;
    const fileInput = document.querySelector('#avatar-upload');
    const file = fileInput.files[0];
    
    if (!file) return;
    
    const response = await authStore.uploadAvatar(file);
    
    userProfile.value.avatar = response.avatarUrl;
    authStore.user.avatar = response.avatarUrl; 
    
    console.log("Avatar URL from server:", response.avatarUrl);
    showNotification('Avatar updated successfully!', 'success');
    
    // Add a slight delay before clearing preview
    setTimeout(() => {
      avatarPreview.value = null;
    }, 100);
  } catch (error) {
    console.error('Error uploading avatar:', error);
    showNotification('Failed to upload avatar: ' + (authStore.error || error.message), 'error');
  } finally {
    isUploading.value = false;
  }
};

const cancelAvatarUpload = () => {
  avatarPreview.value = null;
  const fileInput = document.querySelector('#avatar-upload');
  if (fileInput) fileInput.value = '';
};

const showNotification = (message, type = 'success') => {
  notification.value = {
    show: true,
    message,
    type
  };
  
  setTimeout(() => {
    notification.value.show = false;
  }, 3000);
};

const triggerFileInput = () => {
  fileInputRef.value?.click();
};
</script>

<template>
  <div class="container mx-auto px-4 py-8 max-w-4xl">
    <div v-if="notification.show" 
         class="fixed top-5 right-5 p-4 rounded-lg shadow-lg z-50 transition-all duration-300"
         :class="notification.type === 'success' ? 'bg-green-500' : 'bg-red-500'">
      <p class="text-white">{{ notification.message }}</p>
    </div>
  
    <div class="bg-slate-800 rounded-xl p-6 shadow-lg mb-6">
      <div class="flex flex-col md:flex-row items-center gap-6">
        <div class="relative">
          <div class="relative group w-32 h-32">
            <img v-if="avatarPreview"
              :src="avatarPreview" 
              alt="Avatar Preview" 
              class="w-32 h-32 rounded-full object-cover border-4 border-purple-700"
            />
            <Avatar 
              v-show="!avatarPreview"
              :src="userProfile.avatar"
              :key="userProfile.avatar" 
              size="xl"
              class="border-4 border-purple-700"
            />
            
            <div
              v-if="!avatarPreview" 
              class="absolute inset-0 rounded-full flex items-center justify-center transition-all duration-300 cursor-pointer"
              @click="triggerFileInput"
            >
              <div class="absolute inset-0 bg-black opacity-0 group-hover:opacity-50 rounded-full transition-opacity"></div>
              
              <div class="relative z-20 opacity-0 group-hover:opacity-100 transition-opacity">
                <FontAwesomeIcon :icon="faCamera" size="lg" class="text-white" />
                <p class="text-xs mt-1 text-white">Change</p>
              </div>
            </div>
    
            <div v-if="avatarPreview" class="absolute flex -bottom-2 -right-2 space-x-1 z-30">
              <button 
                @click="uploadAvatar"
                :disabled="isUploading"
                class="flex justify-center items-center bg-green-500 hover:bg-green-600 p-2 rounded-full text-white shadow-lg transition-all duration-200 hover:cursor-pointer"
              >
                <FontAwesomeIcon :icon="faCheck" />
              </button>
              <button 
                @click="cancelAvatarUpload"
                class="flex justify-center items-center bg-red-500 hover:bg-red-600 p-2 rounded-full text-white shadow-lg transition-all duration-200 hover:cursor-pointer"
              >
                <FontAwesomeIcon :icon="faTimes" />
              </button>
            </div>
            
            <input 
              type="file" 
              ref="fileInputRef"
              id="avatar-upload" 
              accept="image/*"
              class="hidden"
              @change="handleAvatarChange"
            />
          </div>
        </div>
        
        <div class="flex-grow text-center md:text-left">
          <h1 class="text-3xl font-orbitron tracking-widest text-purple-400 mb-2">
            {{ userProfile.firstName }} {{ userProfile.lastName }}
          </h1>
          <p class="text-gray-400 mb-4">@{{ userProfile.nickname }}</p>
        </div>
      </div>
    </div>
    
    <div class="bg-slate-800 rounded-xl p-6 shadow-lg">
      <h2 class="text-xl font-orbitron tracking-wide text-purple-500 mb-4">Account Information</h2>
      
      <div class="space-y-4">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <h3 class="text-gray-400">Email</h3>
            <p class="text-white">{{ userProfile.email }}</p>
          </div>
          
          <div>
            <h3 class="text-gray-400">Nickname</h3>
            <p class="text-white">{{ userProfile.nickname }}</p>
          </div>
        </div>
        
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <h3 class="text-gray-400">First Name</h3>
            <p class="text-white">{{ userProfile.firstName }}</p>
          </div>
          
          <div>
            <h3 class="text-gray-400">Last Name</h3>
            <p class="text-white">{{ userProfile.lastName }}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>