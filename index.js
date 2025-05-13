document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('userDetailsForm');
    const submitBtn = document.getElementById('submitBtn');
    const skillsInput = document.getElementById('skillsInput');
    const skillsContainer = document.getElementById('skillsContainer');
    const skillsHiddenInput = document.getElementById('skills');
    let skills = [];
    let formSubmitted = false;

    // Skills management
    skillsInput.addEventListener('keydown', function(e) {
        if (e.key === 'Enter' && this.value.trim() !== '') {
            e.preventDefault();
            const skill = this.value.trim();
            if (!skills.includes(skill)) {
                skills.push(skill);
                updateSkillsDisplay();
                updateSkillsHiddenInput();
            }
            this.value = '';
        }
    });

    function updateSkillsDisplay() {
        skillsContainer.innerHTML = '';
        skills.forEach((skill, index) => {
            const skillTag = document.createElement('div');
            skillTag.className = 'skill-tag';
            skillTag.innerHTML = `
                ${skill}
                <span class="remove-skill" data-index="${index}">
                    <i class="fas fa-times"></i>
                </span>
            `;
            skillsContainer.appendChild(skillTag);
        });

        document.querySelectorAll('.remove-skill').forEach(button => {
            button.addEventListener('click', function() {
                const index = parseInt(this.getAttribute('data-index'));
                skills.splice(index, 1);
                updateSkillsDisplay();
                updateSkillsHiddenInput();
            });
        });
    }

    function updateSkillsHiddenInput() {
        skillsHiddenInput.value = skills.join(', ');
    }

    // Form submission
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        if (formSubmitted) {
            return;
        }

        // Form validation
        const formData = new FormData(form);
        const data = Object.fromEntries(formData.entries());
        
        const requiredFields = [
            'fullName', 'gender', 'dob', 'email', 'phone', 
            'address', 'education', 'graduationYear', 'skills',
            'experience', 'resume', 'jobRole', 'relocate'
        ];
        
        let isValid = true;
        
        requiredFields.forEach(field => {
            if (!data[field]) {
                isValid = false;
                const input = form.querySelector(`[name="${field}"]`);
                input.style.borderColor = 'red';
                
                input.addEventListener('input', function() {
                    this.style.borderColor = '#ddd';
                });
            }
        });
        
        if (!isValid) {
            alert('Please fill all required fields');
            return;
        }
        
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(data.email)) {
            alert('Please enter a valid email address');
            return;
        }
        
        if (data.phone.length < 8) {
            alert('Please enter a valid phone number');
            return;
        }
        
        const resumeInput = document.getElementById('resume');
        if (resumeInput.files.length > 0) {
            const file = resumeInput.files[0];
            const validTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
            if (!validTypes.includes(file.type)) {
                alert('Please upload a PDF or Word document');
                return;
            }
            
            if (file.size > 5 * 1024 * 1024) {
                alert('File size should be less than 5MB');
                return;
            }
        }
        
        // Submit form
        submitBtn.disabled = true;
        submitBtn.textContent = 'Submitting...';
        
        // Store form data in sessionStorage
        sessionStorage.setItem('formData', JSON.stringify(data));
        
        // Redirect to success page after short delay
        setTimeout(() => {
            window.location.href = 'success.html';
        }, 1000);
    });
});