// Business Directory Application JavaScript

// Sample data storage (in a real app, this would be a database)
let businesses = JSON.parse(localStorage.getItem('businesses')) || [];
let reviews = JSON.parse(localStorage.getItem('reviews')) || [];

// DOM Content Loaded
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
});

// Initialize Application
function initializeApp() {
    // Check which page we're on and initialize accordingly
    const currentPage = window.location.pathname.split('/').pop();
    
    switch(currentPage) {
        case 'index.html':
        case '':
            initializeHomePage();
            break;
        case 'contact.html':
            initializeContactPage();
            break;
    }
    
    // Load sample data if empty
    if (businesses.length === 0) {
        loadSampleData();
    }
}

// Initialize Home Page
function initializeHomePage() {
    // Load businesses
    displayBusinesses(businesses);
    
    // Set up event listeners
    setupEventListeners();
    
    // Update review business dropdown
    updateReviewBusinessDropdown();
}

// Initialize Contact Page
function initializeContactPage() {
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', handleContactFormSubmit);
    }
}

// Set up event listeners for home page
function setupEventListeners() {
    // Search functionality
    const searchBtn = document.getElementById('searchBtn');
    const searchInput = document.getElementById('searchInput');
    
    if (searchBtn && searchInput) {
        searchBtn.addEventListener('click', handleSearch);
        searchInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                handleSearch();
            }
        });
    }
    
    // Filter functionality
    const locationFilter = document.getElementById('locationFilter');
    const categoryFilter = document.getElementById('categoryFilter');
    
    if (locationFilter) {
        locationFilter.addEventListener('change', handleFilter);
    }
    if (categoryFilter) {
        categoryFilter.addEventListener('change', handleFilter);
    }
    
    // Business registration form
    const registrationForm = document.getElementById('businessRegistrationForm');
    if (registrationForm) {
        registrationForm.addEventListener('submit', handleBusinessRegistration);
    }
    
    // Review form
    const reviewForm = document.getElementById('reviewForm');
    if (reviewForm) {
        reviewForm.addEventListener('submit', handleReviewSubmission);
    }
    
    // Profile management
    const editProfileBtn = document.getElementById('editProfileBtn');
    const removeBusinessBtn = document.getElementById('removeBusinessBtn');
    
    if (editProfileBtn) {
        editProfileBtn.addEventListener('click', handleEditProfile);
    }
    if (removeBusinessBtn) {
        removeBusinessBtn.addEventListener('click', handleRemoveBusiness);
    }
}

// Load sample data for demonstration
function loadSampleData() {
    const sampleBusinesses = [
        {
            id: 1,
            name: "Joe's Pizza",
            category: "restaurant",
            location: "new-york",
            description: "Authentic New York style pizza since 1985.",
            phone: "(555) 123-4567",
            hours: "11 AM - 10 PM, Daily",
            rating: 4.5,
            reviewCount: 125
        },
        {
            id: 2,
            name: "Tech Solutions Inc.",
            category: "service",
            location: "los-angeles",
            description: "Professional IT services and computer repairs.",
            phone: "(555) 987-6543",
            hours: "9 AM - 6 PM, Mon-Fri",
            rating: 4.2,
            reviewCount: 89
        },
        {
            id: 3,
            name: "Green Leaf Cafe",
            category: "restaurant",
            location: "chicago",
            description: "Healthy organic food and coffee.",
            phone: "(555) 456-7890",
            hours: "7 AM - 8 PM, Daily",
            rating: 4.7,
            reviewCount: 203
        }
    ];
    
    businesses = sampleBusinesses;
    localStorage.setItem('businesses', JSON.stringify(businesses));
}

// Display businesses in the listings
function displayBusinesses(businessesToDisplay) {
    const businessListings = document.getElementById('businessListings');
    
    if (!businessListings) return;
    
    if (businessesToDisplay.length === 0) {
        businessListings.innerHTML = `
            <div class="col-12 text-center">
                <p class="text-muted">No businesses found matching your criteria.</p>
            </div>
        `;
        return;
    }
    
    businessListings.innerHTML = businessesToDisplay.map(business => `
        <div class="col-md-6 col-lg-4 mb-4">
            <div class="card business-card h-100">
                <div class="card-body">
                    <h5 class="card-title">${business.name}</h5>
                    <p class="card-text"><strong>Category:</strong> ${formatCategory(business.category)}</p>
                    <p class="card-text"><strong>Location:</strong> ${formatLocation(business.location)}</p>
                    <p class="card-text">${business.description}</p>
                    ${business.phone ? `<p class="card-text"><strong>Phone:</strong> ${business.phone}</p>` : ''}
                    ${business.hours ? `<p class="card-text"><small class="text-muted">${business.hours}</small></p>` : ''}
                    <div class="rating mb-2">
                        <span class="text-warning">${generateStarRating(business.rating)}</span>
                        <small class="text-muted">(${business.rating})</small>
                    </div>
                    <div class="business-actions">
                        <button class="btn btn-outline-primary btn-sm view-reviews" data-bs-toggle="modal" data-bs-target="#reviewsModal" data-business-id="${business.id}">
                            View Reviews (${getReviewCount(business.id)})
                        </button>
                        <button class="btn btn-outline-success btn-sm write-review" data-bs-toggle="modal" data-bs-target="#reviewModal" data-business-id="${business.id}">
                            Write Review
                        </button>
                    </div>
                </div>
            </div>
        </div>
    `).join('');
    
    // Add event listeners to the new buttons
    attachBusinessCardListeners();
}

