(function() {
    // Elements
    const searchInput = document.getElementById('portfolio-search');
    const filterToggleBtn = document.getElementById('filter-toggle-btn');
    const filtersPanel = document.getElementById('filters-panel');
    const filtersCloseMobile = document.getElementById('filters-close-mobile');
    const filtersOverlay = document.getElementById('filters-overlay');
    const cards = document.querySelectorAll('.project-card');
    const resultsCount = document.getElementById('results-count');
    const noResults = document.getElementById('no-results');
    const activeFiltersBadge = document.getElementById('active-filters-count');
    const sortSelect = document.getElementById('sort-select');
    const grid = document.getElementById('projects-grid');

    // State
    let selectedWorktypes = new Set();
    let selectedStatuses = new Set();
    let selectedTags = new Set();
    let searchQuery = '';

    // Mobile Filter Toggle
    function openFilters() {
        if (filtersPanel) filtersPanel.classList.add('is-open');
        // On mobile, lock body scroll in a robust way so the panel can scroll independently
        if (window.matchMedia && window.matchMedia('(max-width: 1023px)').matches) lockBodyScroll();
    }

    function closeFilters() {
        if (filtersPanel) filtersPanel.classList.remove('is-open');
        if (window.matchMedia && window.matchMedia('(max-width: 1023px)').matches) unlockBodyScroll();
    }

    // Body scroll lock helpers (works on mobile browsers)
    let _scrollY = 0;
    function lockBodyScroll() {
        _scrollY = window.scrollY || window.pageYOffset || 0;
        // Freeze the document while keeping its visual position
        document.documentElement.style.scrollBehavior = 'auto';
        document.body.style.position = 'fixed';
        document.body.style.top = `-${_scrollY}px`;
        document.body.style.left = '0';
        document.body.style.right = '0';
        document.body.style.width = '100%';
    }

    function unlockBodyScroll() {
        // Restore
        document.body.style.position = '';
        document.body.style.top = '';
        document.body.style.left = '';
        document.body.style.right = '';
        document.body.style.width = '';
        // Restore scroll position
        window.scrollTo(0, _scrollY);
        document.documentElement.style.scrollBehavior = '';
    }

    if (filterToggleBtn) filterToggleBtn.addEventListener('click', openFilters);
    if (filtersCloseMobile) filtersCloseMobile.addEventListener('click', closeFilters);
    if (filtersOverlay) filtersOverlay.addEventListener('click', closeFilters);

    // Add collapse/expand toggles to each filter section
    document.querySelectorAll('.portfolio__filter-section').forEach(section => {
        const label = section.querySelector('.portfolio__filter-label');
        if (!label) return;

        const btn = document.createElement('button');
        btn.type = 'button';
        btn.className = 'portfolio__filter-toggle';
        btn.setAttribute('aria-expanded', 'true');
        btn.innerHTML = '<i class="uil uil-angle-up"></i>';

        label.appendChild(btn);

        btn.addEventListener('click', () => {
            const expanded = btn.getAttribute('aria-expanded') === 'true';
            btn.setAttribute('aria-expanded', String(!expanded));
            section.classList.toggle('is-collapsed', expanded);
            const icon = btn.querySelector('i');
            if (icon) icon.className = expanded ? 'uil uil-angle-down' : 'uil uil-angle-up';
        });
    });

    // Update active filters badge
    function updateFilterBadge() {
        const activeCount = selectedWorktypes.size + selectedStatuses.size + selectedTags.size;
        if (activeFiltersBadge) {
            activeFiltersBadge.textContent = activeCount > 0 ? activeCount : '';
            activeFiltersBadge.style.display = activeCount > 0 ? 'flex' : 'none';
        }
    }

    // Check if card matches filters
    function matchesFilters(card) {
        const worktype = card.dataset.work;
        const status = card.dataset.status;
        const tags = card.dataset.tags ? card.dataset.tags.split(',') : [];
        
        if (selectedWorktypes.size > 0 && !selectedWorktypes.has(worktype)) return false;
        if (selectedStatuses.size > 0 && !selectedStatuses.has(status)) return false;
        if (selectedTags.size > 0 && !tags.some(tag => selectedTags.has(tag))) return false;
        
        if (searchQuery) {
            const query = searchQuery.toLowerCase();
            const title = (card.querySelector('.project-card__title')?.textContent || '').toLowerCase();
            const desc = (card.querySelector('.project-card__desc')?.textContent || '').toLowerCase();
            const techs = Array.from(card.querySelectorAll('.project-card__tech')).map(t => t.textContent.toLowerCase());
            
            if (!title.includes(query) && !desc.includes(query) && !techs.some(t => t.includes(query))) return false;
        }
        
        return true;
    }

    // Apply filters
    function applyFilters() {
        let visibleCount = 0;
        
        cards.forEach(card => {
            if (matchesFilters(card)) {
                card.style.display = '';
                visibleCount++;
            } else {
                card.style.display = 'none';
            }
        });
        
        if(resultsCount) resultsCount.textContent = visibleCount;
        if(noResults) noResults.style.display = visibleCount === 0 ? 'flex' : 'none';
        if(grid) grid.style.display = visibleCount > 0 ? '' : 'none';

        updateFilterBadge();
    }

    // Search handler
    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            searchQuery = e.target.value;
            applyFilters();
        });
    }

    // Filter checkbox handlers
    function setupFilter(selector, set) {
        document.querySelectorAll(selector).forEach(cb => {
            cb.addEventListener('change', function() {
                if (this.checked) set.add(this.value);
                else set.delete(this.value);
                applyFilters();
            });
        });
    }
    setupFilter('[data-filter="worktype"]', selectedWorktypes);
    setupFilter('[data-filter="status"]', selectedStatuses);
    setupFilter('[data-filter="tag"]', selectedTags);


    // Clear filters
    function clearAllFilters() {
        selectedWorktypes.clear();
        selectedStatuses.clear();
        selectedTags.clear();
        searchQuery = '';

        document.querySelectorAll('.portfolio__filter-chips input').forEach(cb => cb.checked = false);
        if (searchInput) searchInput.value = '';

        applyFilters();
    }

    document.getElementById('clear-filters')?.addEventListener('click', clearAllFilters);
    document.getElementById('clear-filters-empty')?.addEventListener('click', clearAllFilters);

    // Sort
    if (sortSelect) {
        sortSelect.addEventListener('change', function() {
            if (!grid) return;
            const cardsArray = Array.from(grid.querySelectorAll('.project-card'));
            
            cardsArray.sort((a, b) => {
                if (this.value === 'newest') {
                    return (b.dataset.date || '').localeCompare(a.dataset.date || '');
                } else if (this.value === 'oldest') {
                    return (a.dataset.date || '').localeCompare(b.dataset.date || '');
                } else if (this.value === 'name') {
                    return (a.querySelector('.project-card__title')?.textContent || '').localeCompare(
                        (b.querySelector('.project-card__title')?.textContent || '')
                    );
                }
                return 0;
            });
            
            cardsArray.forEach(card => grid.appendChild(card));
        });
    }

    // Initialize
    function init() {
        document.querySelectorAll('.portfolio__filter-chips input').forEach(cb => {
            cb.checked = false; // Start with all filters unchecked
        });
        clearAllFilters(); // This also calls applyFilters
        
        // Trigger default sort
        if (sortSelect) {
            sortSelect.dispatchEvent(new Event('change'));
        }
    }

    // Close panel with Escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && filtersPanel && filtersPanel.classList.contains('is-open')) closeFilters();
    });

    // Defer initial execution until DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
