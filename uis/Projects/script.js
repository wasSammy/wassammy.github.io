document.addEventListener('DOMContentLoaded', function() {
    // Sample project data - replace with your actual projects
    const projectsData = [
        {
            title: "Mushroom Project",
            description: "A upcoming project by Morel Studios",
            longDescription: "The Mushroom Species Classifier is an advanced application that uses deep learning to identify different mushroom species from uploaded images. Built with TensorFlow and integrated with a user-friendly interface, the app helps foragers and enthusiasts identify mushrooms with high accuracy. The model was trained on a dataset of over 10,000 mushroom images spanning 200 common species.",
            tags: ["Unity", "Game"],
            status: "upcoming",
            lastUpdated: "July 14, 2025",
        },
        {
            title: "Morel Mod",
            description: "A Moderation bot for Morel Studios Discord Server",
            longDescription: "The Morel Mod is a powerful moderation bot designed specifically for the Morel Studios Discord Server. It includes features such as automated moderation, user management, and customizable commands to enhance the server experience. Built with Discord.js and hosted on a reliable cloud platform, the bot ensures a safe and engaging environment for all members.",
            tags: ["Discord", "Bot"],
            status: "active",
            lastUpdated: "July 14, 2025",
        },
        {
            title: "Zett Engine",
            description: "A game engine for 3D and 2D games",
            longDescription: "The Zett Engine is a versatile game engine designed for creating both 3D and 2D games. With a user-friendly interface and powerful features, it allows developers to bring their game ideas to life quickly and efficiently. The engine supports a wide range of platforms and is built with performance in mind, making it an ideal choice for indie developers and large studios alike.",
            tags: ["Game Engine", "3D", "2D"],
            status: "upcoming",
            lastUpdated: "July 14, 2025",
        },
    ];

    // Function to render projects - now with optional images
    function renderProjects(projects = projectsData) {
        const container = document.getElementById('allProjects');
        container.innerHTML = '';
        
        if (projects.length === 0) {
            container.innerHTML = `
                <div class="col-12 text-center my-5">
                    <h3>No projects found</h3>
                    <p>Try a different filter</p>
                </div>
            `;
            return;
        }
        
        projects.forEach((project, index) => {
            const delay = index * 0.1;
            const element = document.createElement('div');
            element.className = 'col-12 col-md-6 col-lg-4';
            element.style.animationDelay = `${delay}s`;
            element.style.paddingBottom = '20px';
            
            // Create status badge
            let statusBadge = '';
            if (project.status === 'active') {
                statusBadge = '<span class="status-badge status-active">Active</span>';
            } else if (project.status === 'completed') {
                statusBadge = '<span class="status-badge status-completed">Completed</span>';
            } else if (project.status === 'planning') {
                statusBadge = '<span class="status-badge status-planning">Planning</span>';
            } else if (project.status === 'upcoming') {
                statusBadge = '<span class="status-badge status-upcoming">Upcoming</span>';
            }
            
            // Create tag elements
            const tagElements = project.tags.map(tag => 
                `<span class="tag">${tag}</span>`
            ).join('');
            
            // Optional image section
            const imageSection = project.thumbnail ? `
                <div class="card-img-container">
                    <img src="${project.thumbnail}" class="card-img-top" alt="${project.title}">
                    <div class="overlay">
                        <div class="overlay-buttons">
                            <button class="btn btn-sm btn-glow view-details" data-project-id="${project.id}">
                                <i class="fas fa-info-circle"></i> Details
                            </button>
                        </div>
                    </div>
                </div>
            ` : '';
            
            element.innerHTML = `
                <div class="project-card" data-project-id="${project.id}">
                    ${imageSection}
                    <div class="card-body">
                        <h5 class="card-title">${project.title}</h5>
                        <h6 class="card-subtitle">${statusBadge}</h6>
                        <p class="card-text">${project.description}</p>
                        <div class="tags">
                            ${tagElements}
                        </div>
                    </div>
                    <div class="card-footer">
                        <small class="text-muted">Updated: ${project.lastUpdated}</small>
                        <div class="project-links">
                            ${project.github ? `<a href="${project.github}" class="me-2" target="_blank"><i class="fab fa-github"></i></a>` : ''}
                            ${project.liveDemo ? `<a href="${project.liveDemo}" target="_blank"><i class="fas fa-external-link-alt"></i></a>` : ''}
                        </div>
                    </div>
                </div>
            `;
            
            container.appendChild(element);
        });
    }
    
    // Initial render
    renderProjects();
    
    // Filter functionality
    const filterButtons = document.querySelectorAll('[data-filter]');
    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Update active state
            filterButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
            
            const filterValue = this.getAttribute('data-filter');
            let filteredProjects;
            
            if (filterValue === 'all') {
                filteredProjects = projectsData;
            } else {
                filteredProjects = projectsData.filter(project => project.category === filterValue);
            }
            
            renderProjects(filteredProjects);
        });
    });
    
    // Project modal functionality
    // document.addEventListener('click', function(e) {
    //     if (e.target.classList.contains('view-details') || e.target.closest('.view-details')) {
    //         const button = e.target.classList.contains('view-details') ? e.target : e.target.closest('.view-details');
    //         const projectId = parseInt(button.getAttribute('data-project-id'));
    //         const project = projectsData.find(p => p.id === projectId);
            
    //         if (project) {
    //             // Populate modal with project details
    //             document.getElementById('projectModalLabel').textContent = project.title;
                
    //             const modalBody = document.getElementById('projectModalBody');
                
    //             // Create tag elements
    //             const tagElements = project.tags.map(tag => 
    //                 `<span class="tag">${tag}</span>`
    //             ).join('');

    //             // Optional image in modal
    //             const imageSection = (project.image || project.thumbnail) ? 
    //                 `<img src="${project.image || project.thumbnail}" class="project-image" alt="${project.title}">` : '';
                
    //             modalBody.innerHTML = `
    //                 <div class="project-details">
    //                     ${imageSection}
    //                     <p>${project.longDescription}</p>
                        
    //                     <h5>Features:</h5>
    //                     <ul class="project-features">
    //                         ${featuresList}
    //                     </ul>
                        
    //                     <div class="mb-3">
    //                         <h5>Technologies:</h5>
    //                         ${tagElements}
    //                     </div>
                        
    //                     <div class="d-flex justify-content-between align-items-center mt-4">
    //                         <div>
    //                             <p class="mb-0"><strong>Status:</strong> ${project.status.charAt(0).toUpperCase() + project.status.slice(1)}</p>
    //                             <p class="mb-0"><strong>Last Updated:</strong> ${project.lastUpdated}</p>
    //                         </div>
    //                     </div>
    //                 </div>
    //             `;
                
    //             // Update modal footer links
    //             const liveDemo = document.getElementById('modalLiveDemo');
    //             const githubLink = document.getElementById('modalGithubLink');
                
    //             if (project.liveDemo) {
    //                 liveDemo.href = project.liveDemo;
    //                 liveDemo.style.display = 'block';
    //             } else {
    //                 liveDemo.style.display = 'none';
    //             }
                
    //             if (project.github) {
    //                 githubLink.href = project.github;
    //                 githubLink.style.display = 'block';
    //             } else {
    //                 githubLink.style.display = 'none';
    //             }
                
    //             // Show the modal
    //             const projectModal = new bootstrap.Modal(document.getElementById('projectModal'));
    //             projectModal.show();
    //         }
    //     }
    // });
});