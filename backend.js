// Simple Backend for Image Locking System
class ImageGalleryBackend {
    constructor() {
        this.storageKey = 'mithunBirthdayGallery';
        this.adminKey = 'mithunAdminAccess';
        this.initializeStorage();
        this.loadGallery();
    }

    initializeStorage() {
        if (!localStorage.getItem(this.storageKey)) {
            const initialData = {
                images: [],
                locked: false,
                adminPassword: 'mi2024',
                lastUpdated: null
            };
            localStorage.setItem(this.storageKey, JSON.stringify(initialData));
        }
    }

    loadGallery() {
        const data = localStorage.getItem(this.storageKey);
        this.galleryData = data ? JSON.parse(data) : {
            images: [],
            locked: false,
            adminPassword: 'mi2024',
            lastUpdated: null
        };
        return this.galleryData;
    }

    saveGallery() {
        this.galleryData.lastUpdated = new Date().toISOString();
        localStorage.setItem(this.storageKey, JSON.stringify(this.galleryData));
    }

    // Admin authentication
    authenticateAdmin(password) {
        return password === this.galleryData.adminPassword;
    }

    // Image management
    addImage(imageData) {
        if (this.galleryData.locked) {
            return { success: false, message: 'Gallery is locked by admin' };
        }

        const image = {
            id: Date.now() + Math.random(),
            src: imageData.src,
            title: imageData.title || `Memory ${this.galleryData.images.length + 1}`,
            date: imageData.date || new Date().toLocaleDateString(),
            timestamp: Date.now(),
            uploadedBy: imageData.uploadedBy || 'Anonymous',
            locked: false
        };

        this.galleryData.images.push(image);
        this.saveGallery();
        
        return { 
            success: true, 
            message: 'Image added successfully',
            image: image 
        };
    }

    removeImage(imageId) {
        const index = this.galleryData.images.findIndex(img => img.id === imageId);
        if (index > -1) {
            this.galleryData.images.splice(index, 1);
            this.saveGallery();
            return { success: true, message: 'Image removed successfully' };
        }
        return { success: false, message: 'Image not found' };
    }

    lockGallery(password) {
        if (!this.authenticateAdmin(password)) {
            return { success: false, message: 'Invalid admin password' };
        }

        this.galleryData.locked = true;
        this.saveGallery();
        return { success: true, message: 'Gallery locked successfully' };
    }

    unlockGallery(password) {
        if (!this.authenticateAdmin(password)) {
            return { success: false, message: 'Invalid admin password' };
        }

        this.galleryData.locked = false;
        this.saveGallery();
        return { success: true, message: 'Gallery unlocked successfully' };
    }

    getGalleryStatus() {
        return {
            locked: this.galleryData.locked,
            imageCount: this.galleryData.images.length,
            lastUpdated: this.galleryData.lastUpdated
        };
    }

    getAllImages() {
        return this.galleryData.images;
    }

    // Export/Import functionality
    exportGallery() {
        const exportData = {
            images: this.galleryData.images,
            exportedAt: new Date().toISOString(),
            version: '1.0'
        };
        
        const dataStr = JSON.stringify(exportData, null, 2);
        const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
        
        const exportFileDefaultName = `mithun-gallery-${Date.now()}.json`;
        
        const linkElement = document.createElement('a');
        linkElement.setAttribute('href', dataUri);
        linkElement.setAttribute('download', exportFileDefaultName);
        linkElement.click();
        
        return { success: true, message: 'Gallery exported successfully' };
    }

    importGallery(jsonData) {
        try {
            const importedData = JSON.parse(jsonData);
            
            if (importedData.images && Array.isArray(importedData.images)) {
                this.galleryData.images = [...this.galleryData.images, ...importedData.images];
                this.saveGallery();
                return { 
                    success: true, 
                    message: `Imported ${importedData.images.length} images successfully` 
                };
            }
            
            return { success: false, message: 'Invalid import data format' };
        } catch (error) {
            return { success: false, message: 'Failed to parse import data' };
        }
    }
}

// Initialize backend
window.galleryBackend = new ImageGalleryBackend();
