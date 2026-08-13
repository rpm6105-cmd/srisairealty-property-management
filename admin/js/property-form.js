document.addEventListener('DOMContentLoaded', function () {
    const editId = new URLSearchParams(window.location.search).get('id');
    if (editId) {
        setTopbarTitle('Edit Property', 'Update the property listing details');
        loadProperty(editId);
    } else {
        setTopbarTitle('Add Property', 'Create a new property listing');
        renderForm();
    }
});

let selectedFiles = [];
let existingImages = [];
let removeImages = [];

function loadProperty(id) {
    const content = document.getElementById('contentArea');
    content.innerHTML = `
        <div class="loading-state">
            <div class="spinner"></div>
            <p>Loading property...</p>
        </div>`;

    API.get('/api/properties/' + id)
        .then((p) => {
            renderForm(p);
        })
        .catch((err) => {
            content.innerHTML = `
                <div class="card"><div class="card-body" style="text-align:center; padding: 60px;">
                    <i class="fas fa-exclamation-triangle" style="font-size: 2.5rem; color: var(--warning); margin-bottom: 16px; display:block;"></i>
                    <h3 style="margin-bottom: 8px;">Failed to load property</h3>
                    <p style="color: var(--text-muted); margin-bottom: 20px;">${esc(err.message)}</p>
                    <a href="/admin/properties.html" class="btn btn-primary"><i class="fas fa-arrow-left"></i> Back to Properties</a>
                </div></div>`;
        });
}

function renderForm(p) {
    const content = document.getElementById('contentArea');
    const isEdit = !!p;
    existingImages = p ? p.images || [] : [];

    content.innerHTML = `
        <div class="card">
            <div class="card-header">
                <h3>${isEdit ? '<i class="fas fa-edit" style="margin-right: 8px; color: var(--primary);"></i> Edit Property' : '<i class="fas fa-plus-circle" style="margin-right: 8px; color: var(--primary);"></i> Add New Property'}</h3>
                <a href="/admin/properties.html" class="btn btn-outline btn-sm"><i class="fas fa-arrow-left"></i> Back</a>
            </div>
            <div class="card-body">
                <form id="propertyForm">
                    <div class="form-grid">
                        <div class="form-group full">
                            <label for="title">Property Title <span class="required">*</span></label>
                            <input type="text" id="title" name="title" required placeholder="e.g. Premium 3BHK Apartment" value="${isEdit ? esc(p.title) : ''}">
                        </div>

                        <div class="form-group">
                            <label for="type">Property Type <span class="required">*</span></label>
                            <select id="type" name="type" required onchange="updateSubTypeOptions()">
                                <option value="">Select type</option>
                                <option value="residential" ${isEdit && p.type === 'residential' ? 'selected' : ''}>Residential</option>
                                <option value="commercial" ${isEdit && p.type === 'commercial' ? 'selected' : ''}>Commercial</option>
                                <option value="plot" ${isEdit && p.type === 'plot' ? 'selected' : ''}>Plot / Land</option>
                            </select>
                        </div>

                        <div class="form-group">
                            <label for="subType">Sub Type</label>
                            <select id="subType" name="subType">
                                <option value="">Select sub type</option>
                            </select>
                        </div>

                        <div class="form-group">
                            <label for="location">Location <span class="required">*</span></label>
                            <input type="text" id="location" name="location" required placeholder="e.g. Whitefield, Bengaluru" value="${isEdit ? esc(p.location) : ''}">
                        </div>

                        <div class="form-group">
                            <label for="price">Price <span class="required">*</span></label>
                            <input type="text" id="price" name="price" required placeholder="e.g. ₹1.2 Cr or ₹85 Lakh" value="${isEdit ? esc(p.price) : ''}">
                        </div>

                        <div class="form-group">
                            <label for="status">Listing Status</label>
                            <select id="status" name="status">
                                ${['For Sale', 'New Launch', 'Ready to Move', 'Under Construction', 'BDA Approved', 'Ready to Occupy', 'Sold', 'Rented'].map((s) =>
                                    `<option value="${s}" ${isEdit && p.status === s ? 'selected' : ''}>${s}</option>`).join('')}
                            </select>
                        </div>

                        <div class="form-group">
                            <label for="beds">Bedrooms</label>
                            <input type="number" id="beds" name="beds" min="0" max="20" placeholder="e.g. 3" value="${isEdit ? (p.beds || '') : ''}">
                        </div>

                        <div class="form-group">
                            <label for="baths">Bathrooms</label>
                            <input type="number" id="baths" name="baths" min="0" max="20" placeholder="e.g. 2" value="${isEdit ? (p.baths || '') : ''}">
                        </div>

                        <div class="form-group full">
                            <label for="area">Area / Size</label>
                            <input type="text" id="area" name="area" placeholder="e.g. 1,450 sq.ft" value="${isEdit ? esc(p.area) : ''}">
                        </div>

                        <div class="form-group full">
                            <label for="description">Description</label>
                            <textarea id="description" name="description" rows="4" placeholder="Describe the property, amenities, nearby attractions, etc.">${isEdit ? esc(p.description) : ''}</textarea>
                        </div>

                        ${isEdit && existingImages.length ? `
                        <div class="form-group full">
                            <label>Existing Images</label>
                            <div class="image-previews" id="existingImagesPreview">
                                ${existingImages.map((img) => `
                                    <div class="image-preview">
                                        <img src="${img}" alt="">
                                        <button type="button" class="remove-img" onclick="removeExistingImage('${esc(img)}', this)"><i class="fas fa-times"></i></button>
                                    </div>`).join('')}
                            </div>
                        </div>` : ''}

                        <div class="form-group full">
                            <label>Property Images</label>
                            <div class="image-upload-area" onclick="document.getElementById('images').click()">
                                <i class="fas fa-cloud-upload-alt"></i>
                                <p>Click to upload images (up to 8, max 5MB each)</p>
                                <p style="font-size:0.75rem; color: var(--text-muted);">JPG, PNG, WEBP supported</p>
                                <input type="file" id="images" name="images" accept="image/*" multiple onchange="handleFiles(this.files)">
                            </div>
                            <div class="image-previews" id="newImagesPreview"></div>
                        </div>

                        <div class="form-group full">
                            <label class="toggle" style="margin-right: 10px;">
                                <input type="checkbox" id="featured" name="featured" ${isEdit && p.featured ? 'checked' : ''}>
                                <span class="toggle-slider"></span>
                            </label>
                            <span style="font-size: 0.9rem; font-weight: 500; color: var(--dark); vertical-align: middle;">Feature this property (shows first / highlighted)</span>
                        </div>
                    </div>

                    <div class="form-actions">
                        <a href="/admin/properties.html" class="btn btn-outline"><i class="fas fa-times"></i> Cancel</a>
                        <button type="submit" class="btn btn-primary" id="submitBtn">
                            ${isEdit ? '<i class="fas fa-save"></i> Save Changes' : '<i class="fas fa-plus"></i> Create Property'}
                        </button>
                    </div>
                </form>
            </div>
        </div>`;

    populateSubTypes(isEdit ? p : null);
    document.getElementById('propertyForm').addEventListener('submit', handleSubmit);
}

