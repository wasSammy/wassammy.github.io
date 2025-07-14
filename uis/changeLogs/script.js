document.addEventListener('DOMContentLoaded', function() {
    // Sample changelog data - you can replace this with your actual data
    const changeLogData = [
        {
            date: "July 14, 2025",
            title: "Initial Portfolio Launch",
            description: "Launched the first version of my portfolio website with home page and basic navigation.",
            type: "feature"
        }
    ];

    // Function to render changelog items
    function renderChangeLog(items) {
        const container = document.getElementById('changelogItems');
        container.innerHTML = '';
        
        if (items.length === 0) {
            container.innerHTML = `
                <div class="text-center my-5">
                    <h3>No changes found</h3>
                    <p>Try a different search term or filter</p>
                </div>
            `;
            return;
        }

        items.forEach((item, index) => {
            const delay = index * 0.1;
            const element = document.createElement('div');
            element.className = `timeline-item ${item.type}`;
            element.style.animationDelay = `${delay}s`;
            
            let badgeText = item.type.charAt(0).toUpperCase() + item.type.slice(1);
            let badgeClass = `badge ${item.type}`;
            
            element.innerHTML = `
                <div class="timeline-content">
                    <div class="timeline-date">${item.date}</div>
                    <span class="${badgeClass}">${badgeText}</span>
                    <h3 class="timeline-title">${item.title}</h3>
                    <p class="timeline-desc">${item.description}</p>
                </div>
            `;
            
            container.appendChild(element);
            
            // Trigger animation after a small delay
            setTimeout(() => {
                if (index % 2 === 0) {
                    element.style.animation = `fadeInRight 0.5s ease forwards`;
                } else {
                    element.style.animation = `fadeInLeft 0.5s ease forwards`;
                }
            }, 100);
        });
    }

    // Initial render
    renderChangeLog(changeLogData);

    // Filter functionality
    const filterButtons = document.querySelectorAll('[data-filter]');
    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Update active state
            filterButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
            
            const filterValue = this.getAttribute('data-filter');
            let filteredItems;
            
            if (filterValue === 'all') {
                filteredItems = changeLogData;
            } else {
                filteredItems = changeLogData.filter(item => item.type === filterValue);
            }
            
            renderChangeLog(filteredItems);
        });
    });
});