// Handle search functionality
function handleSearch() {
    const searchInput = document.getElementById('searchInput');
    const searchTerm = searchInput.value.toLowerCase().trim();
    
    let filteredBusinesses = businesses;
    
    if (searchTerm) {
        filteredBusinesses = businesses.filter(business => 
            business.name.toLowerCase().includes(searchTerm) ||
            business.description.toLowerCase().includes(searchTerm)
        );
    }
    
    // Apply filters
    filteredBusinesses = applyFilters(filteredBusinesses);
    displayBusinesses(filteredBusinesses);
}

// Handle filter changes
function handleFilter() {
    const filteredBusinesses = applyFilters(businesses);
    displayBusinesses(filteredBusinesses);
}

// Apply location and category filters
function applyFilters(businessesToFilter) {
    const locationFilter = document.getElementById('locationFilter');
    const categoryFilter = document.getElementById('categoryFilter');
    
    let filtered = businessesToFilter;
    
    if (locationFilter && locationFilter.value) {
        filtered = filtered.filter(business => business.location === locationFilter.value);
    }
    
    if (categoryFilter && categoryFilter.value) {
        filtered = filtered.filter(business => business.category === categoryFilter.value);
    }
    
    return filtered;
}

// Handle business registration
function handleBusinessRegistration(e) {
    e.preventDefault();
    
    const businessData = {
        id: Date.now(), // Simple ID generation
        name: document.getElementById('businessName').value,
        category: document.getElementById('businessCategory').value,
        location: document.getElementById('businessLocation').value,
        description: document.getElementById('businessDescription').value,
        phone: document.getElementById('businessPhone').value,
        hours: document.getElementById('businessHours').value,
        rating: 0,
        reviewCount: 0
    };
    
    businesses.push(businessData);
    localStorage.setItem('businesses', JSON.stringify(businesses));
    
    showAlert('Business registered successfully!', 'success');
    document.getElementById('businessRegistrationForm').reset();
    
    // Update displays
    displayBusinesses(businesses);
    updateReviewBusinessDropdown();
}

// Handle review submission
function handleReviewSubmission(e) {
    e.preventDefault();
    
    const reviewData = {
        id: Date.now(),
        businessId: parseInt(document.getElementById('reviewBusiness').value),
        rating: parseInt(document.querySelector('input[name="rating"]:checked').value),
        comment: document.getElementById('reviewComment').value,
        author: 'Anonymous User', // In real app, this would be logged in user
        date: new Date().toLocaleDateString()
    };
    
    reviews.push(reviewData);
    localStorage.setItem('reviews', JSON.stringify(reviews));
    
    // Update business rating
    updateBusinessRating(reviewData.businessId);
    
    showAlert('Review submitted successfully!', 'success');
    document.getElementById('reviewForm').reset();
    
    // Refresh reviews display if on modal
    const reviewsModal = document.getElementById('reviewsModal');
    if (reviewsModal && reviewsModal.style.display !== 'none') {
        const businessId = reviewsModal.getAttribute('data-business-id');
        displayReviewsForBusiness(parseInt(businessId));
    }
}

// Update business rating after new review
function updateBusinessRating(businessId) {
    const businessReviews = reviews.filter(review => review.businessId === businessId);
    
    if (businessReviews.length > 0) {
        const totalRating = businessReviews.reduce((sum, review) => sum + review.rating, 0);
        const averageRating = totalRating / businessReviews.length;
        
        const businessIndex = businesses.findIndex(business => business.id === businessId);
        if (businessIndex !== -1) {
            businesses[businessIndex].rating = parseFloat(averageRating.toFixed(1));
            businesses[businessIndex].reviewCount = businessReviews.length;
            localStorage.setItem('businesses', JSON.stringify(businesses));
        }
    }
}

