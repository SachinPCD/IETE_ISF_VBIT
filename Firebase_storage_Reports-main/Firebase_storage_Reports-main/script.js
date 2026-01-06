// Backend API URL - Update this with your Render URL
const API_BASE_URL = 'https://firebase-storage-project.onrender.com/api';
let reports = [];
let reportToDelete = null;

// DOM Elements
const uploadForm = document.getElementById('uploadForm');
const eventNameInput = document.getElementById('eventName');
const titleInput = document.getElementById('title');
const descriptionInput = document.getElementById('description');
const fileInput = document.getElementById('fileInput');
const submitBtn = document.getElementById('submitBtn');
const progressContainer = document.getElementById('progressContainer');
const progressBar = document.getElementById('progressBar');
const progressPercentage = document.getElementById('progressPercentage');
const errorAlert = document.getElementById('errorAlert');
const successAlert = document.getElementById('successAlert');
const reportsContainer = document.getElementById('reportsContainer');
const loadingSpinner = document.getElementById('loadingSpinner');
const emptyState = document.getElementById('emptyState');
const reportCount = document.getElementById('reportCount');
const confirmDeleteBtn = document.getElementById('confirmDeleteBtn');
const deleteModal = new bootstrap.Modal(document.getElementById('deleteModal'));
const fileViewerModal = new bootstrap.Modal(document.getElementById('fileViewerModal'));
const fileViewerContent = document.getElementById('fileViewerContent');
const fileViewerTitle = document.getElementById('fileViewerTitle');
const downloadFileBtn = document.getElementById('downloadFileBtn');

// Initialize when page loads
document.addEventListener('DOMContentLoaded', function() {
    loadReports();
    setupEventListeners();
});

// Setup event listeners
function setupEventListeners() {
    // Form submission
    uploadForm.addEventListener('submit', handleFileUpload);
    
    // File input change
    fileInput.addEventListener('change', function() {
        const file = this.files[0];
        if (file && file.size > 10 * 1024 * 1024) {
            showError('File size must be less than 10MB');
            this.value = '';
        }
    });
    
    // Delete confirmation
    confirmDeleteBtn.addEventListener('click', deleteReport);
}

// Load all reports from backend
async function loadReports() {
    try {
        showLoading();
        
        const response = await fetch(`${API_BASE_URL}/reports`);
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        
        // Handle different response structures
        if (Array.isArray(data)) {
            reports = data;
        } else if (data && data.data && Array.isArray(data.data)) {
            reports = data.data;
        } else if (data && data.success) {
            reports = data.data || [];
        } else {
            reports = [];
        }
        
        displayReports();
        updateReportCount();
        
    } catch (error) {
        console.error('Error loading reports:', error);
        showErrorInReports('Failed to load reports. Please try again.');
    } finally {
        hideLoading();
    }
}

// Display reports in the UI
function displayReports() {
    reportsContainer.innerHTML = '';
    
    if (reports.length === 0) {
        emptyState.classList.remove('d-none');
        reportsContainer.classList.add('d-none');
        return;
    }
    
    emptyState.classList.add('d-none');
    reportsContainer.classList.remove('d-none');
    
    // Group reports by event name
    const groupedReports = {};
    reports.forEach(report => {
        const eventName = report.eventName || 'Uncategorized';
        if (!groupedReports[eventName]) {
            groupedReports[eventName] = [];
        }
        groupedReports[eventName].push(report);
    });
    
    // Sort events alphabetically and display each group
    const sortedEventNames = Object.keys(groupedReports).sort();
    
    sortedEventNames.forEach(eventName => {
        // Create event header
        const eventHeader = document.createElement('div');
        eventHeader.className = 'event-header mt-4 mb-3';
        const reportCount = groupedReports[eventName].length;
        eventHeader.innerHTML = `
            <h5 class="text-primary mb-0">
                <i class="bi bi-folder-fill me-2"></i>${escapeHtml(eventName)}
                <span class="badge bg-primary ms-2">${reportCount} report${reportCount !== 1 ? 's' : ''}</span>
            </h5>
            <hr class="mt-2">
        `;
        reportsContainer.appendChild(eventHeader);
        
        // Sort reports within the event by creation date (newest first)
        const sortedReports = groupedReports[eventName].sort((a, b) => 
            new Date(b.createdAt) - new Date(a.createdAt)
        );
        
        // Add reports for this event
        sortedReports.forEach(report => {
            const reportElement = createReportElement(report);
            reportsContainer.appendChild(reportElement);
        });
    });
}