function updateSubTypeOptions() {
    populateSubTypes();
}

function populateSubTypes(p) {
    const type = document.getElementById('type').value;
    const select = document.getElementById('subType');
    let options = [];

    if (type === 'residential') {
        options = ['1BHK', '2BHK', '3BHK', '4BHK', '5BHK+', 'Villa', 'Penthouse', 'Studio', 'Independent House'];
    } else if (type === 'commercial') {
        options = ['Office Space', 'Retail / Showroom', 'Shop', 'Warehouse', 'Co-working Space', 'Industrial'];
    } else if (type === 'plot') {
        options = ['Residential Plot', 'Commercial Plot', 'Farm Land', 'Agricultural Land'];
    }

    select.innerHTML = `<option value="">Select sub type</option>` +
        options.map((o) => `<option value="${o}" ${p && p.subType === o ? 'selected' : ''}>${o}</option>`).join('');
}

function handleFiles(files) {
    const validFiles = Array.from(files).filter((f) => f.type.startsWith('image/') && f.size <= 5 * 1024 * 1024);
    selectedFiles = [...selectedFiles, ...validFiles].slice(0, 8);
    renderNewImages();
}

function renderNewImages() {
    const preview = document.getElementById('newImagesPreview');
    if (!preview) return;
    preview.innerHTML = selectedFiles.map((f, i) => `
        <div class="image-preview">
            <img src="${URL.createObjectURL(f)}" alt="">
            <button type="button" class="remove-img" onclick="removeNewImage(${i})"><i class="fas fa-times"></i></button>
        </div>`).join('');
}

function removeNewImage(index) {
    selectedFiles.splice(index, 1);
    renderNewImages();
}

function removeExistingImage(img, btn) {
    btn.closest('.image-preview').remove();
    removeImages.push(img);
}

async function handleSubmit(e) {
    e.preventDefault();
    const btn = document.getElementById('submitBtn');
    btn.disabled = true;
    const originalHtml = btn.innerHTML;
    btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Saving...';

    const formData = new FormData();
    formData.append('title', document.getElementById('title').value.trim());
    formData.append('type', document.getElementById('type').value);
    formData.append('subType', document.getElementById('subType').value);
    formData.append('location', document.getElementById('location').value.trim());
    formData.append('price', document.getElementById('price').value.trim());
    formData.append('status', document.getElementById('status').value);
    formData.append('beds', document.getElementById('beds').value || 0);
    formData.append('baths', document.getElementById('baths').value || 0);
    formData.append('area', document.getElementById('area').value);
    formData.append('description', document.getElementById('description').value);
    formData.append('featured', document.getElementById('featured').checked);

    selectedFiles.forEach((f) => formData.append('images', f));
    removeImages.forEach((img) => formData.append('removeImages', img));

    try {
        const isEdit = !!editId;
        if (isEdit) {
            await API.put('/api/properties/' + editId, formData);
            toast('Property updated successfully', 'success');
        } else {
            await API.post('/api/properties', formData);
            toast('Property created successfully', 'success');
        }
        setTimeout(() => (window.location.href = '/admin/properties.html'), 600);
    } catch (err) {
        btn.disabled = false;
        btn.innerHTML = originalHtml;
        toast(err.message, 'error');
    }
}