// Handle contact form submission
function handleContactFormSubmit(e) {
    e.preventDefault();
    
    const formData = {
        name: document.getElementById('contactName').value,
        email: document.getElementById('contactEmail').value,
        subject: document.getElementById('contactSubject').value,
        message: document.getElementById('contactMessage').value,
        timestamp: new Date().toISOString()
    };
    
    // In a real application, you would send this data to a server
    console.log('Contact form submission:', formData);
    
    showAlert('Thank you for your message! We will get back to you soon.', 'success');
    document.getElementById('contactForm').reset();
}

// Display reviews for a specific business
function displayReviewsForBusiness(businessId) {
    const businessReviews = reviews.filter(review => review.businessId === businessId);
    const reviewsList = document.getElementById('reviewsList');
    
    if (!reviewsList) return;
    
    if (businessReviews.length === 0) {
        reviewsList.innerHTML = '<p class="text-muted">No reviews yet. Be the first to review!</p>';
        return;
    }
    
    reviewsList.innerHTML = businessReviews.map(review => `
        <div class="review-item">
            <div class="review-header">
                <span class="review-author">${review.author}</span>
                <span class="review-date">${review.date}</span>
            </div>
            <div class="rating mb-2">
                <span class="text-warning">${generateStarRating(review.rating)}</span>
                <small class="text-muted">${review.rating}/5</small>
            </div>
            <p class="review-comment">${review.comment}</p>
        </div>
    `).join('');
}

// Update review business dropdown
function updateReviewBusinessDropdown() {
    const reviewBusinessSelect = document.getElementById('reviewBusiness');
    if (!reviewBusinessSelect) return;
    
    reviewBusinessSelect.innerHTML = '<option value="">Choose a business...</option>' +
        businesses.map(business => 
            `<option value="${business.id}">${business.name}</option>`
        ).join('');
}

// Get review count for a business
function getReviewCount(businessId) {
    return reviews.filter(review => review.businessId === businessId).length;
}

// Generate star rating HTML
function generateStarRating(rating) {
    const fullStars = Math.floor(rating);
    const halfStar = rating % 1 >= 0.5;
    const emptyStars = 5 - fullStars - (halfStar ? 1 : 0);
    
    return '★'.repeat(fullStars) + (halfStar ? '½' : '') + '☆'.repeat(emptyStars);
}

// Format category for display
function formatCategory(category) {
    const categoryMap = {
        'restaurant': 'Restaurant',
        'retail': 'Retail',
        'service': 'Service',
        'healthcare': 'Healthcare'
    };
    return categoryMap[category] || category;
}

// Format location for display
function formatLocation(location) {
    const locationMap = {
        'new-york': 'New York',
        'los-angeles': 'Los Angeles',
        'chicago': 'Chicago',
        'miami': 'Miami'
    };
    return locationMap[location] || location;
}

// Show alert message
function showAlert(message, type) {
    // Remove existing alerts
    const existingAlert = document.querySelector('.alert-message');
    if (existingAlert) {
        existingAlert.remove();
    }
    
    const alertDiv = document.createElement('div');
    alertDiv.className = `alert alert-${type} alert-message`;
    alertDiv.textContent = message;
    
    document.body.appendChild(alertDiv);
    
    // Remove alert after 5 seconds
    setTimeout(() => {
        alertDiv.remove();
    }, 5000);
}

// Attach event listeners to business card buttons
function attachBusinessCardListeners() {
    // View reviews buttons
    document.querySelectorAll('.view-reviews').forEach(button => {
        button.addEventListener('click', function() {
            const businessId = this.getAttribute('data-business-id');
            // This would typically open a modal with reviews
            console.log('View reviews for business:', businessId);
            // In a full implementation, you would display reviews in a modal
        });
    });
    
    // Write review buttons
    document.querySelectorAll('.write-review').forEach(button => {
        button.addEventListener('click', function() {
            const businessId = this.getAttribute('data-business-id');
            // This would typically open a review form modal
            console.log('Write review for business:', businessId);
            // In a full implementation, you would open a review form
        });
    });
}

// Profile management functions (simplified for demo)
function handleEditProfile() {
    showAlert('Edit profile functionality would open here', 'info');
}

function handleRemoveBusiness() {
    if (confirm('Are you sure you want to remove your business? This action cannot be undone.')) {
        showAlert('Business removed successfully', 'success');
    }
}

// Export functions for global access (if needed)
window.businessApp = {
    displayBusinesses,
    handleSearch,
    handleBusinessRegistration,
    handleReviewSubmission
};