// Create HTML for a single report
function createReportElement(report) {
    const div = document.createElement('div');
    div.className = 'list-group-item border-0 px-0 py-3 report-item';
    
    const fileIcon = getFileIcon(report.fileType, report.fileName);
    const fileSize = formatFileSize(report.fileSize);
    const date = formatDate(report.createdAt);
    
    div.innerHTML = `
        <div class="d-flex align-items-start">
            <div class="file-icon ${getFileIconClass(report.fileType)}">
                ${fileIcon}
            </div>
            <div class="flex-grow-1">
                <h6 class="mb-1">${escapeHtml(report.title)}</h6>
                <p class="mb-2 text-muted small">${escapeHtml(report.description)}</p>
                
                <div class="d-flex justify-content-between align-items-center">
                    <div class="file-meta">
                        <small class="text-muted me-3">
                            <i class="bi bi-calendar me-1"></i>${date}
                        </small>
                        ${report.fileSize ? `
                            <small class="text-muted">
                                <i class="bi bi-hdd me-1"></i>${fileSize}
                            </small>
                        ` : ''}
                    </div>
                    
                    <div class="btn-group btn-group-sm">
                        <button class="btn btn-outline-primary view-btn" data-url="${report.fileUrl}" data-type="${report.fileType}" data-name="${report.fileName}" title="View file">
                            <i class="bi bi-eye"></i>
                        </button>
                        <a href="${report.fileUrl}" download="${report.fileName || 'download'}" class="btn btn-outline-success" title="Download">
                            <i class="bi bi-download"></i>
                        </a>
                        <button class="btn btn-outline-danger delete-btn" data-id="${report._id}" title="Delete">
                            <i class="bi bi-trash"></i>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    // Add view event listener
    const viewBtn = div.querySelector('.view-btn');
    viewBtn.addEventListener('click', () => openFileViewer(report.fileUrl, report.fileType, report.fileName));
    
    // Add delete event listener
    const deleteBtn = div.querySelector('.delete-btn');
    deleteBtn.addEventListener('click', () => showDeleteModal(report._id));
    
    return div;
}

// Handle file upload
async function handleFileUpload(e) {
    e.preventDefault();
    
    // Get form values
    const eventName = eventNameInput.value.trim();
    const title = titleInput.value.trim();
    const description = descriptionInput.value.trim();
    const file = fileInput.files[0];
    
    // Validation
    if (!eventName) {
        showError('Event Name is required');
        return;
    }
    
    if (!title) {
        showError('Title is required');
        return;
    }
    
    if (!description) {
        showError('Description is required');
        return;
    }
    
    if (!file) {
        showError('Please select a file');
        return;
    }
    
    if (file.size > 10 * 1024 * 1024) {
        showError('File size must be less than 10MB');
        return;
    }
    
    // Disable submit button
    submitBtn.disabled = true;
    submitBtn.innerHTML = '<i class="bi bi-hourglass-split"></i> Uploading...';
    
    try {
        // Upload to Firebase Storage
        const fileUrl = await uploadToFirebase(file);
        
        // Save to backend
        await saveReportToBackend({
            eventName,
            title,
            description,
            fileUrl,
            fileName: file.name,
            fileType: file.type,
            fileSize: file.size
        });
        
        // Show success
        showSuccess('File uploaded successfully!');
        
        // Reset form
        uploadForm.reset();
        
        // Reload reports
        await loadReports();
        
    } catch (error) {
        console.error('Upload error:', error);
        showError(`Upload failed: ${error.message}`);
    } finally {
        // Re-enable submit button
        submitBtn.disabled = false;
        submitBtn.innerHTML = '<i class="bi bi-upload"></i> Upload Report';
        progressContainer.classList.add('d-none');
    }
}

// Upload file to Firebase Storage
async function uploadToFirebase(file) {
    return new Promise((resolve, reject) => {
        try {
            // Generate unique filename
            const timestamp = Date.now();
            const fileExtension = file.name.split('.').pop();
            const fileName = `${timestamp}_${Math.random().toString(36).substr(2, 9)}.${fileExtension}`;
            
            // Create storage reference
            const storageRef = window.firebaseStorage.ref(
                window.firebaseStorage.storage, 
                `uploads/${fileName}`
            );
            
            // Show progress
            progressContainer.classList.remove('d-none');
            
            // Upload file
            const uploadTask = window.firebaseStorage.uploadBytesResumable(storageRef, file);
            
            uploadTask.on('state_changed',
                (snapshot) => {
                    // Update progress
                    const progress = Math.round(
                        (snapshot.bytesTransferred / snapshot.totalBytes) * 100
                    );
                    progressBar.style.width = `${progress}%`;
                    progressPercentage.textContent = `${progress}%`;
                },
                (error) => {
                    reject(new Error(`Firebase upload failed: ${error.message}`));
                },
                async () => {
                    // Get download URL
                    try {
                        const downloadURL = await window.firebaseStorage.getDownloadURL(uploadTask.snapshot.ref);
                        resolve(downloadURL);
                    } catch (error) {
                        reject(new Error(`Failed to get download URL: ${error.message}`));
                    }
                }
            );
            
        } catch (error) {
            reject(error);
        }
    });
}

// Save report to backend
async function saveReportToBackend(reportData) {
    const response = await fetch(`${API_BASE_URL}/reports`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(reportData)
    });
    
    if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
    }
    
    return await response.json();
}

// Open file viewer modal
function openFileViewer(fileUrl, fileType, fileName) {
    fileViewerTitle.textContent = fileName || 'View File';
    downloadFileBtn.href = fileUrl;
    downloadFileBtn.download = fileName || 'download';
    
    // Clear previous content
    fileViewerContent.innerHTML = '';
    
    // Determine how to display based on file type
    if (fileType && fileType.includes('image')) {
        // Display image
        fileViewerContent.innerHTML = `
            <img src="${fileUrl}" class="img-fluid w-100" alt="${fileName}" style="max-height: 80vh; object-fit: contain;">
        `;
    } else if (fileType && fileType.includes('pdf')) {
        // Display PDF in iframe - #toolbar=0 hides the PDF toolbar (download, print buttons)
        fileViewerContent.innerHTML = `
            <iframe src="${fileUrl}#toolbar=0&navpanes=0&scrollbar=0" class="w-100" style="height: 80vh; border: none;"></iframe>
        `;
    } else if (fileType && (fileType.includes('video') || fileName.match(/\.(mp4|webm|ogg)$/i))) {
        // Display video
        fileViewerContent.innerHTML = `
            <video controls class="w-100" style="max-height: 80vh;">
                <source src="${fileUrl}" type="${fileType}">
                Your browser does not support the video tag.
            </video>
        `;
    } else if (fileType && (fileType.includes('text') || fileName.match(/\.(txt|json|xml|html|css|js)$/i))) {
        // Display text content in iframe
        fileViewerContent.innerHTML = `
            <iframe src="${fileUrl}" class="w-100" style="height: 80vh; border: none;"></iframe>
        `;
    } else {
        // For other file types (Word, Excel, etc.), show download option
        fileViewerContent.innerHTML = `
            <div class="text-center py-5">
                <i class="bi bi-file-earmark text-muted" style="font-size: 5rem;"></i>
                <h4 class="mt-4">${fileName}</h4>
                <p class="text-muted">This file type cannot be previewed in the browser.</p>
                <p class="text-muted">Click the download button below to view it on your device.</p>
                <a href="${fileUrl}" download="${fileName}" class="btn btn-success mt-3">
                    <i class="bi bi-download"></i> Download File
                </a>
            </div>
        `;
    }
    
    fileViewerModal.show();
}

// Show delete confirmation modal
function showDeleteModal(reportId) {
    reportToDelete = reportId;
    deleteModal.show();
}

// Delete report
async function deleteReport() {
    if (!reportToDelete) return;
    
    try {
        const response = await fetch(`${API_BASE_URL}/reports/${reportToDelete}`, {
            method: 'DELETE'
        });
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        // Remove from local array
        reports = reports.filter(report => report._id !== reportToDelete);
        
        // Update UI
        displayReports();
        updateReportCount();
        
        // Show success message
        showSuccess('Report deleted successfully!', 3000);
        
    } catch (error) {
        console.error('Error deleting report:', error);
        showError('Failed to delete report');
    } finally {
        deleteModal.hide();
        reportToDelete = null;
    }
}

// Utility Functions
function showError(message) {
    errorAlert.textContent = message;
    errorAlert.classList.remove('d-none');
    successAlert.classList.add('d-none');
    
    // Auto-hide after 5 seconds
    setTimeout(() => {
        errorAlert.classList.add('d-none');
    }, 5000);
}

function showSuccess(message, duration = 5000) {
    successAlert.textContent = message;
    successAlert.classList.remove('d-none');
    errorAlert.classList.add('d-none');
    
    // Auto-hide
    setTimeout(() => {
        successAlert.classList.add('d-none');
    }, duration);
}

function showLoading() {
    loadingSpinner.classList.remove('d-none');
    reportsContainer.classList.add('d-none');
    emptyState.classList.add('d-none');
}

function hideLoading() {
    loadingSpinner.classList.add('d-none');
}

function showErrorInReports(message) {
    reportsContainer.innerHTML = `
        <div class="text-center py-5">
            <i class="bi bi-exclamation-triangle-fill text-danger display-1"></i>
            <p class="mt-3 text-danger">${message}</p>
        </div>
    `;
    reportsContainer.classList.remove('d-none');
    loadingSpinner.classList.add('d-none');
    emptyState.classList.add('d-none');
}

function updateReportCount() {
    reportCount.textContent = `${reports.length} report${reports.length !== 1 ? 's' : ''}`;
}

function getFileIcon(fileType, fileName) {
    if (fileType) {
        if (fileType.includes('pdf')) return '<i class="bi bi-file-pdf"></i>';
        if (fileType.includes('image')) return '<i class="bi bi-file-image"></i>';
        if (fileType.includes('word') || fileName?.endsWith('.doc') || fileName?.endsWith('.docx')) 
            return '<i class="bi bi-file-word"></i>';
        if (fileType.includes('excel') || fileName?.endsWith('.xls') || fileName?.endsWith('.xlsx')) 
            return '<i class="bi bi-file-excel"></i>';
        if (fileType.includes('video')) return '<i class="bi bi-file-play"></i>';
    }
    return '<i class="bi bi-file-earmark"></i>';
}

function getFileIconClass(fileType) {
    if (fileType) {
        if (fileType.includes('pdf')) return 'pdf-icon';
        if (fileType.includes('image')) return 'image-icon';
        if (fileType.includes('word')) return 'word-icon';
        if (fileType.includes('excel')) return 'excel-icon';
        if (fileType.includes('video')) return 'video-icon';
    }
    return 'other-icon';
}

function formatFileSize(bytes) {
    if (!bytes) return 'N/A';
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
}

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}